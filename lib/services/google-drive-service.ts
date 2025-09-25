/**
 * Enhanced Google Drive Service for BuffrLend
 * Integrates with backend API and provides comprehensive document management
 */

import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { Readable } from 'stream'
import { promises as fs } from 'fs'
import path from 'path'
import { 
  DocumentType, 
  VerificationStatus
} from '@/lib/types/documents'

export interface GoogleDriveConfig {
  credentials: {
    client_id: string
    client_secret: string
    redirect_uris: string[]
  }
  scopes: string[]
  folder_routing: {
    kyc_documents: string
    loan_agreements: string
    national_ids: string
    passports: string
    drivers_licenses: string
    payslips: string
    bank_statements: string
    employment_letters: string
    verified: string
    pending_review: string
    rejected: string
  }
  supported_mime_types: string[]
  max_file_size: number // in bytes
}

export interface GoogleDriveApiConfig {
  baseUrl: string
  apiKey?: string
  timeout: number
  retryAttempts: number
}

export interface GoogleDriveSyncOptions {
  folderId?: string
  adminId?: string
  triggeredByUser?: string
  ipAddress?: string
  userAgent?: string
}

export interface DocumentMetadata {
  file_id: string
  file_name: string
  mime_type: string
  size: number
  upload_date: Date
  document_type: DocumentType
  user_id: string
  loan_application_id?: string
  verification_status: VerificationStatus
  google_drive_url: string
}

export interface UploadResult {
  success: boolean
  file_id?: string
  file_url?: string
  document_type?: string
  error?: string
}

export class GoogleDriveService {
  private drive!: ReturnType<typeof google.drive>
  private config: GoogleDriveConfig
  private auth: unknown
  private serviceAccountAuth: unknown
  private apiConfig: GoogleDriveApiConfig
  private authToken?: string

  constructor(config?: GoogleDriveConfig, apiConfig?: GoogleDriveApiConfig) {
    this.config = config || this.getDefaultConfig()
    this.apiConfig = apiConfig || this.getDefaultApiConfig()
  }

  /**
   * Set authentication token for API requests
   */
  setAuthToken(token: string): void {
    this.authToken = token
  }

  /**
   * Get default API configuration
   */
  private getDefaultApiConfig(): GoogleDriveApiConfig {
    return {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      timeout: 30000, // 30 seconds
      retryAttempts: 3
    }
  }

