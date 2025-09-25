/**
 * LlamaIndex Service for WhatsApp AI Agent
 * 
 * This service provides document intelligence and Retrieval-Augmented Generation (RAG)
 * capabilities for the WhatsApp AI agent, enabling context-aware responses to customer inquiries.
 */

import { Document, VectorStoreIndex } from 'llamaindex';
import { createClient } from '@/lib/supabase/client';

export interface DocumentContext {
  id: string;
  title: string;
  content: string;
  type: 'loan_agreement' | 'policy' | 'faq' | 'correspondence' | 'payment_history';
  customerId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerContext {
  customerId: string;
  context: string;
  relevantDocuments: DocumentContext[];
  loanHistory: LoanHistory[];
  paymentHistory: PaymentHistory[];
  conversationHistory: ConversationHistory[];
}

export interface LoanHistory {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  dueDate: Date;
  interestRate: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  dueDate: Date;
  paidDate?: Date;
  method: string;
}

export interface ConversationHistory {
  id: string;
  content: string;
  timestamp: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  resolved: boolean;
}

export class LlamaIndexService {
  private index!: VectorStoreIndex;
  private documents: Document[] = [];
  private getSupabaseClient = async () => await createClient();
  private supabase = createClient();
  private isInitialized = false;

  constructor() {
    this.initializeIndex();
  }

  /**
   * Initialize the LlamaIndex with documents from various sources
   */
  private async initializeIndex(): Promise<void> {
    try {
      console.log('Initializing LlamaIndex service...');
      
      // Load documents from multiple sources
      const documents = await this.loadDocumentsFromSources();
      
      if (documents.length === 0) {
        console.warn('No documents found for indexing');
        this.index = await VectorStoreIndex.fromDocuments([]);
        return;
      }

      // Create vector index
      this.index = await VectorStoreIndex.fromDocuments(documents);
      this.documents = documents;
      this.isInitialized = true;
      
      console.log(`LlamaIndex initialized with ${documents.length} documents`);
    } catch (error) {
      console.error('Failed to initialize LlamaIndex:', error);
      throw new Error('LlamaIndex initialization failed');
    }
  }

  /**
   * Load documents from various sources (database, file system, etc.)
   */
  private async loadDocumentsFromSources(): Promise<Document[]> {
    const documents: Document[] = [];

    try {
      // Load policy documents
      const policyDocs = await this.loadPolicyDocuments();
      documents.push(...policyDocs);

      // Load FAQ documents
      const faqDocs = await this.loadFAQDocuments();
      documents.push(...faqDocs);

      // Load loan agreement templates
      const loanDocs = await this.loadLoanAgreementTemplates();
      documents.push(...loanDocs);

      // Load customer correspondence templates
      const correspondenceDocs = await this.loadCorrespondenceTemplates();
      documents.push(...correspondenceDocs);

    } catch (error) {
      console.error('Error loading documents:', error);
    }

    return documents;
  }

  /**
   * Load policy documents from database
   */
  private async loadPolicyDocuments(): Promise<Document[]> {
    try {
      const { data: policies, error } = await this.supabase
        .from('policy_documents')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Error loading policy documents:', error);
        return [];
      }

      return policies.map(policy => new Document({
        id_: `policy_${policy.id}`,
        text: `${policy.title}\n\n${policy.content}`,
        metadata: {
          type: 'policy',
          category: policy.category,
          effectiveDate: policy.effective_date,
          version: policy.version
        }
      }));
    } catch (error) {
      console.error('Error loading policy documents:', error);
      return [];
    }
  }

