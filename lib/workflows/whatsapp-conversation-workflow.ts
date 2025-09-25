/**
 * WhatsApp Conversation Workflow using LangGraph
 * 
 * This workflow manages multi-step conversation flows and state management
 * for the WhatsApp AI agent, enabling complex customer interactions.
 */

import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { whatsappAgent, CustomerMessage, WhatsAppResponse } from '@/lib/agents/whatsapp-agent';
import { llamaIndexService, CustomerContext } from '@/lib/services/llama-index-service';

// State Definition
export interface ConversationState {
  customerId: string;
  currentStep: string;
  context: Record<string, unknown>;
  history: Message[];
  requiresEscalation: boolean;
  escalationReason?: string;
  customerSegment: string;
  language: string;
  metadata: {
    startTime: number;
    lastActivity: number;
    stepCount: number;
    sessionId: string;
    endTime?: number;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  timestamp: number;
  sentiment?: string;
  intent?: string;
  response?: WhatsAppResponse;
}

export interface WorkflowResult {
  response: string;
  newState: ConversationState;
  requiresEscalation: boolean;
  escalationReason?: string;
}

export class WhatsAppConversationWorkflow {
  private workflow: unknown = null;
  private isInitialized = false;
  private escalationService: EscalationService;
  private conversationService: ConversationService;

  constructor() {
    this.initializeWorkflow();
    this.escalationService = new EscalationService();
    this.conversationService = new ConversationService();
  }

  /**
   * Initialize the LangGraph workflow
   */
  private async initializeWorkflow(): Promise<void> {
    try {
      console.log('Initializing WhatsApp conversation workflow...');

      const conversationState = Annotation.Root({
        customerId: Annotation<string>,
        currentStep: Annotation<string>,
        context: Annotation<Record<string, unknown>>,
        history: Annotation<Message[]>,
        requiresEscalation: Annotation<boolean>,
        escalationReason: Annotation<string | undefined>,
        customerSegment: Annotation<string>,
        language: Annotation<string>,
        metadata: Annotation<{
          startTime: number;
          lastActivity: number;
          stepCount: number;
          sessionId: string;
          endTime?: number;
        }>
      });

      this.workflow = new StateGraph(conversationState);

      this.setupWorkflow();
      this.workflow = (this.workflow as StateGraph<Record<string, unknown>>).compile();
      this.isInitialized = true;
      
      console.log('WhatsApp conversation workflow initialized successfully');
    } catch (error) {
      console.error('Failed to initialize workflow:', error);
      throw new Error('Workflow initialization failed');
    }
  }

  /**
   * Setup workflow nodes and edges
   */
  private setupWorkflow(): void {
    // Add nodes
     
    const workflow = this.workflow as any;
    workflow
      .addNode('analyze_intent', this.analyzeIntent.bind(this))
      .addNode('retrieve_context', this.retrieveContext.bind(this))
      .addNode('generate_response', this.generateResponse.bind(this))
      .addNode('escalate', this.escalateToHuman.bind(this))
      .addNode('update_context', this.updateContext.bind(this))
      .addNode('end_conversation', this.endConversation.bind(this))
      .addNode('handle_followup', this.handleFollowup.bind(this));

    // Add edges
    workflow
      .addEdge(START, 'analyze_intent')
      .addEdge('analyze_intent', 'retrieve_context')
      .addEdge('retrieve_context', 'generate_response')
      .addConditionalEdges('generate_response', this.shouldEscalate.bind(this))
      .addEdge('escalate', END)
      .addConditionalEdges('update_context', this.shouldContinue.bind(this))
      .addEdge('handle_followup', 'analyze_intent')
      .addEdge('end_conversation', END);
  }

