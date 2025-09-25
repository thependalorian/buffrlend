/**
 * Document Types for BuffrLend
 * TypeScript types based on Python backend schemas
 */

export type DocumentType = 
  | 'national_id' 
  | 'passport' 
  | 'drivers_license' 
  | 'payslip' 
  | 'bank_statement' 
  | 'employment_letter' 
  | 'loan_agreement' 
  | 'other'

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'in_progress' | 'requires_review'

export type AuthenticityStatus = 'AUTHENTIC' | 'LIKELY_AUTHENTIC' | 'SUSPICIOUS' | 'LIKELY_FAKE'

// Base document interface
export interface DocumentBase {
  document_type: DocumentType
  file_name: string
  file_path: string
  user_id: string
  verification_status: VerificationStatus
  created_at: Date
  updated_at: Date
}

// Document creation interface
export interface DocumentCreate extends Omit<DocumentBase, 'created_at' | 'updated_at'> {
  loan_application_id?: string
}

// Document response interface
export interface DocumentResponse extends DocumentBase {
  id: string
  loan_application_id?: string
  processing_result?: OCRProcessingResult
  security_analysis?: SecurityAnalysis
  ocr_result?: OCRProcessingResult
}

// OCR Processing Types
export interface OCRProcessingResult {
  text: string
  confidence: number
  bounding_boxes: BoundingBox[]
  document_type: DocumentType
  processing_time: number
  security_features: SecurityFeatureResult
  quality_score: number
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  text: string
  confidence: number
}

// Security Analysis Types
export interface SecurityAnalysis {
  authenticity_score: number
  security_score: number
  status: AuthenticityStatus
  security_features: SecurityFeatureResult
  confidence: number
  quality_score: number
  recommendations: string[]
}

export interface SecurityFeatureResult {
  [key: string]: SecurityFeatureResponse
}

export interface SecurityFeatureResponse {
  detected: boolean
  confidence: number
  description: string
}

// Document Upload Response
export interface DocumentUploadResponse {
  success: boolean
  document_id: string
  document_type: DocumentType
  confidence: number
  quality_score: number
  processing_time: number
  extracted_text: string
  security_features: SecurityFeatureResult
  file_size: number
  mime_type: string
  uploaded_at: string
  error?: string
}

// Document Analysis Response
export interface DocumentAnalysisResponse {
  success: boolean
  document_id: string
  document_type: DocumentType
  extracted_text: string
  confidence: number
  quality_score: number
  security_features: SecurityFeatureResult
  ai_analysis_result?: Record<string, unknown>
  uploaded_at: string
  file_size: number
  mime_type: string
  error?: string
}

// Field Extraction Types
export interface FieldExtractionRequest {
  fields: string[]
}

export interface FieldExtractionResponse {
  success: boolean
  document_id: string
  document_type: DocumentType
  extracted_fields: Record<string, unknown>
  requested_fields: string[]
  error?: string
}

// Authenticity Validation Response
export interface AuthenticityValidationResponse {
  success: boolean
  document_id: string
  authenticity_score: number
  security_score: number
  status: AuthenticityStatus
  security_features: SecurityFeatureResult
  confidence: number
  quality_score: number
  recommendations: string[]
  error?: string
}

// Batch Upload Types
export interface BatchUploadRequest {
  document_types?: DocumentType[]
}

export interface BatchUploadResponse {
  success: boolean
  results: Array<{
    file_name: string
    success: boolean
    document_id?: string
    error?: string
  }>
  total_files: number
  successful_uploads: number
  error?: string
}

// Document Metadata
export interface DocumentMetadata {
  id: string
  user_id: string
  document_type: DocumentType
  file_path: string
  file_size: number
  mime_type: string
  created_at: Date
  updated_at: Date
  processing_result?: OCRProcessingResult
  security_analysis?: SecurityAnalysis
}

// Document Classification Keywords
export interface DocumentClassification {
  identity_keywords: string[]
  income_keywords: string[]
  fraud_indicators: string[]
}

// File Format Validation
export interface FileFormatValidator {
  file_extension: string
}

// OCR Configuration
export interface OCRConfig {
  supported_formats: Array<{
    extension: string
    mime_type: string
    description: string
  }>
  max_file_size: string
  document_types: Array<{
    type: DocumentType
    description: string
  }>
  security_features: string[]
  processing_timeout: number
}

// Error Response Types
export interface OCRErrorResponse {
  success: false
  error: string
  error_code?: string
  timestamp: Date
  details?: Record<string, unknown>
}

// Health Check Response
export interface OCRHealthResponse {
  status: string
  service: string
  timestamp: string
  version: string
  components?: Record<string, string>
}

// Google Drive Document Types (extending base types)
export interface GoogleDriveDocument extends DocumentResponse {
  file_id: string
  google_drive_url: string
  folder_id?: string
  parent_folder_id?: string
  modified_time: Date
  web_view_link: string
  download_url?: string
}

// Document Processing Pipeline Types
export interface DocumentProcessingPipeline {
  id: string
  name: string
  steps: ProcessingStep[]
  created_at: Date
  updated_at: Date
}

export interface ProcessingStep {
  id: string
  name: string
  type: 'ocr' | 'security_analysis' | 'ai_analysis' | 'classification'
  config: Record<string, unknown>
  order: number
  enabled: boolean
}

// KYC Workflow Types
export interface KYCWorkflowState {
  id: string
  user_id: string
  loan_application_id?: string
  workflow_status: string
  current_step: string
  requires_human_review: boolean
  final_decision?: string
  decision_reason?: string
  analysis_results?: Record<string, unknown>
  workflow_history?: Array<{
    step: string
    status: string
    timestamp: Date
    notes?: string
  }>
  created_at: Date
  updated_at: Date
}

export interface HumanReviewQueue {
  id: string
  workflow_id: string
  user_id: string
  status: string
  priority: string
  review_notes?: string
  assigned_to?: string
  assigned_at?: Date
  created_at: Date
}

// Document Sync Status
export interface DocumentSyncStatus {
  last_sync: Date
  known_files_count: number
  sync_stats: {
    files_processed: number
    files_failed: number
    files_deleted: number
    errors: string[]
    start_time?: Date
    end_time?: Date
  }
  config: {
    batch_size: number
    max_workers: number
    sync_interval: number
  }
}

// API Response Types
export interface DocumentApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: Date
}

export interface PaginatedDocumentResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// Document Statistics
export interface DocumentStats {
  total_documents: number
  documents_by_type: Record<DocumentType, number>
  last_sync?: Date
  supported_types: string[]
  processing_success_rate: number
  average_processing_time: number
}
