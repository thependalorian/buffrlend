/**
 * RAG Pipeline Types for BuffrLend
 * TypeScript types based on Python backend RAG pipeline
 */

// Base RAG Pipeline Types
export interface RAGPipelineConfig {
  pipeline_type: 'google_drive' | 'local_files' | 'api_ingestion'
  watch_folder_id?: string
  sub_folder_processing: boolean
  document_classification: DocumentClassification
  text_processing: TextProcessingConfig
  vector_store: VectorStoreConfig
  embedding_model: EmbeddingModelConfig
  llm_config: LLMConfig
  processing_settings: ProcessingSettings
}

export interface DocumentClassification {
  identity_keywords: string[]
  income_keywords: string[]
  fraud_indicators: string[]
}

export interface TextProcessingConfig {
  default_chunk_size: number
  default_chunk_overlap: number
  chunking_strategy: 'fixed_size' | 'semantic' | 'adaptive'
  preprocessing_steps: string[]
}

export interface VectorStoreConfig {
  provider: 'pinecone' | 'weaviate' | 'chroma' | 'faiss'
  index_name: string
  dimension: number
  metric: 'cosine' | 'euclidean' | 'dotproduct'
  connection_params: Record<string, unknown>
}

export interface EmbeddingModelConfig {
  provider: 'openai' | 'huggingface' | 'cohere'
  model_name: string
  api_key?: string
  base_url?: string
  dimension: number
  batch_size: number
}

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'cohere'
  model_name: string
  api_key?: string
  base_url?: string
  temperature: number
  max_tokens: number
  system_prompt?: string
}

export interface ProcessingSettings {
  batch_size: number
  max_workers: number
  retry_attempts: number
  timeout_seconds: number
  enable_ocr: boolean
  enable_security_analysis: boolean
  enable_ai_analysis: boolean
}

// Document Processing Types
export interface DocumentProcessor {
  id: string
  name: string
  type: 'text_extractor' | 'ocr_processor' | 'security_analyzer' | 'ai_analyzer'
  config: Record<string, unknown>
  enabled: boolean
  order: number
}

export interface ProcessingResult {
  document_id: string
  processor_id: string
  status: 'success' | 'failed' | 'pending'
  result: Record<string, unknown>
  error?: string
  processing_time: number
  created_at: Date
}

// Text Processing Types
export interface TextChunk {
  id: string
  document_id: string
  content: string
  chunk_index: number
  start_position: number
  end_position: number
  metadata: ChunkMetadata
  embedding?: number[]
  created_at: Date
}

export interface ChunkMetadata {
  source: string
  document_type: string
  page_number?: number
  section?: string
  confidence_score?: number
  language?: string
  processing_timestamp: Date
}

// Vector Store Types
export interface VectorDocument {
  id: string
  content: string
  metadata: Record<string, unknown>
  embedding: number[]
  created_at: Date
  updated_at: Date
}

export interface VectorSearchResult {
  id: string
  content: string
  metadata: Record<string, unknown>
  similarity_score: number
  distance: number
}

export interface VectorSearchRequest {
  query: string
  top_k: number
  filter?: Record<string, unknown>
  include_metadata: boolean
  similarity_threshold?: number
}

export interface VectorSearchResponse {
  results: VectorSearchResult[]
  total_results: number
  query_time: number
  query_embedding?: number[]
}

// RAG Query Types
export interface RAGQuery {
  id: string
  query: string
  context: QueryContext
  response?: RAGResponse
  created_at: Date
  updated_at: Date
}

export interface QueryContext {
  user_id?: string
  session_id?: string
  document_types?: string[]
  time_range?: {
    start: Date
    end: Date
  }
  filters?: Record<string, unknown>
  max_context_length?: number
}

export interface RAGResponse {
  id: string
  query_id: string
  answer: string
  sources: RAGSource[]
  confidence_score: number
  processing_time: number
  model_used: string
  created_at: Date
}

export interface RAGSource {
  document_id: string
  chunk_id: string
  content: string
  similarity_score: number
  metadata: Record<string, unknown>
  page_number?: number
  section?: string
}

// Pipeline Execution Types
export interface PipelineExecution {
  id: string
  pipeline_id: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  start_time: Date
  end_time?: Date
  documents_processed: number
  documents_failed: number
  errors: string[]
  progress: number
  created_at: Date
}