  /**
   * Get default configuration from environment variables and config files
   */
  private getDefaultConfig(): GoogleDriveConfig {
    return {
      credentials: {
        client_id: process.env.GOOGLE_DRIVE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET || '',
        redirect_uris: [process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback']
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      folder_routing: {
        kyc_documents: process.env.GOOGLE_DRIVE_KYC_FOLDER_ID || '',
        loan_agreements: process.env.GOOGLE_DRIVE_LOAN_AGREEMENTS_FOLDER_ID || '',
        national_ids: process.env.GOOGLE_DRIVE_NATIONAL_IDS_FOLDER_ID || '',
        passports: process.env.GOOGLE_DRIVE_PASSPORTS_FOLDER_ID || '',
        drivers_licenses: process.env.GOOGLE_DRIVE_DRIVERS_LICENSES_FOLDER_ID || '',
        payslips: process.env.GOOGLE_DRIVE_PAYSLIPS_FOLDER_ID || '',
        bank_statements: process.env.GOOGLE_DRIVE_BANK_STATEMENTS_FOLDER_ID || '',
        employment_letters: process.env.GOOGLE_DRIVE_EMPLOYMENT_LETTERS_FOLDER_ID || '',
        verified: process.env.GOOGLE_DRIVE_VERIFIED_FOLDER_ID || '',
        pending_review: process.env.GOOGLE_DRIVE_PENDING_REVIEW_FOLDER_ID || '',
        rejected: process.env.GOOGLE_DRIVE_REJECTED_FOLDER_ID || ''
      },
      supported_mime_types: [
        'application/pdf',
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/tiff',
        'image/bmp',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.google-apps.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ],
      max_file_size: 10 * 1024 * 1024 // 10MB
    }
  }

  /**
   * Initialize Google Drive service with authentication
   */
  async initialize(): Promise<boolean> {
    try {
      // Try Workload Identity Federation first (for Vercel)
      if (await this.initializeWorkloadIdentity()) {
        return true
      }

      // Try service account authentication (for local development)
      if (await this.initializeServiceAccount()) {
        return true
      }

      // Fallback to OAuth2 authentication
      if (await this.initializeOAuth2()) {
        return true
      }

      throw new Error('Failed to initialize authentication')
    } catch (error) {
      console.error('Failed to initialize Google Drive service:', error)
      return false
    }
  }

  /**
   * Initialize with Workload Identity Federation (for Vercel)
   */
  private async initializeWorkloadIdentity(): Promise<boolean> {
    try {
      // Check if we're running on Vercel with Workload Identity Federation
      if (!process.env.VERCEL || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.log('Not running on Vercel or missing Workload Identity environment variables')
        return false
      }

      // Use GoogleAuth which automatically handles Workload Identity Federation on Vercel
      const { GoogleAuth } = await import('google-auth-library')
      
      this.serviceAccountAuth = new GoogleAuth({
        scopes: this.config.scopes,
        // The library automatically detects Vercel environment variables:
        // - GOOGLE_SERVICE_ACCOUNT_EMAIL
        // - GOOGLE_WORKLOAD_IDENTITY_PROVIDER
        // - VERCEL_OIDC_TOKEN_AUDIENCE
      })

      this.drive = google.drive({ version: 'v3', auth: this.serviceAccountAuth as Parameters<typeof google.drive>[0]['auth'] })
      console.log('Workload Identity Federation authentication successful')
      return true
    } catch (error) {
      console.error('Workload Identity Federation authentication failed:', error)
      return false
    }
  }

  /**
   * Initialize with service account authentication
   */
  private async initializeServiceAccount(): Promise<boolean> {
    try {
      // Try to load credentials from file
      const credentialsPath = path.join(process.cwd(), 'credentials.json')
      let credentials

      try {
        const credentialsFile = await fs.readFile(credentialsPath, 'utf8')
        credentials = JSON.parse(credentialsFile)
      } catch {
        // Try environment variable
        const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON
        if (credentialsJson) {
          credentials = JSON.parse(credentialsJson)
          
          // Check if this is web application credentials format
          if (credentials.web) {
            console.log('Web application credentials detected, skipping service account auth')
            return false
          }
        } else {
          return false
        }
      }

      // Only proceed if we have valid service account credentials
      if (!credentials.private_key || !credentials.client_email || 
          credentials.private_key.includes('REPLACE_WITH_ACTUAL') ||
          credentials.client_email.includes('REPLACE_WITH_ACTUAL')) {
        console.log('No valid service account credentials found (contains placeholder values)')
        return false
      }

      this.serviceAccountAuth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: this.config.scopes,
      })

      this.drive = google.drive({ version: 'v3', auth: this.serviceAccountAuth as Parameters<typeof google.drive>[0]['auth'] })
      return true
    } catch (error) {
      console.error('Service account authentication failed:', error)
      return false
    }
  }

