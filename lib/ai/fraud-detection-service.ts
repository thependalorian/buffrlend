/**
 * Fraud Detection Service for BuffrLend
 * Pure TypeScript implementation with pattern recognition algorithms
 * Inspired by data science best practices for anomaly detection
 */

import { z } from 'zod';

// ============================================================================
// FRAUD DETECTION TYPES AND SCHEMAS
// ============================================================================

/**
 * Fraud detection input schema
 */
export const FraudDetectionInputSchema = z.object({
  // Application Data
  applicationId: z.string(),
  userId: z.string(),
  timestamp: z.date(),
  
  // Personal Information
  personalInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    idNumber: z.string(),
    address: z.string(),
  }),
  
  // Financial Information (Partner Company Employee)
  financialInfo: z.object({
    monthlyIncome: z.number().positive(),
    monthlyExpenses: z.number().min(0),
    existingDebt: z.number().min(0),
    bankAccount: z.string(),
    employmentInfo: z.object({
      company: z.string(),
      position: z.string(),
      tenure: z.number().min(0),
      employmentType: z.literal('permanent'), // Only permanent employees
      partnerCompanyId: z.string(), // Required partner company
      salaryDeductionEligible: z.boolean(), // Must be true for loan eligibility
    }),
  }),
  
  // Application Behavior
  applicationBehavior: z.object({
    timeToComplete: z.number().positive(), // seconds
    fieldsChanged: z.number().min(0),
    documentsUploaded: z.number().min(0),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    deviceFingerprint: z.string().optional(),
  }),
  
  // Historical Data
  historicalData: z.object({
    previousApplications: z.number().min(0),
    previousApprovals: z.number().min(0),
    previousRejections: z.number().min(0),
    lastApplicationDate: z.date().optional(),
    paymentHistory: z.array(z.object({
      date: z.date(),
      amount: z.number(),
      status: z.enum(['paid', 'late', 'defaulted']),
    })).optional(),
  }),
});

/**
 * Fraud detection result schema
 */
export const FraudDetectionResultSchema = z.object({
  applicationId: z.string(),
  fraudScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  fraudProbability: z.number().min(0).max(1),
  
  // Detection Results
  isFraudulent: z.boolean(),
  confidence: z.number().min(0).max(1),
  
  // Risk Factors
  riskFactors: z.array(z.object({
    factor: z.string(),
    score: z.number(),
    weight: z.number(),
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
  })),
  
  // Recommendations
  recommendations: z.array(z.string()),
  requiresManualReview: z.boolean(),
  
  // Metadata
  modelVersion: z.string(),
  detectedAt: z.date(),
  processingTime: z.number(),
});

// ============================================================================
// FRAUD DETECTION SERVICE
// ============================================================================

export class FraudDetectionService {
  private modelVersion = '1.0.0';
  private riskWeights: Record<string, number> = {
    // Behavioral patterns (30%)
    applicationSpeed: 0.08,
    fieldChanges: 0.06,
    documentPatterns: 0.08,
    deviceFingerprint: 0.08,
    
    // Financial patterns (25%)
    incomeConsistency: 0.10,
    expensePatterns: 0.08,
    debtPatterns: 0.07,
    
    // Historical patterns (25%)
    applicationHistory: 0.10,
    paymentHistory: 0.08,
    approvalPatterns: 0.07,
    
    // Identity patterns (20%)
    identityConsistency: 0.08,
    contactPatterns: 0.06,
    addressPatterns: 0.06,
  };

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the fraud detection service
   */
  private async initializeService(): Promise<void> {
    console.log('Initializing Fraud Detection Service...');
    // Load any pre-trained models or patterns
  }

  /**
   * Detect fraud in loan application
   */
  async detectFraud(input: z.infer<typeof FraudDetectionInputSchema>): Promise<z.infer<typeof FraudDetectionResultSchema>> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const validatedInput = FraudDetectionInputSchema.parse(input);
      
      // Analyze risk factors
      const riskFactors = this.analyzeRiskFactors(validatedInput);
      
      // Calculate fraud score
      const fraudScore = this.calculateFraudScore(riskFactors);
      