export interface PipelineStep {
  id: string
  execution_id: string
  step_name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  start_time?: Date
  end_time?: Date
  input_count: number
  output_count: number
  error?: string
  metadata: Record<string, unknown>
}

// Google Drive Integration Types
export interface GoogleDriveWatcher {
  id: string
  folder_id: string
  watch_enabled: boolean
  last_check_time: Date
  check_interval: number
  file_filters: FileFilter[]
  processing_rules: ProcessingRule[]
  created_at: Date
  updated_at: Date
}

export interface FileFilter {
  field: 'name' | 'mime_type' | 'size' | 'modified_time'
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than'
  value: string | number | Date
}

export interface ProcessingRule {
  id: string
  name: string
  conditions: ProcessingCondition[]
  actions: ProcessingAction[]
  enabled: boolean
  priority: number
}

export interface ProcessingCondition {
  field: string
  operator: string
  value: unknown
}

export interface ProcessingAction {
  type: 'classify' | 'extract_text' | 'analyze_security' | 'generate_embedding' | 'move_file'
  config: Record<string, unknown>
}

// Database Handler Types
export interface DatabaseHandler {
  connection_string: string
  connection_pool_size: number
  query_timeout: number
  retry_attempts: number
}

export interface DatabaseQuery {
  sql: string
  parameters?: unknown[]
  timeout?: number
}

export interface DatabaseResult<T = unknown> {
  rows: T[]
  row_count: number
  execution_time: number
  error?: string
}

// State Manager Types
export interface StateManager {
  storage_type: 'redis' | 'memory' | 'database'
  connection_config: Record<string, unknown>
  ttl_seconds: number
}

export interface StateEntry<T = unknown> {
  key: string
  value: T
  ttl: number
  created_at: Date
  updated_at: Date
}

// Text Processor Types
export interface TextProcessor {
  id: string
  name: string
  type: 'chunker' | 'preprocessor' | 'postprocessor'
  config: TextProcessorConfig
  enabled: boolean
}

export interface TextProcessorConfig {
  chunk_size?: number
  chunk_overlap?: number
  preprocessing_steps?: string[]
  postprocessing_steps?: string[]
  language_detection?: boolean
  remove_stopwords?: boolean
  stemming?: boolean
  lemmatization?: boolean
}

// Pipeline Monitoring Types
export interface PipelineMetrics {
  pipeline_id: string
  execution_id: string
  metrics: {
    documents_processed: number
    documents_failed: number
    average_processing_time: number
    total_processing_time: number
    memory_usage: number
    cpu_usage: number
    error_rate: number
  }
  timestamp: Date
}

export interface PipelineHealth {
  pipeline_id: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  last_execution?: Date
  error_count: number
  success_rate: number
  average_execution_time: number
  dependencies: DependencyHealth[]
  timestamp: Date
}

export interface DependencyHealth {
  name: string
  type: 'database' | 'api' | 'storage' | 'queue'
  status: 'healthy' | 'degraded' | 'unhealthy'
  response_time?: number
  error_message?: string
  last_check: Date
}

// API Response Types
export interface RAGApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: Date
  execution_time?: number
}

export interface PaginatedRAGResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  filters?: Record<string, unknown>
}

// Configuration Types
export interface RAGPipelineConfiguration {
  id: string
  name: string
  description?: string
  config: RAGPipelineConfig
  version: string
  is_active: boolean
  created_at: Date
  updated_at: Date
  created_by: string
}

// Error Types
export interface RAGError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
  context?: Record<string, unknown>
}

// Event Types
export interface RAGEvent {
  id: string
  type: 'document_processed' | 'pipeline_started' | 'pipeline_completed' | 'error_occurred'
  pipeline_id: string
  execution_id?: string
  data: Record<string, unknown>
  timestamp: Date
}

// Webhook Types
export interface WebhookConfig {
  url: string
  events: string[]
  secret?: string
  retry_attempts: number
  timeout_seconds: number
  enabled: boolean
}

export interface WebhookPayload {
  event_type: string
  pipeline_id: string
  execution_id?: string
  data: Record<string, unknown>
  timestamp: Date
  signature?: string
}
