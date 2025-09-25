/**
 * AI Workflow Orchestrator for BuffrLend
 * Inspired by LangGraph patterns and data science workflow principles
 * 
 * This module provides a comprehensive workflow orchestration system
 * for AI-powered document processing, loan analysis, and CRM automation.
 */

import { z } from 'zod';

// ============================================================================
// WORKFLOW TYPES AND INTERFACES
// ============================================================================

/**
 * Workflow execution state
 * Based on LangGraph state management patterns
 */
export interface WorkflowState {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentStep: string;
  data: Record<string, unknown>;
  metadata: {
    startedAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    error?: string;
    retryCount: number;
    maxRetries: number;
  };
  context: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
}

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  inputSchema: z.ZodSchema<unknown>;
  outputSchema: z.ZodSchema<unknown>;
  execute: (state: WorkflowState, input: unknown) => Promise<unknown>;
  retryable: boolean;
  timeout: number; // in milliseconds
  dependencies: string[];
  conditions?: (state: WorkflowState) => boolean;
}

/**
 * Workflow definition
 */
export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  steps: WorkflowStep[];
  startStep: string;
  endSteps: string[];
  errorHandling: {
    strategy: 'retry' | 'skip' | 'fail' | 'fallback';
    maxRetries: number;
    retryDelay: number;
    fallbackStep?: string;
  };
}

/**
 * Workflow execution result
 */
export interface WorkflowResult {
  success: boolean;
  state: WorkflowState;
  output?: unknown;
  error?: string;
  metrics: {
    executionTime: number;
    stepsCompleted: number;
    totalSteps: number;
    retryCount: number;
  };
}

// ============================================================================
// WORKFLOW ORCHESTRATOR CLASS
// ============================================================================

export class WorkflowOrchestrator {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private activeExecutions: Map<string, WorkflowState> = new Map();
  private eventListeners: Map<string, Array<(state: WorkflowState) => void>> = new Map();

  constructor() {
    this.initializeDefaultWorkflows();
  }

