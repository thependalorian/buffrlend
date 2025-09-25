/**
 * Google Drive Service Tests
 * Tests document upload, classification, and Google Drive integration
 */

import { GoogleDriveService, GoogleDriveConfig } from '@/lib/services/google-drive-service'

// Mock Google APIs
jest.mock('googleapis', () => ({
  google: {
    drive: jest.fn(() => ({
      files: {
        create: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}))

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(() => ({
    setCredentials: jest.fn(),
    generateAuthUrl: jest.fn(() => 'https://auth.url'),
  })),
}))

describe('GoogleDriveService', () => {
  let service: GoogleDriveService
  let mockConfig: GoogleDriveConfig

  beforeEach(() => {
    mockConfig = {
      credentials: {
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        redirect_uris: ['http://localhost:3000/callback'],
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
      folder_routing: {
        kyc_documents: 'kyc-folder-id',
        loan_agreements: 'loan-folder-id',
        national_ids: 'national-id-folder-id',
        passports: 'passport-folder-id',
        drivers_licenses: 'drivers-license-folder-id',
        payslips: 'payslip-folder-id',
        bank_statements: 'bank-statement-folder-id',
        employment_letters: 'employment-letter-folder-id',
        verified: 'verified-folder-id',
        pending_review: 'pending-folder-id',
        rejected: 'rejected-folder-id',
      },
      supported_mime_types: [
        'application/pdf',
        'image/png',
        'image/jpg',
        'image/jpeg',
      ],
      max_file_size: 10 * 1024 * 1024, // 10MB
    }

    service = new GoogleDriveService(mockConfig)
  })

  describe('Document Classification', () => {
    it('should classify national ID documents correctly', () => {
      const result = (service as any).classifyDocument('national_id_123.pdf', 'application/pdf')
      expect(result).toBe('national_id')
    })

    it('should classify passport documents correctly', () => {
      const result = (service as any).classifyDocument('passport_scan.jpg', 'image/jpeg')
      expect(result).toBe('passport')
    })

    it('should classify driver license documents correctly', () => {
      const result = (service as any).classifyDocument('drivers_license.pdf', 'application/pdf')
      expect(result).toBe('drivers_license')
    })

    it('should classify payslip documents correctly', () => {
      const result = (service as any).classifyDocument('salary_payslip.pdf', 'application/pdf')
      expect(result).toBe('payslip')
    })

    it('should classify bank statement documents correctly', () => {
      const result = (service as any).classifyDocument('bank_statement.pdf', 'application/pdf')
      expect(result).toBe('bank_statement')
    })

    it('should classify employment letter documents correctly', () => {
      const result = (service as any).classifyDocument('employment_letter.pdf', 'application/pdf')
      expect(result).toBe('employment_letter')
    })

    it('should classify loan agreement documents correctly', () => {
      const result = (service as any).classifyDocument('loan_agreement.pdf', 'application/pdf')
      expect(result).toBe('loan_agreement')
    })

    it('should classify unknown documents as other', () => {
      const result = (service as any).classifyDocument('random_document.pdf', 'application/pdf')
      expect(result).toBe('other')
    })
  })

  describe('Folder Routing', () => {
    it('should return correct folder ID for national ID', () => {
      const result = (service as any).getTargetFolderId('national_id')
      expect(result).toBe('national-id-folder-id')
    })

    it('should return correct folder ID for passport', () => {
      const result = (service as any).getTargetFolderId('passport')
      expect(result).toBe('passport-folder-id')
    })

    it('should return correct folder ID for driver license', () => {
      const result = (service as any).getTargetFolderId('drivers_license')
      expect(result).toBe('drivers-license-folder-id')
    })

    it('should return correct folder ID for payslip', () => {
      const result = (service as any).getTargetFolderId('payslip')
      expect(result).toBe('payslip-folder-id')
    })

    it('should return correct folder ID for bank statement', () => {
      const result = (service as any).getTargetFolderId('bank_statement')
      expect(result).toBe('bank-statement-folder-id')
    })

    it('should return correct folder ID for employment letter', () => {
      const result = (service as any).getTargetFolderId('employment_letter')
      expect(result).toBe('employment-letter-folder-id')
    })

    it('should return correct folder ID for loan agreement', () => {
      const result = (service as any).getTargetFolderId('loan_agreement')
      expect(result).toBe('loan-folder-id')
    })

    it('should return pending review folder for unknown document types', () => {
      const result = (service as any).getTargetFolderId('other')
      expect(result).toBe('pending-folder-id')
    })
  })

  describe('File Type Validation', () => {
    it('should accept supported file types', () => {
      const supportedTypes = [
        'application/pdf',
        'image/png',
        'image/jpg',
        'image/jpeg',
      ]

      supportedTypes.forEach(type => {
        const result = (service as any)._is_supported_file_type(type)
        expect(result).toBe(true)
      })
    })

    it('should reject unsupported file types', () => {
      const unsupportedTypes = [
        'application/zip',
        'video/mp4',
        'audio/mp3',
        'text/html',
      ]

      unsupportedTypes.forEach(type => {
        const result = (service as any)._is_supported_file_type(type)
        expect(result).toBe(false)
      })
    })
  })

  describe('Document Upload', () => {
    beforeEach(() => {
      // Mock successful Google Drive API response
      const mockDrive = {
        files: {
          create: jest.fn().mockResolvedValue({
            data: {
              id: 'test-file-id',
              name: 'test-document.pdf',
              webViewLink: 'https://drive.google.com/file/d/test-file-id/view',
              size: '1024',
              createdTime: '2024-01-01T00:00:00Z',
            },
          }),
        },
      }

      ;(service as any).drive = mockDrive
      ;(service as any).saveDocumentMetadata = jest.fn()
    })

    it('should upload document successfully', async () => {
      const fileBuffer = Buffer.from('test file content')
      const fileName = 'national_id.pdf'
      const mimeType = 'application/pdf'
      const userId = 'user-123'

      const result = await service.uploadDocument(fileBuffer, fileName, mimeType, userId)

      expect(result.success).toBe(true)
      expect(result.file_id).toBe('test-file-id')
      expect(result.file_url).toBe('https://drive.google.com/file/d/test-file-id/view')
      expect(result.document_type).toBe('national_id')
    })

    it('should handle upload errors gracefully', async () => {
      // Mock failed Google Drive API response
      const mockDrive = {
        files: {
          create: jest.fn().mockRejectedValue(new Error('Upload failed')),
        },
      }

      ;(service as any).drive = mockDrive

      const fileBuffer = Buffer.from('test file content')
      const fileName = 'test.pdf'
      const mimeType = 'application/pdf'
      const userId = 'user-123'

      const result = await service.uploadDocument(fileBuffer, fileName, mimeType, userId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Upload failed')
    })
  })

  describe('Document Verification', () => {
    beforeEach(() => {
      const mockDrive = {
        files: {
          get: jest.fn().mockResolvedValue({
            data: {
              parents: ['pending-folder-id'],
            },
          }),
          update: jest.fn().mockResolvedValue({
            data: {
              id: 'test-file-id',
              parents: ['verified-folder-id'],
            },
          }),
        },
      }

      ;(service as any).drive = mockDrive
      ;(service as any).updateDocumentStatus = jest.fn()
    })

    it('should verify document successfully', async () => {
      const result = await service.verifyDocument('test-file-id')

      expect(result).toBe(true)
      expect((service as any).updateDocumentStatus).toHaveBeenCalledWith('test-file-id', 'verified')
    })

    it('should reject document successfully', async () => {
      const result = await service.rejectDocument('test-file-id', 'Invalid document')

      expect(result).toBe(true)
      expect((service as any).updateDocumentStatus).toHaveBeenCalledWith('test-file-id', 'rejected', 'Invalid document')
    })
  })

  describe('Document Retrieval', () => {
    beforeEach(() => {
      const mockDrive = {
        files: {
          get: jest.fn().mockResolvedValue({
            data: {
              id: 'test-file-id',
              name: 'test-document.pdf',
              mimeType: 'application/pdf',
              size: '1024',
              createdTime: '2024-01-01T00:00:00Z',
              webViewLink: 'https://drive.google.com/file/d/test-file-id/view',
              parents: ['verified-folder-id'],
            },
          }),
        },
      }

      ;(service as any).drive = mockDrive
      ;(service as any).getDocumentMetadata = jest.fn().mockResolvedValue({
        file_id: 'test-file-id',
        file_name: 'test-document.pdf',
        mime_type: 'application/pdf',
        size: 1024,
        upload_date: new Date('2024-01-01T00:00:00Z'),
        document_type: 'national_id',
        user_id: 'user-123',
        verification_status: 'verified',
        google_drive_url: 'https://drive.google.com/file/d/test-file-id/view',
      })
    })

    it('should retrieve document successfully', async () => {
      const result = await service.getDocument('test-file-id')

      expect(result).not.toBeNull()
      expect(result?.file_id).toBe('test-file-id')
      expect(result?.file_name).toBe('test-document.pdf')
      expect(result?.document_type).toBe('national_id')
      expect(result?.verification_status).toBe('verified')
    })

    it('should return null for non-existent document', async () => {
      ;(service as any).getDocumentMetadata = jest.fn().mockResolvedValue(null)

      const result = await service.getDocument('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('Document Deletion', () => {
    beforeEach(() => {
      const mockDrive = {
        files: {
          delete: jest.fn().mockResolvedValue({}),
        },
      }

      ;(service as any).drive = mockDrive
      ;(service as any).deleteDocumentMetadata = jest.fn()
    })

    it('should delete document successfully', async () => {
      const result = await service.deleteDocument('test-file-id')

      expect(result).toBe(true)
      expect((service as any).deleteDocumentMetadata).toHaveBeenCalledWith('test-file-id')
    })

    it('should handle deletion errors gracefully', async () => {
      const mockDrive = {
        files: {
          delete: jest.fn().mockRejectedValue(new Error('Delete failed')),
        },
      }

      ;(service as any).drive = mockDrive

      const result = await service.deleteDocument('test-file-id')

      expect(result).toBe(false)
    })
  })

  describe('Folder Structure Creation', () => {
    beforeEach(() => {
      const mockDrive = {
        files: {
          create: jest.fn().mockResolvedValue({
            data: {
              id: 'test-folder-id',
              name: 'Test Folder',
            },
          }),
        },
      }

      ;(service as any).drive = mockDrive
    })

    it('should create folder structure successfully', async () => {
      const result = await service.createFolderStructure()

      expect(result).toBe(true)
      expect((service as any).drive.files.create).toHaveBeenCalledTimes(11) // 11 folders
    })

    it('should handle folder creation errors gracefully', async () => {
      const mockDrive = {
        files: {
          create: jest.fn().mockRejectedValue(new Error('Folder creation failed')),
        },
      }

      ;(service as any).drive = mockDrive

      const result = await service.createFolderStructure()

      expect(result).toBe(false)
    })
  })

  describe('User Document Listing', () => {
    beforeEach(() => {
      ;(service as any).getUserDocuments = jest.fn().mockResolvedValue([
        {
          file_id: 'file-1',
          file_name: 'national_id.pdf',
          document_type: 'national_id',
          verification_status: 'verified',
        },
        {
          file_id: 'file-2',
          file_name: 'payslip.pdf',
          document_type: 'payslip',
          verification_status: 'pending',
        },
      ])
    })

    it('should list user documents successfully', async () => {
      const result = await service.listUserDocuments()

      expect(result).toHaveLength(2)
      expect(result[0].file_name).toBe('national_id.pdf')
      expect(result[1].file_name).toBe('payslip.pdf')
    })

    it('should return empty array for user with no documents', async () => {
      ;(service as any).getUserDocuments = jest.fn().mockResolvedValue([])

      const result = await service.listUserDocuments()

      expect(result).toHaveLength(0)
    })
  })
})