  /**
   * Load FAQ documents from database
   */
  private async loadFAQDocuments(): Promise<Document[]> {
    try {
      const { data: faqs, error } = await this.supabase
        .from('faq_documents')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Error loading FAQ documents:', error);
        return [];
      }

      return faqs.map(faq => new Document({
        id_: `faq_${faq.id}`,
        text: `Q: ${faq.question}\nA: ${faq.answer}`,
        metadata: {
          type: 'faq',
          category: faq.category,
          tags: faq.tags,
          language: faq.language
        }
      }));
    } catch (error) {
      console.error('Error loading FAQ documents:', error);
      return [];
    }
  }

  /**
   * Load loan agreement templates
   */
  private async loadLoanAgreementTemplates(): Promise<Document[]> {
    try {
      const { data: templates, error } = await this.supabase
        .from('loan_agreement_templates')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Error loading loan agreement templates:', error);
        return [];
      }

      return templates.map(template => new Document({
        id_: `loan_template_${template.id}`,
        text: `${template.title}\n\n${template.content}`,
        metadata: {
          type: 'loan_agreement',
          loanType: template.loan_type,
          minAmount: template.min_amount,
          maxAmount: template.max_amount,
          termMonths: template.term_months
        }
      }));
    } catch (error) {
      console.error('Error loading loan agreement templates:', error);
      return [];
    }
  }

  /**
   * Load correspondence templates
   */
  private async loadCorrespondenceTemplates(): Promise<Document[]> {
    try {
      const { data: templates, error } = await this.supabase
        .from('correspondence_templates')
        .select('*')
        .eq('active', true);

      if (error) {
        console.error('Error loading correspondence templates:', error);
        return [];
      }

      return templates.map(template => new Document({
        id_: `correspondence_${template.id}`,
        text: `${template.title}\n\n${template.content}`,
        metadata: {
          type: 'correspondence',
          category: template.category,
          language: template.language,
          useCase: template.use_case
        }
      }));
    } catch (error) {
      console.error('Error loading correspondence templates:', error);
      return [];
    }
  }

  /**
   * Retrieve relevant context for a customer query
   */
  async retrieveRelevantContext(
    query: string, 
    customerId?: string,
    documentTypes?: string[]
  ): Promise<string> {
    if (!this.isInitialized) {
      await this.initializeIndex();
    }

    try {
      const queryEngine = this.index.asQueryEngine();
      
      // Enhance query with customer context if available
      let enhancedQuery = query;
      if (customerId) {
        enhancedQuery = `${query} [Customer ID: ${customerId}]`;
      }

      // Add document type filters if specified
      if (documentTypes && documentTypes.length > 0) {
        enhancedQuery += ` [Document types: ${documentTypes.join(', ')}]`;
      }

      const response = await queryEngine.query({ query: enhancedQuery });
      return response.toString();
    } catch (error) {
      console.error('Error retrieving context:', error);
      return 'I apologize, but I cannot retrieve the relevant information at this time.';
    }
  }

  /**
   * Get customer-specific context including loan and payment history
   */
  async getCustomerContext(customerId: string, query: string): Promise<CustomerContext> {
    try {
      // Retrieve general context
      const context = await this.retrieveRelevantContext(query, customerId);

      // Get customer-specific documents
      const relevantDocuments = await this.getCustomerDocuments(customerId);

      // Get loan history
      const loanHistory = await this.getCustomerLoanHistory(customerId);

      // Get payment history
      const paymentHistory = await this.getCustomerPaymentHistory(customerId);

      // Get conversation history
      const conversationHistory = await this.getCustomerConversationHistory(customerId);

      return {
        customerId,
        context,
        relevantDocuments,
        loanHistory,
        paymentHistory,
        conversationHistory
      };
    } catch (error) {
      console.error('Error getting customer context:', error);
      throw new Error('Failed to retrieve customer context');
    }
  }

  /**
   * Get customer-specific documents
   */
  private async getCustomerDocuments(customerId: string): Promise<DocumentContext[]> {
    try {
      const { data: documents, error } = await this.supabase
        .from('customer_documents')
        .select('*')
        .eq('customer_id', customerId)
        .eq('active', true);

      if (error) {
        console.error('Error loading customer documents:', error);
        return [];
      }

      return documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        type: doc.type,
        customerId: doc.customer_id,
        metadata: doc.metadata,
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at)
      }));
    } catch (error) {
      console.error('Error loading customer documents:', error);
      return [];
    }
  }

  /**
   * Get customer loan history
   */
  private async getCustomerLoanHistory(customerId: string): Promise<LoanHistory[]> {
    try {
      const { data: loans, error } = await this.supabase
        .from('loans')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading loan history:', error);
        return [];
      }

      return loans.map(loan => ({
        id: loan.id,
        amount: loan.amount,
        status: loan.status,
        createdAt: new Date(loan.created_at),
        dueDate: new Date(loan.due_date),
        interestRate: loan.interest_rate
      }));
    } catch (error) {
      console.error('Error loading loan history:', error);
      return [];
    }
  }

  /**
   * Get customer payment history
   */
  private async getCustomerPaymentHistory(customerId: string): Promise<PaymentHistory[]> {
    try {
      const { data: payments, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('customer_id', customerId)
        .order('due_date', { ascending: false });

      if (error) {
        console.error('Error loading payment history:', error);
        return [];
      }

      return payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        dueDate: new Date(payment.due_date),
        paidDate: payment.paid_date ? new Date(payment.paid_date) : undefined,
        method: payment.method
      }));
    } catch (error) {
      console.error('Error loading payment history:', error);
      return [];
    }
  }

  /**
   * Get customer conversation history
   */
  private async getCustomerConversationHistory(customerId: string): Promise<ConversationHistory[]> {
    try {
      const { data: conversations, error } = await this.supabase
        .from('conversation_history')
        .select('*')
        .eq('customer_id', customerId)
        .order('timestamp', { ascending: false })
        .limit(10); // Get last 10 conversations

      if (error) {
        console.error('Error loading conversation history:', error);
        return [];
      }

      return conversations.map(conv => ({
        id: conv.id,
        content: conv.content,
        timestamp: new Date(conv.timestamp),
        sentiment: conv.sentiment,
        resolved: conv.resolved
      }));
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  }

  /**
   * Add a new document to the index
   */
  async addDocument(document: DocumentContext): Promise<void> {
    try {
      const llamaDoc = new Document({
        id_: document.id,
        text: `${document.title}\n\n${document.content}`,
        metadata: {
          type: document.type,
          customerId: document.customerId,
          ...document.metadata
        }
      });

      this.documents.push(llamaDoc);
      await this.index.insert(llamaDoc);
      
      console.log(`Document ${document.id} added to index`);
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Failed to add document to index');
    }
  }

  /**
   * Update an existing document in the index
   */
  async updateDocument(documentId: string, newContent: string): Promise<void> {
    try {
      // Remove old document
      await this.index.deleteRefDoc(documentId);
      
      // Find and update the document in our local array
      const docIndex = this.documents.findIndex(doc => doc.id_ === documentId);
      if (docIndex !== -1) {
        this.documents[docIndex].text = newContent;
        
        // Re-insert the updated document
        await this.index.insert(this.documents[docIndex]);
        
        console.log(`Document ${documentId} updated in index`);
      } else {
        throw new Error(`Document ${documentId} not found`);
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document in index');
    }
  }

  /**
   * Remove a document from the index
   */
  async removeDocument(documentId: string): Promise<void> {
    try {
      await this.index.deleteRefDoc(documentId);
      
      // Remove from local array
      this.documents = this.documents.filter(doc => doc.id_ !== documentId);
      
      console.log(`Document ${documentId} removed from index`);
    } catch (error) {
      console.error('Error removing document:', error);
      throw new Error('Failed to remove document from index');
    }
  }

  /**
   * Search for similar documents
   */
  async searchSimilarDocuments(query: string, limit: number = 5): Promise<DocumentContext[]> {
    try {
      const queryEngine = this.index.asQueryEngine();
      const response = await queryEngine.query({ query });
      
      // Extract relevant documents from response
      const relevantDocs = this.documents
        .filter(doc => response.toString().includes(doc.id_))
        .slice(0, limit)
        .map(doc => ({
          id: doc.id_,
          title: doc.metadata?.title || 'Untitled',
          content: doc.text,
          type: doc.metadata?.type || 'unknown',
          customerId: doc.metadata?.customerId,
          metadata: doc.metadata || {},
          createdAt: new Date(),
          updatedAt: new Date()
        }));

      return relevantDocs;
    } catch (error) {
      console.error('Error searching similar documents:', error);
      return [];
    }
  }

  /**
   * Get index statistics
   */
  async getIndexStats(): Promise<{
    totalDocuments: number;
    documentTypes: Record<string, number>;
    lastUpdated: Date;
  }> {
    const documentTypes: Record<string, number> = {};
    
    this.documents.forEach(doc => {
      const type = doc.metadata?.type || 'unknown';
      documentTypes[type] = (documentTypes[type] || 0) + 1;
    });

    return {
      totalDocuments: this.documents.length,
      documentTypes,
      lastUpdated: new Date()
    };
  }

  /**
   * Rebuild the entire index
   */
  async rebuildIndex(): Promise<void> {
    try {
      console.log('Rebuilding LlamaIndex...');
      
      // Clear existing index
      this.documents = [];
      
      // Reinitialize
      await this.initializeIndex();
      
      console.log('LlamaIndex rebuilt successfully');
    } catch (error) {
      console.error('Error rebuilding index:', error);
      throw new Error('Failed to rebuild index');
    }
  }
}

// Export singleton instance
export const llamaIndexService = new LlamaIndexService();
