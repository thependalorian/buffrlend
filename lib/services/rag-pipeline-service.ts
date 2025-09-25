/**
 * Standalone RAG Pipeline Service for BuffrLend
 * Independent implementation without backend dependencies
 */

import {
  RAGResponse,
  VectorSearchResponse,
  TextChunk,
  RAGApiResponse
} from '@/lib/types/rag-pipeline'

export interface RAGPipelineServiceConfig {
  openaiApiKey?: string
  embeddingModel?: string
  llmModel?: string
  chunkSize?: number
  chunkOverlap?: number
  maxResults?: number
  similarityThreshold?: number
}

export interface QueryOptions {
  maxResults?: number
  includeMetadata?: boolean
  similarityThreshold?: number
  documentTypes?: string[]
  timeRange?: {
    start: Date
    end: Date
  }
}

export class RAGPipelineService {
  private config: RAGPipelineServiceConfig
  private documents: Map<string, TextChunk> = new Map()
  private embeddings: Map<string, number[]> = new Map()

  constructor(config?: RAGPipelineServiceConfig) {
    this.config = {
      openaiApiKey: process.env.OPENAI_API_KEY,
      embeddingModel: 'text-embedding-3-small',
      llmModel: 'gpt-3.5-turbo',
      chunkSize: 1000,
      chunkOverlap: 200,
      maxResults: 10,
      similarityThreshold: 0.7,
      ...config
    }
  }