  /**
   * Register a workflow definition
   */
  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    initialData: unknown,
    context: Partial<WorkflowState['context']> = {}
  ): Promise<WorkflowResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const executionId = this.generateExecutionId();
    const startTime = Date.now();

    const state: WorkflowState = {
      id: executionId,
      status: 'pending',
      currentStep: workflow.startStep,
      data: initialData as Record<string, unknown>,
      metadata: {
        startedAt: new Date(),
        updatedAt: new Date(),
        retryCount: 0,
        maxRetries: workflow.errorHandling.maxRetries,
      },
      context: {
        priority: 'medium',
        ...context,
      },
    };

    this.activeExecutions.set(executionId, state);

    try {
      await this.executeWorkflowSteps(workflow, state);
      
      const executionTime = Date.now() - startTime;
      const stepsCompleted = this.countCompletedSteps(state);
      
      return {
        success: true,
        state,
        output: state.data,
        metrics: {
          executionTime,
          stepsCompleted,
          totalSteps: workflow.steps.length,
          retryCount: state.metadata.retryCount,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const stepsCompleted = this.countCompletedSteps(state);
      
      return {
        success: false,
        state,
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: {
          executionTime,
          stepsCompleted,
          totalSteps: workflow.steps.length,
          retryCount: state.metadata.retryCount,
        },
      };
    } finally {
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Execute workflow steps
   */
  private async executeWorkflowSteps(
    workflow: WorkflowDefinition,
    state: WorkflowState
  ): Promise<void> {
    const visitedSteps = new Set<string>();
    const stepQueue: string[] = [workflow.startStep];

    while (stepQueue.length > 0) {
      const stepId = stepQueue.shift()!;
      
      if (visitedSteps.has(stepId)) {
        continue; // Avoid infinite loops
      }
      
      visitedSteps.add(stepId);
      
      const step = workflow.steps.find(s => s.id === stepId);
      if (!step) {
        throw new Error(`Step ${stepId} not found in workflow ${workflow.id}`);
      }

      // Check if step should be executed based on conditions
      if (step.conditions && !step.conditions(state)) {
        continue;
      }

      // Check dependencies
      const dependenciesMet = step.dependencies.every(dep => 
        visitedSteps.has(dep) || state.data[dep] !== undefined
      );
      
      if (!dependenciesMet) {
        stepQueue.push(stepId); // Re-queue for later execution
        continue;
      }

      try {
        state.status = 'running';
        state.currentStep = stepId;
        state.metadata.updatedAt = new Date();

        this.emitEvent('step_started', state);

        // Execute step with timeout
        const stepResult = await this.executeStepWithTimeout(step, state);
        
        // Update state with step result
        state.data[stepId] = stepResult;
        state.metadata.updatedAt = new Date();

        this.emitEvent('step_completed', state);

        // Add next steps to queue
        const nextSteps = this.getNextSteps(workflow, stepId);
        stepQueue.push(...nextSteps);

      } catch (error) {
        await this.handleStepError(workflow, step, state, error);
      }
    }

    // Check if we've reached an end step
    if (workflow.endSteps.some(endStep => visitedSteps.has(endStep))) {
      state.status = 'completed';
      state.metadata.completedAt = new Date();
      this.emitEvent('workflow_completed', state);
    }
  }

  /**
   * Execute a single step with timeout
   */
  private async executeStepWithTimeout(
    step: WorkflowStep,
    state: WorkflowState
  ): Promise<unknown> {
    return Promise.race([
      step.execute(state, state.data),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Step ${step.id} timed out`)), step.timeout)
      ),
    ]);
  }

  /**
   * Handle step execution errors
   */
  private async handleStepError(
    workflow: WorkflowDefinition,
    step: WorkflowStep,
    state: WorkflowState,
    error: unknown
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    state.metadata.error = errorMessage;
    state.metadata.retryCount++;

    this.emitEvent('step_failed', state);

    switch (workflow.errorHandling.strategy) {
      case 'retry':
        if (state.metadata.retryCount <= workflow.errorHandling.maxRetries && step.retryable) {
          // Wait before retry
          await new Promise(resolve => 
            setTimeout(resolve, workflow.errorHandling.retryDelay)
          );
          // Re-execute the step
          await this.executeStepWithTimeout(step, state);
        }
        break;
        
      case 'skip':
        // Skip the step and continue
        state.data[step.id] = null;
        return;
        
      case 'fallback':
        if (workflow.errorHandling.fallbackStep) {
          const fallbackStep = workflow.steps.find(s => s.id === workflow.errorHandling.fallbackStep);
          if (fallbackStep) {
            await this.executeStepWithTimeout(fallbackStep, state);
          }
        }
        break;
        
      case 'fail':
      default:
        state.status = 'failed';
        throw error;
    }
  }

  /**
   * Get next steps in workflow
   */
  private getNextSteps(workflow: WorkflowDefinition, currentStepId: string): string[] {
    // This is a simplified implementation
    // In a real LangGraph-style system, this would be more sophisticated
    const currentStepIndex = workflow.steps.findIndex(s => s.id === currentStepId);
    if (currentStepIndex === -1 || currentStepIndex >= workflow.steps.length - 1) {
      return [];
    }
    
    return [workflow.steps[currentStepIndex + 1].id];
  }

  /**
   * Count completed steps
   */
  private countCompletedSteps(state: WorkflowState): number {
    return Object.keys(state.data).length;
  }

  /**
   * Generate unique execution ID
   */
  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Event system for workflow monitoring
   */
  on(event: string, listener: (state: WorkflowState) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  private emitEvent(event: string, state: WorkflowState): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(state));
    }
  }

  /**
   * Initialize default workflows for BuffrLend
   */
  private initializeDefaultWorkflows(): void {
    this.registerWorkflow(this.createLoanApplicationWorkflow());
    this.registerWorkflow(this.createDocumentAnalysisWorkflow());
    this.registerWorkflow(this.createCustomerOnboardingWorkflow());
    this.registerWorkflow(this.createRiskAssessmentWorkflow());
  }

  // ============================================================================
  // DEFAULT WORKFLOW DEFINITIONS
  // ============================================================================

  /**
   * Loan Application Processing Workflow
   */
  private createLoanApplicationWorkflow(): WorkflowDefinition {
    return {
      id: 'loan_application_processing',
      name: 'Loan Application Processing',
      description: 'Complete workflow for processing loan applications',
      version: '1.0.0',
      startStep: 'validate_application',
      endSteps: ['send_decision_notification'],
      errorHandling: {
        strategy: 'retry',
        maxRetries: 3,
        retryDelay: 5000,
        fallbackStep: 'manual_review',
      },
      steps: [
        {
          id: 'validate_application',
          name: 'Validate Application Data',
          description: 'Validate loan application data and requirements',
          inputSchema: z.object({
            applicationId: z.string(),
            userId: z.string(),
            loanAmount: z.number(),
            loanTerm: z.number(),
          }),
          outputSchema: z.object({
            isValid: z.boolean(),
            errors: z.array(z.string()).optional(),
          }),
          execute: async (state, input) => {
            // Simulate validation logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = input as { loanAmount: number; loanTerm: number };
            return {
              isValid: data.loanAmount > 0 && data.loanTerm > 0,
              errors: data.loanAmount <= 0 ? ['Invalid loan amount'] : undefined,
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: [],
        },
        {
          id: 'credit_check',
          name: 'Perform Credit Check',
          description: 'Run credit check and risk assessment',
          inputSchema: z.object({
            userId: z.string(),
            loanAmount: z.number(),
          }),
          outputSchema: z.object({
            creditScore: z.number(),
            riskLevel: z.enum(['low', 'medium', 'high']),
            approved: z.boolean(),
          }),
          execute: async () => {
            // Simulate credit check
            await new Promise(resolve => setTimeout(resolve, 2000));
            const creditScore = Math.floor(Math.random() * 300) + 300; // 300-600
            return {
              creditScore,
              riskLevel: creditScore > 500 ? 'low' : creditScore > 400 ? 'medium' : 'high',
              approved: creditScore > 450,
            };
          },
          retryable: true,
          timeout: 60000,
          dependencies: ['validate_application'],
        },
        {
          id: 'calculate_terms',
          name: 'Calculate Loan Terms',
          description: 'Calculate interest rate and payment terms',
          inputSchema: z.object({
            loanAmount: z.number(),
            loanTerm: z.number(),
            riskLevel: z.enum(['low', 'medium', 'high']),
          }),
          outputSchema: z.object({
            interestRate: z.number(),
            monthlyPayment: z.number(),
            totalRepayment: z.number(),
          }),
          execute: async (state, input) => {
            // Simulate term calculation
            await new Promise(resolve => setTimeout(resolve, 500));
            const data = input as { loanAmount: number; loanTerm: number; riskLevel: 'low' | 'medium' | 'high' };
            const baseRate = 15; // 15% base rate
            const riskMultiplier = data.riskLevel === 'high' ? 1.5 : data.riskLevel === 'medium' ? 1.2 : 1.0;
            const interestRate = baseRate * riskMultiplier;
            
            const monthlyRate = interestRate / 100 / 12;
            const monthlyPayment = (data.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, data.loanTerm)) /
              (Math.pow(1 + monthlyRate, data.loanTerm) - 1);
            
            return {
              interestRate,
              monthlyPayment,
              totalRepayment: monthlyPayment * data.loanTerm,
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: ['credit_check'],
        },
        {
          id: 'send_decision_notification',
          name: 'Send Decision Notification',
          description: 'Send approval/rejection notification to applicant',
          inputSchema: z.object({
            userId: z.string(),
            approved: z.boolean(),
            loanAmount: z.number().optional(),
            monthlyPayment: z.number().optional(),
          }),
          outputSchema: z.object({
            notificationSent: z.boolean(),
            method: z.string(),
          }),
          execute: async () => {
            // Simulate notification sending
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
              notificationSent: true,
              method: 'whatsapp',
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: ['calculate_terms'],
        },
        {
          id: 'manual_review',
          name: 'Manual Review',
          description: 'Flag application for manual review',
          inputSchema: z.object({
            applicationId: z.string(),
            reason: z.string(),
          }),
          outputSchema: z.object({
            flagged: z.boolean(),
            assignedTo: z.string().optional(),
          }),
          execute: async () => {
            // Simulate manual review assignment
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
              flagged: true,
              assignedTo: 'admin@buffrlend.com',
            };
          },
          retryable: false,
          timeout: 30000,
          dependencies: [],
        },
      ],
    };
  }

  /**
   * Document Analysis Workflow
   */
  private createDocumentAnalysisWorkflow(): WorkflowDefinition {
    return {
      id: 'document_analysis',
      name: 'Document Analysis',
      description: 'AI-powered document analysis and extraction',
      version: '1.0.0',
      startStep: 'parse_document',
      endSteps: ['generate_report'],
      errorHandling: {
        strategy: 'retry',
        maxRetries: 2,
        retryDelay: 3000,
      },
      steps: [
        {
          id: 'parse_document',
          name: 'Parse Document',
          description: 'Parse and extract text from document',
          inputSchema: z.object({
            documentPath: z.string(),
            documentType: z.string(),
          }),
          outputSchema: z.object({
            extractedText: z.string(),
            metadata: z.record(z.string(), z.unknown()),
          }),
          execute: async () => {
            // Simulate document parsing
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
              extractedText: 'Sample extracted text from document',
              metadata: {
                pageCount: 5,
                language: 'en',
                confidence: 0.95,
              },
            };
          },
          retryable: true,
          timeout: 60000,
          dependencies: [],
        },
        {
          id: 'analyze_content',
          name: 'Analyze Content',
          description: 'Analyze document content for key information',
          inputSchema: z.object({
            extractedText: z.string(),
            documentType: z.string(),
          }),
          outputSchema: z.object({
            keyInformation: z.record(z.string(), z.unknown()),
            complianceScore: z.number(),
            riskFactors: z.array(z.string()),
          }),
          execute: async () => {
            // Simulate content analysis
            await new Promise(resolve => setTimeout(resolve, 3000));
            return {
              keyInformation: {
                amount: 50000,
                date: '2024-01-15',
                parties: ['John Doe', 'ABC Company'],
              },
              complianceScore: 0.85,
              riskFactors: ['Missing signature', 'Unclear terms'],
            };
          },
          retryable: true,
          timeout: 120000,
          dependencies: ['parse_document'],
        },
        {
          id: 'generate_report',
          name: 'Generate Analysis Report',
          description: 'Generate comprehensive analysis report',
          inputSchema: z.object({
            keyInformation: z.record(z.string(), z.unknown()),
            complianceScore: z.number(),
            riskFactors: z.array(z.string()),
          }),
          outputSchema: z.object({
            report: z.string(),
            recommendations: z.array(z.string()),
            summary: z.string(),
          }),
          execute: async () => {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
              report: 'Comprehensive analysis report...',
              recommendations: [
                'Verify signature authenticity',
                'Clarify payment terms',
                'Add compliance clauses',
              ],
              summary: 'Document analysis completed with 85% compliance score',
            };
          },
          retryable: true,
          timeout: 60000,
          dependencies: ['analyze_content'],
        },
      ],
    };
  }

  /**
   * Customer Onboarding Workflow
   */
  private createCustomerOnboardingWorkflow(): WorkflowDefinition {
    return {
      id: 'customer_onboarding',
      name: 'Customer Onboarding',
      description: 'Automated customer onboarding process',
      version: '1.0.0',
      startStep: 'create_profile',
      endSteps: ['send_welcome_message'],
      errorHandling: {
        strategy: 'retry',
        maxRetries: 3,
        retryDelay: 2000,
      },
      steps: [
        {
          id: 'create_profile',
          name: 'Create Customer Profile',
          description: 'Create customer profile in CRM system',
          inputSchema: z.object({
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
            phone: z.string(),
          }),
          outputSchema: z.object({
            customerId: z.string(),
            profileCreated: z.boolean(),
          }),
          execute: async () => {
            // Simulate profile creation
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
              customerId: `cust_${Date.now()}`,
              profileCreated: true,
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: [],
        },
        {
          id: 'verify_identity',
          name: 'Verify Identity',
          description: 'Verify customer identity and documents',
          inputSchema: z.object({
            customerId: z.string(),
            idNumber: z.string(),
            documents: z.array(z.string()),
          }),
          outputSchema: z.object({
            verified: z.boolean(),
            verificationScore: z.number(),
          }),
          execute: async () => {
            // Simulate identity verification
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
              verified: true,
              verificationScore: 0.92,
            };
          },
          retryable: true,
          timeout: 60000,
          dependencies: ['create_profile'],
        },
        {
          id: 'setup_communication',
          name: 'Setup Communication Channels',
          description: 'Setup WhatsApp and email communication',
          inputSchema: z.object({
            customerId: z.string(),
            phone: z.string(),
            email: z.string(),
          }),
          outputSchema: z.object({
            whatsappSetup: z.boolean(),
            emailSetup: z.boolean(),
          }),
          execute: async () => {
            // Simulate communication setup
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
              whatsappSetup: true,
              emailSetup: true,
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: ['verify_identity'],
        },
        {
          id: 'send_welcome_message',
          name: 'Send Welcome Message',
          description: 'Send welcome message via WhatsApp',
          inputSchema: z.object({
            customerId: z.string(),
            phone: z.string(),
            firstName: z.string(),
          }),
          outputSchema: z.object({
            messageSent: z.boolean(),
            messageId: z.string().optional(),
          }),
          execute: async () => {
            // Simulate message sending
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
              messageSent: true,
              messageId: `msg_${Date.now()}`,
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: ['setup_communication'],
        },
      ],
    };
  }

  /**
   * Risk Assessment Workflow
   */
  private createRiskAssessmentWorkflow(): WorkflowDefinition {
    return {
      id: 'risk_assessment',
      name: 'Risk Assessment',
      description: 'Comprehensive risk assessment for loan applications',
      version: '1.0.0',
      startStep: 'collect_data',
      endSteps: ['generate_risk_report'],
      errorHandling: {
        strategy: 'retry',
        maxRetries: 2,
        retryDelay: 5000,
      },
      steps: [
        {
          id: 'collect_data',
          name: 'Collect Risk Data',
          description: 'Collect all relevant risk assessment data',
          inputSchema: z.object({
            applicationId: z.string(),
            userId: z.string(),
          }),
          outputSchema: z.object({
            dataCollected: z.boolean(),
            dataPoints: z.number(),
          }),
          execute: async () => {
            // Simulate data collection
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
              dataCollected: true,
              dataPoints: 25,
            };
          },
          retryable: true,
          timeout: 45000,
          dependencies: [],
        },
        {
          id: 'analyze_credit_history',
          name: 'Analyze Credit History',
          description: 'Analyze customer credit history and patterns',
          inputSchema: z.object({
            userId: z.string(),
            dataPoints: z.number(),
          }),
          outputSchema: z.object({
            creditScore: z.number(),
            paymentHistory: z.string(),
            debtToIncomeRatio: z.number(),
          }),
          execute: async () => {
            // Simulate credit analysis
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
              creditScore: 650,
              paymentHistory: 'excellent',
              debtToIncomeRatio: 0.35,
            };
          },
          retryable: true,
          timeout: 60000,
          dependencies: ['collect_data'],
        },
        {
          id: 'assess_employment',
          name: 'Assess Employment Stability',
          description: 'Assess employment stability and income reliability',
          inputSchema: z.object({
            userId: z.string(),
            employerId: z.string(),
          }),
          outputSchema: z.object({
            employmentStability: z.enum(['high', 'medium', 'low']),
            incomeReliability: z.number(),
            tenureMonths: z.number(),
          }),
          execute: async () => {
            // Simulate employment assessment
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
              employmentStability: 'high',
              incomeReliability: 0.95,
              tenureMonths: 24,
            };
          },
          retryable: true,
          timeout: 45000,
          dependencies: ['collect_data'],
        },
        {
          id: 'calculate_risk_score',
          name: 'Calculate Risk Score',
          description: 'Calculate overall risk score based on all factors',
          inputSchema: z.object({
            creditScore: z.number(),
            paymentHistory: z.string(),
            debtToIncomeRatio: z.number(),
            employmentStability: z.enum(['high', 'medium', 'low']),
            incomeReliability: z.number(),
            tenureMonths: z.number(),
          }),
          outputSchema: z.object({
            riskScore: z.number(),
            riskLevel: z.enum(['low', 'medium', 'high']),
            recommendation: z.enum(['approve', 'decline', 'manual_review']),
          }),
          execute: async (state, input) => {
            // Simulate risk calculation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const data = input as { 
              creditScore: number; 
              paymentHistory: string; 
              debtToIncomeRatio: number; 
              employmentStability: 'high' | 'medium' | 'low';
              incomeReliability: number;
              tenureMonths: number;
            };
            
            let riskScore = 0;
            
            // Credit score contribution (0-40 points)
            riskScore += Math.min(data.creditScore / 10, 40);
            
            // Payment history contribution (0-20 points)
            if (data.paymentHistory === 'excellent') riskScore += 20;
            else if (data.paymentHistory === 'good') riskScore += 15;
            else if (data.paymentHistory === 'fair') riskScore += 10;
            
            // Debt-to-income contribution (0-20 points)
            riskScore += Math.max(0, 20 - (data.debtToIncomeRatio * 40));
            
            // Employment stability contribution (0-20 points)
            if (data.employmentStability === 'high') riskScore += 20;
            else if (data.employmentStability === 'medium') riskScore += 10;
            
            const riskLevel = riskScore > 70 ? 'low' : riskScore > 50 ? 'medium' : 'high';
            const recommendation = riskScore > 70 ? 'approve' : riskScore > 50 ? 'manual_review' : 'decline';
            
            return {
              riskScore: Math.round(riskScore),
              riskLevel,
              recommendation,
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: ['analyze_credit_history', 'assess_employment'],
        },
        {
          id: 'generate_risk_report',
          name: 'Generate Risk Report',
          description: 'Generate comprehensive risk assessment report',
          inputSchema: z.object({
            riskScore: z.number(),
            riskLevel: z.enum(['low', 'medium', 'high']),
            recommendation: z.enum(['approve', 'decline', 'manual_review']),
          }),
          outputSchema: z.object({
            report: z.string(),
            summary: z.string(),
            factors: z.array(z.string()),
          }),
          execute: async (state, input) => {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = input as { riskScore: number; riskLevel: string; recommendation: string };
            return {
              report: `Risk Assessment Report - Score: ${data.riskScore}, Level: ${data.riskLevel}`,
              summary: `Application ${data.recommendation} based on risk assessment`,
              factors: [
                'Credit history analysis',
                'Employment stability assessment',
                'Income reliability evaluation',
                'Debt-to-income ratio analysis',
              ],
            };
          },
          retryable: true,
          timeout: 30000,
          dependencies: ['calculate_risk_score'],
        },
      ],
    };
  }
}

// ============================================================================
// WORKFLOW UTILITIES
// ============================================================================

/**
 * Create a new workflow orchestrator instance
 */
export function createWorkflowOrchestrator(): WorkflowOrchestrator {
  return new WorkflowOrchestrator();
}

/**
 * Workflow execution helper
 */
export async function executeWorkflow(
  orchestrator: WorkflowOrchestrator,
  workflowId: string,
  data: unknown,
  context?: Partial<WorkflowState['context']>
): Promise<WorkflowResult> {
  return orchestrator.executeWorkflow(workflowId, data, context);
}

/**
 * Workflow monitoring helper
 */
export function monitorWorkflow(
  orchestrator: WorkflowOrchestrator,
  onStepStart?: (state: WorkflowState) => void,
  onStepComplete?: (state: WorkflowState) => void,
  onStepFail?: (state: WorkflowState) => void,
  onWorkflowComplete?: (state: WorkflowState) => void
): void {
  if (onStepStart) orchestrator.on('step_started', onStepStart);
  if (onStepComplete) orchestrator.on('step_completed', onStepComplete);
  if (onStepFail) orchestrator.on('step_failed', onStepFail);
  if (onWorkflowComplete) orchestrator.on('workflow_completed', onWorkflowComplete);
}

// Export default instance
export const workflowOrchestrator = createWorkflowOrchestrator();