  /**
   * Analyze customer intent
   */
  private async analyzeIntent(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      const lastMessage = state.history[state.history.length - 1];
      
      if (!lastMessage) {
        throw new Error('No message found in history');
      }

      // Analyze customer intent using the agent
      const intent = await whatsappAgent.classifyIntent(lastMessage.content);
      
      return {
        currentStep: 'intent_analyzed',
        context: {
          ...state.context,
          intent,
          lastMessage
        },
        metadata: {
          ...state.metadata,
          lastActivity: Date.now(),
          stepCount: state.metadata.stepCount + 1
        }
      };
    } catch (error) {
      console.error('Error analyzing intent:', error);
      return {
        currentStep: 'intent_analysis_failed',
        requiresEscalation: true,
        escalationReason: 'Intent analysis failed'
      };
    }
  }

  /**
   * Retrieve customer context
   */
  private async retrieveContext(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      const { customerId, context } = state;
      const lastMessage = context.lastMessage as Message;
      
      // Get customer context from LlamaIndex
      const customerContext = await llamaIndexService.getCustomerContext(
        customerId,
        lastMessage.content
      );

      return {
        currentStep: 'context_retrieved',
        context: {
          ...context,
          customerContext
        },
        customerSegment: this.determineCustomerSegment(customerContext),
        metadata: {
          ...state.metadata,
          lastActivity: Date.now()
        }
      };
    } catch (error) {
      console.error('Error retrieving context:', error);
      return {
        currentStep: 'context_retrieval_failed',
        requiresEscalation: true,
        escalationReason: 'Context retrieval failed'
      };
    }
  }

  /**
   * Generate response
   */
  private async generateResponse(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      const { customerId, context } = state;
      const lastMessage = context.lastMessage as Message;
      const customerContext = context.customerContext as CustomerContext;

      // Create customer message object
      const customerMessage: CustomerMessage = {
        content: lastMessage.content,
        customerId,
        timestamp: new Date(lastMessage.timestamp).toISOString(),
        language: state.language,
        metadata: {
          messageId: lastMessage.id,
          conversationId: state.metadata.sessionId,
          platform: 'whatsapp'
        }
      };

      // Generate response using the agent
      const response = await whatsappAgent.processMessage(customerMessage, customerContext);

      // Add agent response to history
      const agentMessage: Message = {
        id: `agent_${Date.now()}`,
        content: response.response,
        sender: 'agent',
        timestamp: Date.now(),
        sentiment: response.sentiment,
        intent: response.metadata.intent,
        response
      };

      const updatedHistory = [...state.history, agentMessage];

      return {
        currentStep: 'response_generated',
        history: updatedHistory,
        requiresEscalation: response.requiresEscalation,
        escalationReason: response.requiresEscalation ? response.metadata.escalationReason : undefined,
        context: {
          ...context,
          lastResponse: response
        },
        metadata: {
          ...state.metadata,
          lastActivity: Date.now()
        }
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        currentStep: 'response_generation_failed',
        requiresEscalation: true,
        escalationReason: 'Response generation failed'
      };
    }
  }

  /**
   * Escalate to human agent
   */
  private async escalateToHuman(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      // Implement escalation logic
      await this.escalationService.escalateToHuman({
        customerId: state.customerId,
        reason: state.escalationReason,
        conversationHistory: state.history,
        context: state.context,
        sessionId: state.metadata.sessionId
      });

      return {
        currentStep: 'escalated',
        context: {
          ...state.context,
          escalationStatus: 'pending',
          escalationTimestamp: Date.now()
        },
        metadata: {
          ...state.metadata,
          lastActivity: Date.now()
        }
      };
    } catch (error) {
      console.error('Error escalating to human:', error);
      return {
        currentStep: 'escalation_failed',
        context: {
          ...state.context,
          escalationStatus: 'failed'
        }
      };
    }
  }

  /**
   * Update conversation context
   */
  private async updateContext(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      // Update conversation context in database
      await this.conversationService.updateContext(
        state.customerId,
        state.metadata.sessionId,
        state.context
      );

      return {
        currentStep: 'context_updated',
        metadata: {
          ...state.metadata,
          lastActivity: Date.now()
        }
      };
    } catch (error) {
      console.error('Error updating context:', error);
      return {
        currentStep: 'context_update_failed'
      };
    }
  }

  /**
   * Handle follow-up messages
   */
  private async handleFollowup(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      // Check if this is a follow-up to a previous conversation
      const lastResponse = state.context.lastResponse as WhatsAppResponse;
      
      if (lastResponse && lastResponse.suggestedActions.length > 0) {
        // Check if customer is responding to suggested actions
        const lastMessage = state.history[state.history.length - 1];
        const isFollowup = this.isFollowupResponse(lastMessage.content, lastResponse.suggestedActions);
        
        if (isFollowup) {
          return {
            currentStep: 'followup_detected',
            context: {
              ...state.context,
              isFollowup: true,
              followupAction: this.extractFollowupAction(lastMessage.content, lastResponse.suggestedActions)
            }
          };
        }
      }

      return {
        currentStep: 'new_conversation'
      };
    } catch (error) {
      console.error('Error handling followup:', error);
      return {
        currentStep: 'followup_handling_failed'
      };
    }
  }

  /**
   * End conversation
   */
  private async endConversation(state: ConversationState): Promise<Partial<ConversationState>> {
    try {
      // Save conversation to database
      await this.conversationService.saveConversation(state);
      
      return {
        currentStep: 'ended',
        metadata: {
          ...state.metadata,
          endTime: Date.now()
        }
      };
    } catch (error) {
      console.error('Error ending conversation:', error);
      return {
        currentStep: 'end_failed'
      };
    }
  }

  /**
   * Determine if conversation should be escalated
   */
  private shouldEscalate(state: ConversationState): string {
    if (state.requiresEscalation) {
      return 'escalate';
    }
    
    // Check for follow-up messages
    const lastResponse = state.context.lastResponse as WhatsAppResponse;
    if (lastResponse && lastResponse.suggestedActions.length > 0) {
      return 'handle_followup';
    }
    
    return 'update_context';
  }

  /**
   * Determine if conversation should continue
   */
  private shouldContinue(state: ConversationState): string {
    // Check if conversation has been active for too long
    const sessionDuration = Date.now() - state.metadata.startTime;
    const maxSessionDuration = 30 * 60 * 1000; // 30 minutes
    
    if (sessionDuration > maxSessionDuration) {
      return 'end_conversation';
    }
    
    // Check if customer hasn't responded for a while
    const timeSinceLastActivity = Date.now() - state.metadata.lastActivity;
    const maxInactivityTime = 10 * 60 * 1000; // 10 minutes
    
    if (timeSinceLastActivity > maxInactivityTime) {
      return 'end_conversation';
    }
    
    return 'end_conversation';
  }

  /**
   * Determine customer segment based on context
   */
  private determineCustomerSegment(context: CustomerContext): string {
    const { loanHistory, paymentHistory } = context;

    // Check for high-risk indicators
    const hasDefaultedPayments = paymentHistory.some(p => p.status === 'failed');
    const hasLatePayments = paymentHistory.filter(p => 
      p.status === 'completed' && p.paidDate && 
      p.paidDate > p.dueDate
    ).length > 2;

    if (hasDefaultedPayments || hasLatePayments) {
      return 'high_risk';
    }

    // Check for premium indicators
    const totalLoanAmount = loanHistory.reduce((sum, loan) => sum + loan.amount, 0);
    const hasMultipleLoans = loanHistory.length > 1;
    const hasLargeLoan = loanHistory.some(loan => loan.amount > 10000);

    if (totalLoanAmount > 50000 || (hasMultipleLoans && hasLargeLoan)) {
      return 'premium';
    }

    // Check for basic indicators
    const hasNoLoanHistory = loanHistory.length === 0;
    const hasLimitedHistory = loanHistory.length === 1 && loanHistory[0].amount < 5000;

    if (hasNoLoanHistory || hasLimitedHistory) {
      return 'basic';
    }

    return 'standard';
  }

  /**
   * Check if message is a follow-up response
   */
  private isFollowupResponse(message: string, suggestedActions: string[]): boolean {
    const messageLower = message.toLowerCase();
    
    return suggestedActions.some(action => {
      const actionLower = action.toLowerCase();
      return messageLower.includes(actionLower) || 
             messageLower.includes('yes') || 
             messageLower.includes('no') ||
             messageLower.includes('ok') ||
             messageLower.includes('sure');
    });
  }

  /**
   * Extract follow-up action from message
   */
  private extractFollowupAction(message: string, suggestedActions: string[]): string {
    const messageLower = message.toLowerCase();
    
    for (const action of suggestedActions) {
      const actionLower = action.toLowerCase();
      if (messageLower.includes(actionLower)) {
        return action;
      }
    }
    
    // Default to first suggested action if no specific match
    return suggestedActions[0] || 'Continue';
  }

  /**
   * Process a customer message through the workflow
   */
  async processMessage(
    customerId: string,
    message: string,
    existingState?: ConversationState
  ): Promise<WorkflowResult> {
    if (!this.isInitialized) {
      await this.initializeWorkflow();
    }

    try {
      // Create or update conversation state
      const initialState: ConversationState = existingState || this.createInitialState(customerId);

      // Add new message to history
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        content: message,
        sender: 'customer',
        timestamp: Date.now()
      };

      initialState.history.push(newMessage);

      // Run workflow
       
      const finalState = await (this.workflow as any).invoke(initialState);

      // Extract response from the last agent message
      const lastAgentMessage = finalState.history
        .filter((msg: Message) => msg.sender === 'agent')
        .pop();

      const response = lastAgentMessage?.content || 
        'I apologize, but I cannot process your request at this time.';

      return {
        response,
        newState: finalState,
        requiresEscalation: finalState.requiresEscalation,
        escalationReason: finalState.escalationReason
      };
    } catch (error) {
      console.error('Error processing message through workflow:', error);
      
      // Return fallback response
      return {
        response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact our support team.',
        newState: existingState || this.createInitialState(customerId),
        requiresEscalation: true,
        escalationReason: 'Workflow processing error'
      };
    }
  }

  /**
   * Create initial conversation state
   */
  private createInitialState(customerId: string): ConversationState {
    return {
      customerId,
      currentStep: 'start',
      context: {},
      history: [],
      requiresEscalation: false,
      customerSegment: 'standard',
      language: 'en',
      metadata: {
        startTime: Date.now(),
        lastActivity: Date.now(),
        stepCount: 0,
        sessionId: `session_${Date.now()}_${customerId}`
      }
    };
  }

  /**
   * Get workflow statistics
   */
  async getWorkflowStats(): Promise<{
    isInitialized: boolean;
    totalNodes: number;
    totalEdges: number;
    lastUsed: Date;
  }> {
    return {
      isInitialized: this.isInitialized,
      totalNodes: 7, // Number of nodes in the workflow
      totalEdges: 6, // Number of edges in the workflow
      lastUsed: new Date()
    };
  }
}

// Mock services for demonstration
class EscalationService {
  async escalateToHuman(data: unknown): Promise<void> {
    console.log('Escalating to human agent:', data);
    // Implementation would integrate with your escalation system
  }
}

class ConversationService {
  async updateContext(customerId: string, sessionId: string, context: unknown): Promise<void> {
    console.log('Updating conversation context:', { customerId, sessionId, context });
    // Implementation would save to database
  }

  async saveConversation(state: ConversationState): Promise<void> {
    console.log('Saving conversation:', state);
    // Implementation would save to database
  }
}

// Export singleton instance
export const whatsappWorkflow = new WhatsAppConversationWorkflow();