      // Determine risk level and fraud probability
      const riskLevel = this.determineRiskLevel(fraudScore);
      const fraudProbability = this.calculateFraudProbability(fraudScore, riskFactors);
      
      // Determine if fraudulent
      const isFraudulent = this.determineFraudStatus(fraudScore, fraudProbability, riskFactors);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(riskFactors, fraudScore);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(riskLevel, riskFactors);
      
      // Determine if manual review is required
      const requiresManualReview = this.requiresManualReview(riskLevel, fraudScore, riskFactors);
      
      const processingTime = Date.now() - startTime;
      
      return {
        applicationId: validatedInput.applicationId,
        fraudScore: Math.round(fraudScore),
        riskLevel,
        fraudProbability,
        isFraudulent,
        confidence,
        riskFactors,
        recommendations,
        requiresManualReview,
        modelVersion: this.modelVersion,
        detectedAt: new Date(),
        processingTime,
      };
    } catch (error) {
      throw new Error(`Fraud detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze risk factors
   */
  private analyzeRiskFactors(input: z.infer<typeof FraudDetectionInputSchema>): Array<{
    factor: string;
    score: number;
    weight: number;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const factors = [];

    // Application Speed Analysis
    const speedScore = this.analyzeApplicationSpeed(input.applicationBehavior.timeToComplete);
    factors.push({
      factor: 'Application Speed',
      score: speedScore,
      weight: this.riskWeights.applicationSpeed,
      description: `Application completed in ${input.applicationBehavior.timeToComplete} seconds`,
      severity: this.getSeverity(speedScore),
    });

    // Field Changes Analysis
    const fieldChangesScore = this.analyzeFieldChanges(input.applicationBehavior.fieldsChanged);
    factors.push({
      factor: 'Field Changes',
      score: fieldChangesScore,
      weight: this.riskWeights.fieldChanges,
      description: `${input.applicationBehavior.fieldsChanged} fields were changed during application`,
      severity: this.getSeverity(fieldChangesScore),
    });

    // Document Patterns Analysis
    const documentScore = this.analyzeDocumentPatterns(input.applicationBehavior.documentsUploaded);
    factors.push({
      factor: 'Document Patterns',
      score: documentScore,
      weight: this.riskWeights.documentPatterns,
      description: `${input.applicationBehavior.documentsUploaded} documents uploaded`,
      severity: this.getSeverity(documentScore),
    });

    // Income Consistency Analysis (Partner Company Employee)
    const incomeScore = this.analyzeIncomeConsistency(input.financialInfo.monthlyIncome, input.financialInfo.employmentInfo);
    factors.push({
      factor: 'Income Consistency',
      score: incomeScore,
      weight: this.riskWeights.incomeConsistency,
      description: `Income of N$${input.financialInfo.monthlyIncome.toLocaleString()} for ${input.financialInfo.employmentInfo.position} at partner company`,
      severity: this.getSeverity(incomeScore),
    });

    // Expense Patterns Analysis
    const expenseScore = this.analyzeExpensePatterns(input.financialInfo.monthlyExpenses, input.financialInfo.monthlyIncome);
    factors.push({
      factor: 'Expense Patterns',
      score: expenseScore,
      weight: this.riskWeights.expensePatterns,
      description: `Expenses of N$${input.financialInfo.monthlyExpenses.toLocaleString()} vs income of N$${input.financialInfo.monthlyIncome.toLocaleString()}`,
      severity: this.getSeverity(expenseScore),
    });

    // Application History Analysis
    const historyScore = this.analyzeApplicationHistory(input.historicalData);
    factors.push({
      factor: 'Application History',
      score: historyScore,
      weight: this.riskWeights.applicationHistory,
      description: `${input.historicalData.previousApplications} previous applications, ${input.historicalData.previousApprovals} approved`,
      severity: this.getSeverity(historyScore),
    });

    // Payment History Analysis
    const paymentScore = this.analyzePaymentHistory(input.historicalData.paymentHistory || []);
    factors.push({
      factor: 'Payment History',
      score: paymentScore,
      weight: this.riskWeights.paymentHistory,
      description: paymentScore > 70 ? 'Good payment history' : 'Concerning payment patterns',
      severity: this.getSeverity(paymentScore),
    });

    // Identity Consistency Analysis
    const identityScore = this.analyzeIdentityConsistency(input.personalInfo);
    factors.push({
      factor: 'Identity Consistency',
      score: identityScore,
      weight: this.riskWeights.identityConsistency,
      description: 'Identity information consistency check',
      severity: this.getSeverity(identityScore),
    });

    // Contact Patterns Analysis
    const contactScore = this.analyzeContactPatterns(input.personalInfo);
    factors.push({
      factor: 'Contact Patterns',
      score: contactScore,
      weight: this.riskWeights.contactPatterns,
      description: 'Contact information pattern analysis',
      severity: this.getSeverity(contactScore),
    });

    return factors;
  }

  /**
   * Analyze application speed
   */
  private analyzeApplicationSpeed(timeToComplete: number): number {
    // Too fast (< 2 minutes) or too slow (> 30 minutes) is suspicious
    if (timeToComplete < 120) return 80; // Very fast - suspicious
    if (timeToComplete > 1800) return 70; // Very slow - suspicious
    if (timeToComplete < 300) return 60; // Fast - moderate risk
    if (timeToComplete > 900) return 50; // Slow - moderate risk
    return 20; // Normal speed - low risk
  }

  /**
   * Analyze field changes
   */
  private analyzeFieldChanges(fieldsChanged: number): number {
    // Too many changes might indicate data manipulation
    if (fieldsChanged > 10) return 90; // Many changes - high risk
    if (fieldsChanged > 5) return 70; // Several changes - medium-high risk
    if (fieldsChanged > 2) return 50; // Some changes - medium risk
    return 20; // Few changes - low risk
  }

  /**
   * Analyze document patterns
   */
  private analyzeDocumentPatterns(documentsUploaded: number): number {
    // Too few or too many documents might be suspicious
    if (documentsUploaded === 0) return 80; // No documents - high risk
    if (documentsUploaded > 10) return 70; // Too many documents - medium-high risk
    if (documentsUploaded < 2) return 60; // Too few documents - medium risk
    return 20; // Normal document count - low risk
  }

  /**
   * Analyze income consistency (Partner Company Employee)
   */
  private analyzeIncomeConsistency(monthlyIncome: number, employmentInfo: {
    position: string;
    salaryDeductionEligible: boolean;
  }): number {
    // Check if income is consistent with position and partner company standards
    const position = employmentInfo.position.toLowerCase();
    const income = monthlyIncome;
    
    // Partner company income validation (higher standards)
    if (position.includes('manager') && income < 20000) return 80;
    if (position.includes('director') && income < 35000) return 90;
    if (position.includes('junior') && income > 25000) return 70;
    if (position.includes('senior') && income < 15000) return 80;
    
    // Partner company minimum income requirements
    if (income < 5000) return 90; // Below partner company minimum
    if (income > 150000) return 60; // Very high income - needs verification
    
    // Verify salary deduction eligibility
    if (!employmentInfo.salaryDeductionEligible) return 95; // Critical - not eligible for salary deduction
    
    return 20; // Normal income range for partner company employee
  }

  /**
   * Analyze expense patterns
   */
  private analyzeExpensePatterns(monthlyExpenses: number, monthlyIncome: number): number {
    const expenseRatio = monthlyExpenses / monthlyIncome;
    
    if (expenseRatio > 0.9) return 90; // Expenses > 90% of income
    if (expenseRatio > 0.8) return 70; // Expenses > 80% of income
    if (expenseRatio > 0.7) return 50; // Expenses > 70% of income
    if (expenseRatio < 0.1) return 60; // Expenses < 10% of income - unusual
    
    return 20; // Normal expense ratio
  }

  /**
   * Analyze application history
   */
  private analyzeApplicationHistory(historicalData: {
    previousApplications: number;
    previousApprovals: number;
    previousRejections: number;
  }): number {
    const { previousApplications, previousApprovals, previousRejections } = historicalData;
    
    if (previousApplications === 0) return 30; // First application - moderate risk
    
    const approvalRate = previousApprovals / previousApplications;
    const rejectionRate = previousRejections / previousApplications;
    
    if (rejectionRate > 0.8) return 90; // High rejection rate
    if (rejectionRate > 0.5) return 70; // Moderate rejection rate
    if (approvalRate > 0.8) return 20; // High approval rate - good
    if (approvalRate > 0.5) return 40; // Moderate approval rate
    
    return 60; // Mixed history
  }

  /**
   * Analyze payment history
   */
  private analyzePaymentHistory(paymentHistory: Array<{
    date: Date;
    amount: number;
    status: 'paid' | 'late' | 'defaulted';
  }>): number {
    if (!paymentHistory || paymentHistory.length === 0) return 50; // No history
    
    const totalPayments = paymentHistory.length;
    const latePayments = paymentHistory.filter(p => p.status === 'late').length;
    const defaultedPayments = paymentHistory.filter(p => p.status === 'defaulted').length;
    
    const lateRate = latePayments / totalPayments;
    const defaultRate = defaultedPayments / totalPayments;
    
    if (defaultRate > 0.2) return 90; // High default rate
    if (defaultRate > 0.1) return 70; // Moderate default rate
    if (lateRate > 0.3) return 60; // High late payment rate
    if (lateRate > 0.1) return 40; // Moderate late payment rate
    
    return 20; // Good payment history
  }

  /**
   * Analyze identity consistency
   */
  private analyzeIdentityConsistency(personalInfo: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  }): number {
    const { name, email, phone, idNumber } = personalInfo;
    
    let riskScore = 20; // Base low risk
    
    // Check for suspicious patterns
    if (name.length < 3) riskScore += 30; // Very short name
    if (email.includes('+') || email.includes('..')) riskScore += 20; // Suspicious email
    if (phone.length < 10) riskScore += 30; // Invalid phone
    if (idNumber.length !== 11) riskScore += 40; // Invalid ID format
    
    // Check for common fraud patterns
    if (name.toLowerCase().includes('test')) riskScore += 50;
    if (email.toLowerCase().includes('test')) riskScore += 40;
    
    return Math.min(100, riskScore);
  }

  /**
   * Analyze contact patterns
   */
  private analyzeContactPatterns(personalInfo: {
    email: string;
    phone: string;
  }): number {
    const { email, phone } = personalInfo;
    
    let riskScore = 20; // Base low risk
    
    // Check for disposable email domains
    const disposableDomains = ['tempmail', '10minutemail', 'guerrillamail', 'mailinator'];
    if (disposableDomains.some(domain => email.includes(domain))) {
      riskScore += 50;
    }
    
    // Check for suspicious phone patterns
    if (phone.startsWith('000') || phone.startsWith('111')) {
      riskScore += 30;
    }
    
    return Math.min(100, riskScore);
  }

  /**
   * Get severity level based on score
   */
  private getSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Calculate fraud score
   */
  private calculateFraudScore(riskFactors: Array<{
    factor: string;
    score: number;
    weight: number;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>): number {
    const weightedSum = riskFactors.reduce((sum, factor) => {
      return sum + (factor.score * factor.weight);
    }, 0);

    return Math.min(100, weightedSum);
  }

  /**
   * Determine risk level
   */
  private determineRiskLevel(fraudScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (fraudScore >= 80) return 'critical';
    if (fraudScore >= 60) return 'high';
    if (fraudScore >= 40) return 'medium';
    return 'low';
  }

  /**
   * Calculate fraud probability
   */
  private calculateFraudProbability(fraudScore: number, riskFactors: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>): number {
    const criticalFactors = riskFactors.filter(f => f.severity === 'critical').length;
    const highFactors = riskFactors.filter(f => f.severity === 'high').length;
    
    let probability = fraudScore / 100;
    
    // Adjust probability based on critical factors
    if (criticalFactors > 0) probability += 0.2;
    if (highFactors > 2) probability += 0.1;
    
    return Math.min(1, probability);
  }

  /**
   * Determine fraud status
   */
  private determineFraudStatus(
    fraudScore: number,
    fraudProbability: number,
    riskFactors: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>
  ): boolean {
    // Auto-detect fraud for high scores with critical factors
    if (fraudScore >= 80 && fraudProbability >= 0.8) return true;
    
    // Check for critical risk factors
    const criticalFactors = riskFactors.filter(f => f.severity === 'critical');
    if (criticalFactors.length >= 2) return true;
    
    return false;
  }

  /**
   * Calculate confidence
   */
  private calculateConfidence(riskFactors: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>, fraudScore: number): number {
    let confidence = 0.8; // Base confidence
    
    // Increase confidence with more risk factors
    confidence += Math.min(0.2, riskFactors.length * 0.02);
    
    // Decrease confidence for borderline scores
    if (fraudScore >= 40 && fraudScore <= 60) confidence -= 0.1;
    
    return Math.max(0.5, Math.min(1.0, confidence));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    riskLevel: string,
    riskFactors: Array<{
      factor: string;
      score: number;
      weight: number;
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>
  ): string[] {
    const recommendations = [];

    // Risk level recommendations
    switch (riskLevel) {
      case 'critical':
        recommendations.push('Immediate manual review required');
        recommendations.push('Consider additional identity verification');
        recommendations.push('Request additional documentation');
        break;
      case 'high':
        recommendations.push('Manual review recommended');
        recommendations.push('Verify employment and income information');
        recommendations.push('Check identity documents carefully');
        break;
      case 'medium':
        recommendations.push('Enhanced verification recommended');
        recommendations.push('Review application for inconsistencies');
        break;
      case 'low':
        recommendations.push('Standard verification process');
        break;
    }

    // Factor-specific recommendations
    const criticalFactors = riskFactors.filter(f => f.severity === 'critical');
    criticalFactors.forEach(factor => {
      switch (factor.factor) {
        case 'Application Speed':
          recommendations.push('Verify application completion time');
          break;
        case 'Income Consistency':
          recommendations.push('Verify employment and income details');
          break;
        case 'Identity Consistency':
          recommendations.push('Perform enhanced identity verification');
          break;
        case 'Payment History':
          recommendations.push('Review payment history carefully');
          break;
      }
    });

    return recommendations;
  }

  /**
   * Determine if manual review is required
   */
  private requiresManualReview(
    riskLevel: string,
    fraudScore: number,
    riskFactors: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>
  ): boolean {
    if (riskLevel === 'critical' || riskLevel === 'high') return true;
    if (fraudScore >= 70) return true;
    
    const criticalFactors = riskFactors.filter(f => f.severity === 'critical');
    if (criticalFactors.length > 0) return true;
    
    return false;
  }

  /**
   * Batch process multiple applications
   */
  async batchDetectFraud(
    applications: z.infer<typeof FraudDetectionInputSchema>[]
  ): Promise<z.infer<typeof FraudDetectionResultSchema>[]> {
    const results = [];
    
    for (const application of applications) {
      try {
        const result = await this.detectFraud(application);
        results.push(result);
      } catch (error) {
        console.error(`Failed to detect fraud for application ${application.applicationId}: ${error}`);
        // Continue with other applications
      }
    }
    
    return results;
  }

  /**
   * Get service statistics
   */
  getServiceStatistics(): {
    modelVersion: string;
    totalRiskFactors: number;
    weights: Record<string, number>;
  } {
    return {
      modelVersion: this.modelVersion,
      totalRiskFactors: Object.keys(this.riskWeights).length,
      weights: this.riskWeights,
    };
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;
export type FraudDetectionResult = z.infer<typeof FraudDetectionResultSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a new fraud detection service instance
 */
export function createFraudDetectionService(): FraudDetectionService {
  return new FraudDetectionService();
}

/**
 * Quick fraud detection
 */
export async function detectFraudQuick(
  service: FraudDetectionService,
  input: FraudDetectionInput
): Promise<FraudDetectionResult> {
  return service.detectFraud(input);
}

/**
 * Validate fraud detection input
 */
export function validateFraudDetectionInput(input: unknown): {
  success: boolean;
  data?: FraudDetectionInput;
  errors?: z.ZodError;
} {
  try {
    const validatedData = FraudDetectionInputSchema.parse(input);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
      };
    }
    throw error;
  }
}

// Export default instance
export const fraudDetectionService = createFraudDetectionService();