  /**
   * Initialize with OAuth2 authentication
   */
  private async initializeOAuth2(): Promise<boolean> {
    try {
      // Check if we have web application credentials
      const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON
      let clientId = this.config.credentials.client_id
      let clientSecret = this.config.credentials.client_secret
      let redirectUri = this.config.credentials.redirect_uris[0]

      if (credentialsJson) {
        try {
          const credentials = JSON.parse(credentialsJson)
          if (credentials.web) {
            clientId = credentials.web.client_id
            clientSecret = credentials.web.client_secret
            redirectUri = credentials.web.redirect_uris[0] || redirectUri
            console.log('Using web application credentials for OAuth2')
          }
        } catch (error) {
          console.error('Failed to parse credentials JSON:', error)
        }
      }

      if (!clientId || !clientSecret) {
        console.log('Missing OAuth2 credentials')
        return false
      }

      this.auth = new OAuth2Client(clientId, clientSecret, redirectUri)

      // Try to load existing token
      const token = await this.loadToken()
      if (token) {
        (this.auth as OAuth2Client).setCredentials(token)
      } else {
        // For now, we'll skip the authentication requirement in development
        // In production, you would need to implement proper OAuth2 flow
        console.log('No token found, OAuth2 authentication will be required for actual API calls')
        // Don't throw error, just log and continue
        // throw new Error('Authentication required. Please visit the auth URL and complete authentication.')
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth as Parameters<typeof google.drive>[0]['auth'] })
      return true
    } catch (error) {
      console.error('OAuth2 authentication failed:', error)
      return false
    }
  }

  /**
   * Upload document to Google Drive with automatic classification
   */
  async uploadDocument(
    file: Buffer | Readable,
    fileName: string,
    mimeType: string,
    userId: string,
    loanApplicationId?: string
  ): Promise<UploadResult> {
    try {
      // Classify document type
      const documentType = this.classifyDocument(fileName)
      
      // Get target folder ID
      const folderId = this.getTargetFolderId(documentType)
      
      // Upload file to Google Drive
      const fileMetadata = {
        name: fileName,
        parents: [folderId],
      }

      const media = {
        mimeType: mimeType,
        body: file instanceof Buffer ? Readable.from(file) : file,
      }

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,size,createdTime',
      })

      const fileId = response.data.id!
      const fileUrl = response.data.webViewLink!

      // Create document metadata
      const metadata: DocumentMetadata = {
        file_id: fileId,
        file_name: fileName,
        mime_type: mimeType,
        size: parseInt(response.data.size || '0'),
        upload_date: new Date(),
        document_type: documentType,
        user_id: userId,
        loan_application_id: loanApplicationId,
        verification_status: 'pending',
        google_drive_url: fileUrl,
      }

      // Save metadata to database (implement this method)
      await this.saveDocumentMetadata(metadata)

      return {
        success: true,
        file_id: fileId,
        file_url: fileUrl,
        document_type: documentType,
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Check if a file type is supported
   * @private
   */
  private _is_supported_file_type(mimeType: string): boolean {
    return this.config.supported_mime_types.includes(mimeType)
  }

  /**
   * Classify document type based on filename and MIME type
   */
  private classifyDocument(fileName: string): DocumentMetadata['document_type'] {
    const name = fileName.toLowerCase()
    
    // Identity documents
    if (name.includes('national') && name.includes('id')) return 'national_id'
    if (name.includes('passport')) return 'passport'
    if (name.includes('driver') && name.includes('license')) return 'drivers_license'
    
    // Income documents
    if (name.includes('payslip') || name.includes('salary')) return 'payslip'
    if (name.includes('bank') && name.includes('statement')) return 'bank_statement'
    if (name.includes('employment') && name.includes('letter')) return 'employment_letter'
    
    // Loan documents
    if (name.includes('loan') && name.includes('agreement')) return 'loan_agreement'
    
    return 'other'
  }

  /**
   * Get target folder ID based on document type
   */
  private getTargetFolderId(documentType: DocumentMetadata['document_type']): string {
    const routing = this.config.folder_routing
    
    switch (documentType) {
      case 'national_id':
        return routing.national_ids
      case 'passport':
        return routing.passports
      case 'drivers_license':
        return routing.drivers_licenses
      case 'payslip':
        return routing.payslips
      case 'bank_statement':
        return routing.bank_statements
      case 'employment_letter':
        return routing.employment_letters
      case 'loan_agreement':
        return routing.loan_agreements
      default:
        return routing.pending_review
    }
  }

  /**
   * Move document to verified folder
   */
  async verifyDocument(fileId: string): Promise<boolean> {
    try {
      const verifiedFolderId = this.config.folder_routing.verified
      
      // Get current parents
      const file = await this.drive.files.get({
        fileId: fileId,
        fields: 'parents',
      })
      
      const previousParents = file.data.parents?.join(',') || ''
      
      // Move to verified folder
      await this.drive.files.update({
        fileId: fileId,
        addParents: verifiedFolderId,
        removeParents: previousParents,
        fields: 'id,parents',
      })

      // Update metadata in database
      await this.updateDocumentStatus(fileId, 'verified')
      
      return true
    } catch (error) {
      console.error('Error verifying document:', error)
      return false
    }
  }

  /**
   * Move document to rejected folder
   */
  async rejectDocument(fileId: string, reason?: string): Promise<boolean> {
    try {
      const rejectedFolderId = this.config.folder_routing.rejected
      
      // Get current parents
      const file = await this.drive.files.get({
        fileId: fileId,
        fields: 'parents',
      })
      
      const previousParents = file.data.parents?.join(',') || ''
      
      // Move to rejected folder
      await this.drive.files.update({
        fileId: fileId,
        addParents: rejectedFolderId,
        removeParents: previousParents,
        fields: 'id,parents',
      })

      // Update metadata in database
      await this.updateDocumentStatus(fileId, 'rejected', reason)
      
      return true
    } catch (error) {
      console.error('Error rejecting document:', error)
      return false
    }
  }

  /**
   * Get document by file ID
   */
  async getDocument(fileId: string): Promise<DocumentMetadata | null> {
    try {
      const file = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,size,createdTime,webViewLink,parents',
      })

      // Get metadata from database
      const metadata = await this.getDocumentMetadata()
      if (!metadata) return null

      return {
        ...metadata,
        google_drive_url: file.data.webViewLink!,
      }
    } catch (error) {
      console.error('Error getting document:', error)
      return null
    }
  }

  /**
   * List documents for a user
   */
  async listUserDocuments(): Promise<DocumentMetadata[]> {
    try {
      // Get documents from database
      const documents = await this.getUserDocuments()
      return documents
    } catch (error) {
      console.error('Error listing user documents:', error)
      return []
    }
  }

  /**
   * Delete document from Google Drive
   */
  async deleteDocument(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      })

      // Remove from database
      await this.deleteDocumentMetadata(fileId)
      
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      return false
    }
  }

  /**
   * Create folder structure in Google Drive
   */
  async createFolderStructure(): Promise<boolean> {
    try {
      const folders = [
        { name: 'KYC_Documents', parent: null },
        { name: 'National_IDs', parent: 'KYC_Documents' },
        { name: 'Passports', parent: 'KYC_Documents' },
        { name: 'Drivers_Licenses', parent: 'KYC_Documents' },
        { name: 'Payslips', parent: 'KYC_Documents' },
        { name: 'Bank_Statements', parent: 'KYC_Documents' },
        { name: 'Employment_Letters', parent: 'KYC_Documents' },
        { name: 'Loan_Agreements', parent: null },
        { name: 'Verified', parent: null },
        { name: 'Pending_Review', parent: null },
        { name: 'Rejected', parent: null },
      ]

      const folderIds: Record<string, string> = {}

      for (const folder of folders) {
        const folderMetadata = {
          name: folder.name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: folder.parent ? [folderIds[folder.parent]] : undefined,
        }

        const response = await this.drive.files.create({
          requestBody: folderMetadata,
          fields: 'id,name',
        })

        folderIds[folder.name] = response.data.id!
        console.log(`Created folder: ${folder.name} (ID: ${response.data.id})`)
      }

      return true
    } catch (error) {
      console.error('Error creating folder structure:', error)
      return false
    }
  }

  /**
   * Load authentication token from storage
   */
  private async loadToken(): Promise<unknown> {
    try {
      const tokenPath = path.join(process.cwd(), 'token.json')
      const tokenFile = await fs.readFile(tokenPath, 'utf8')
      return JSON.parse(tokenFile)
    } catch {
      console.log('No token file found, authentication required')
      return null
    }
  }

  /**
   * Save authentication token to storage
   */
  private async saveToken(token: unknown): Promise<void> {
    try {
      const tokenPath = path.join(process.cwd(), 'token.json')
      await fs.writeFile(tokenPath, JSON.stringify(token, null, 2))
      console.log('Token saved successfully')
    } catch (error) {
      console.error('Failed to save token:', error)
    }
  }

  /**
   * Save document metadata to database
   */
  private async saveDocumentMetadata(metadata: DocumentMetadata): Promise<void> {
    // Implement database save logic
    // This should integrate with your existing database service
    console.log('Saving document metadata:', metadata)
  }

  /**
   * Update document verification status
   */
  private async updateDocumentStatus(fileId: string, status: 'verified' | 'rejected', reason?: string): Promise<void> {
    // Implement database update logic
    console.log(`Updating document ${fileId} status to ${status}`, reason ? `Reason: ${reason}` : '')
  }

  /**
   * Get document metadata from database
   */
  private async getDocumentMetadata(): Promise<DocumentMetadata | null> {
    // Implement database query logic
    return null
  }

  /**
   * Get user documents from database
   */
  private async getUserDocuments(): Promise<DocumentMetadata[]> {
    // Implement database query logic
    return []
  }

  /**
   * Delete document metadata from database
   */
  private async deleteDocumentMetadata(fileId: string): Promise<void> {
    // Implement database delete logic
    console.log(`Deleting document metadata for ${fileId}`)
  }

  // =============================================================================
  // STANDALONE GOOGLE DRIVE METHODS - Independent Implementation
  // =============================================================================

  /**
   * Test Google Drive connection directly
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      // Initialize the service first
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      // Test by listing files in the root directory
      const response = await this.drive.files.list({
        pageSize: 1,
        fields: 'nextPageToken, files(id, name)',
      })

      return {
        success: true,
        message: 'Google Drive connection successful',
        details: {
          filesFound: response.data.files?.length || 0,
          hasNextPage: !!response.data.nextPageToken
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to Google Drive API',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Start Google Drive sync - standalone implementation
   */
  async startSync(options: GoogleDriveSyncOptions = {}): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      // Get folder contents
      const folderId = options.folderId || 'root'
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
        pageSize: 100
      })

      const files = response.data.files || []
      
      return {
        success: true,
        message: `Sync completed. Found ${files.length} files.`,
        details: {
          filesFound: files.length,
          folderId: folderId,
          files: files.map((file) => ({
            id: file.id || '',
            name: file.name || '',
            mimeType: file.mimeType || '',
            size: file.size || '',
            modifiedTime: file.modifiedTime || ''
          }))
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sync Google Drive',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get sync status - standalone implementation
   */
  async getSyncStatus(): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      // Get basic stats about the Google Drive
      const response = await this.drive.about.get({
        fields: 'user, storageQuota, maxUploadSize'
      })

      return {
        success: true,
        message: 'Sync status retrieved successfully',
        details: {
          user: response.data.user,
          storageQuota: response.data.storageQuota,
          maxUploadSize: response.data.maxUploadSize,
          lastCheck: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get sync status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get folder structure - standalone implementation
   */
  async getFolderStructure(folderId?: string): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      const targetFolderId = folderId || 'root'
      
      // Get folders and files in the specified folder
      const response = await this.drive.files.list({
        q: `'${targetFolderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, parents)',
        pageSize: 100
      })

      const items = response.data.files || []
      const folders = items.filter((item: unknown) => (item as { mimeType: string }).mimeType === 'application/vnd.google-apps.folder')
      const files = items.filter((item: unknown) => (item as { mimeType: string }).mimeType !== 'application/vnd.google-apps.folder')

      return {
        success: true,
        message: `Folder structure retrieved successfully`,
        details: {
          folderId: targetFolderId,
          folders: folders.map((folder) => ({
            id: folder.id || '',
            name: folder.name || '',
            modifiedTime: folder.modifiedTime || ''
          })),
          files: files.map((file) => ({
            id: file.id || '',
            name: file.name || '',
            mimeType: file.mimeType || '',
            size: file.size || '',
            modifiedTime: file.modifiedTime || ''
          })),
          totalItems: items.length
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get folder structure',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get documents with filtering - standalone implementation
   */
  async getDocuments(options: {
    documentType?: DocumentType
    limit?: number
    offset?: number
  } = {}): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      const limit = options.limit || 50
      // const offset = options.offset || 0 // Not used in current implementation

      // Build query based on document type
      let query = 'trashed=false'
      if (options.documentType) {
        const folderId = this.getTargetFolderId(options.documentType)
        if (folderId) {
          query += ` and '${folderId}' in parents`
        }
      }

      const response = await this.drive.files.list({
        q: query,
        fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, parents)',
        pageSize: limit,
        orderBy: 'modifiedTime desc'
      })

      const files = response.data.files || []
      const documents = files.map((file) => ({
        id: file.id || '',
        file_name: file.name || '',
        mime_type: file.mimeType || '',
        size: file.size || '',
        modified_time: file.modifiedTime || '',
        web_view_link: file.webViewLink || '',
        parents: file.parents || []
      }))

      return {
        success: true,
        message: `Retrieved ${documents.length} documents`,
        details: {
          documents: documents,
          total: documents.length,
          hasNextPage: !!response.data.nextPageToken
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get documents',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get specific document by file ID - standalone implementation
   */
  async getDocumentById(fileId: string): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, modifiedTime, webViewLink, parents, createdTime'
      })

      return {
        success: true,
        message: 'Document retrieved successfully',
        details: {
          id: response.data.id,
          name: response.data.name,
          mimeType: response.data.mimeType,
          size: response.data.size,
          modifiedTime: response.data.modifiedTime,
          createdTime: response.data.createdTime,
          webViewLink: response.data.webViewLink,
          parents: response.data.parents
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get document',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete document - standalone implementation
   */
  async deleteDocumentById(fileId: string): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      await this.drive.files.delete({
        fileId: fileId
      })

      return {
        success: true,
        message: 'Document deleted successfully',
        details: { fileId }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete document',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get Google Drive statistics - standalone implementation
   */
  async getStats(): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          success: false,
          message: 'Failed to initialize Google Drive service',
          details: 'Authentication or configuration issue'
        }
      }

      const aboutResponse = await this.drive.about.get({
        fields: 'user, storageQuota, maxUploadSize'
      })

      // Get total file count
      const filesResponse = await this.drive.files.list({
        fields: 'nextPageToken',
        pageSize: 1
      })

      return {
        success: true,
        message: 'Statistics retrieved successfully',
        details: {
          user: aboutResponse.data.user,
          storageQuota: aboutResponse.data.storageQuota,
          maxUploadSize: aboutResponse.data.maxUploadSize,
          hasFiles: !!filesResponse.data.nextPageToken,
          lastCheck: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService();