  /**
   * Test RAG pipeline connection - standalone implementation
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      if (!this.config.openaiApiKey) {
        return {
          success: false,
          message: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY environment variable'
        }
      }

      // Test OpenAI API connection
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return {
          success: false,
          message: 'Failed to connect to OpenAI API',
          details: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      const models = await response.json()
      
      return {
        success: true,
        message: 'RAG pipeline connection successful',
        details: {
          openaiConnected: true,
          availableModels: models.data?.length || 0,
          embeddingModel: this.config.embeddingModel,
          llmModel: this.config.llmModel,
          documentsStored: this.documents.size,
          embeddingsStored: this.embeddings.size
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to test RAG pipeline connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute a RAG query - standalone implementation
   */
  async query(
    query: string,
    options: QueryOptions = {}
  ): Promise<RAGApiResponse<RAGResponse>> {
    try {
      if (!this.config.openaiApiKey) {
        return {
          success: false,
          error: 'OpenAI API key not configured',
          timestamp: new Date()
        }
      }

      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query)
      
      // Find similar documents
      const similarDocs = await this.findSimilarDocuments(
        queryEmbedding,
        options.maxResults || this.config.maxResults || 10,
        options.similarityThreshold || this.config.similarityThreshold || 0.7
      )

      // Generate response using LLM
      const context = similarDocs.map(doc => doc.content).join('\n\n')
      const response = await this.generateLLMResponse(query, context)

      const ragResponse: RAGResponse = {
        id: this.generateId(),
        query_id: this.generateId(),
        answer: response,
        sources: similarDocs.map(doc => ({
          document_id: doc.id,
          chunk_id: doc.id,
          content: doc.content,
          similarity_score: 0.8, // Placeholder
          metadata: doc.metadata as unknown as Record<string, unknown>,
          page_number: 1
        })),
        confidence_score: 0.8,
        processing_time: Date.now(),
        model_used: this.config.llmModel || 'gpt-3.5-turbo',
        created_at: new Date()
      }

      return {
        success: true,
        data: ragResponse,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  /**
   * Search for similar documents - standalone implementation
   */
  async searchSimilar(
    query: string,
    options: QueryOptions = {}
  ): Promise<RAGApiResponse<VectorSearchResponse>> {
    try {
      if (!this.config.openaiApiKey) {
        return {
          success: false,
          error: 'OpenAI API key not configured',
          timestamp: new Date()
        }
      }

      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query)
      
      // Find similar documents
      const similarDocs = await this.findSimilarDocuments(
        queryEmbedding,
        options.maxResults || this.config.maxResults || 10,
        options.similarityThreshold || this.config.similarityThreshold || 0.7
      )

      const searchResponse: VectorSearchResponse = {
        results: similarDocs.map(doc => ({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata as unknown as Record<string, unknown>,
          similarity_score: 0.8, // Placeholder - would be calculated in real implementation
          distance: 0.2
        })),
        total_results: similarDocs.length,
        query_time: Date.now()
      }

      return {
        success: true,
        data: searchResponse,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  /**
   * Add document to the knowledge base - standalone implementation
   */
  async addDocument(
    content: string,
    metadata: Record<string, unknown> = {}
  ): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      if (!this.config.openaiApiKey) {
        return {
          success: false,
          message: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY environment variable'
        }
      }

      // Chunk the document
      const chunks = this.chunkText(content)
      
      // Process each chunk
      for (const chunk of chunks) {
        const chunkId = this.generateId()
        const embedding = await this.generateEmbedding(chunk)
        
        const textChunk: TextChunk = {
          id: chunkId,
          document_id: (metadata as { document_id?: string }).document_id || 'unknown',
          content: chunk,
          chunk_index: chunks.indexOf(chunk),
          start_position: 0,
          end_position: chunk.length,
          metadata: {
            source: (metadata as { source?: string }).source || 'unknown',
            document_type: (metadata as { document_type?: string }).document_type || 'unknown',
            processing_timestamp: new Date()
          },
          embedding: embedding,
          created_at: new Date()
        }
        
        this.documents.set(chunkId, textChunk)
        this.embeddings.set(chunkId, embedding)
      }

      return {
        success: true,
        message: `Added document with ${chunks.length} chunks`,
        details: {
          chunksCreated: chunks.length,
          totalDocuments: this.documents.size
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add document',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get pipeline statistics - standalone implementation
   */
  async getStats(): Promise<{ success: boolean; message: string; details?: unknown }> {
    try {
      return {
        success: true,
        message: 'Pipeline statistics retrieved successfully',
        details: {
          totalDocuments: this.documents.size,
          totalEmbeddings: this.embeddings.size,
          config: {
            embeddingModel: this.config.embeddingModel,
            llmModel: this.config.llmModel,
            chunkSize: this.config.chunkSize,
            chunkOverlap: this.config.chunkOverlap,
            maxResults: this.config.maxResults,
            similarityThreshold: this.config.similarityThreshold
          },
          lastUpdated: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get pipeline statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // =============================================================================
  // STANDALONE HELPER METHODS
  // =============================================================================

  /**
   * Generate embedding for text using OpenAI API
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.embeddingModel || 'text-embedding-3-small',
        input: text
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  }

  /**
   * Generate LLM response using OpenAI API
   */
  private async generateLLMResponse(query: string, context: string): Promise<string> {
    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.llmModel || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on the provided context. Use only the information from the context to answer questions.'
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nQuestion: ${query}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  /**
   * Find similar documents using cosine similarity
   */
  private async findSimilarDocuments(
    queryEmbedding: number[],
    maxResults: number,
    threshold: number
  ): Promise<TextChunk[]> {
    const similarities: Array<{ chunk: TextChunk; similarity: number }> = []

    for (const [chunkId, chunk] of this.documents) {
      const embedding = this.embeddings.get(chunkId)
      if (embedding) {
        const similarity = this.cosineSimilarity(queryEmbedding, embedding)
        if (similarity >= threshold) {
          similarities.push({ chunk, similarity })
        }
      }
    }

    // Sort by similarity and return top results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults)
      .map(item => item.chunk)
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * Chunk text into smaller pieces
   */
  private chunkText(text: string): string[] {
    const chunkSize = this.config.chunkSize || 1000
    const chunkOverlap = this.config.chunkOverlap || 200
    
    const chunks: string[] = []
    let start = 0

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length)
      let chunk = text.slice(start, end)

      // Try to break at sentence boundary
      if (end < text.length) {
        const lastSentence = chunk.lastIndexOf('.')
        const lastNewline = chunk.lastIndexOf('\n')
        const breakPoint = Math.max(lastSentence, lastNewline)
        
        if (breakPoint > start + chunkSize * 0.5) {
          chunk = text.slice(start, start + breakPoint + 1)
          start = start + breakPoint + 1 - chunkOverlap
        } else {
          start = end - chunkOverlap
        }
      } else {
        start = end
      }

      chunks.push(chunk.trim())
    }

    return chunks.filter(chunk => chunk.length > 0)
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `rag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}