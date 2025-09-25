/**
 * Credit Scoring Engine for BuffrLend
 * Pure TypeScript implementation with mathematical models
 * Inspired by data science best practices for financial risk assessment
 */

import { z } from 'zod';

// ============================================================================
// CREDIT SCORING TYPES AND SCHEMAS
// ============================================================================

/**
 * Credit scoring input schema
 */
export const CreditScoringInputSchema = z.object({
  // Personal Information
  age: z.number().min(18).max(100),
  employmentTenure: z.number().min(0).max(60), // months
  monthlyIncome: z.number().positive(),
  monthlyExpenses: z.number().min(0),
  
  // Financial Information
  existingDebt: z.number().min(0),
  creditHistory: z.enum(['excellent', 'good', 'fair', 'poor', 'none']),
  bankAccountAge: z.number().min(0), // months
  savingsBalance: z.number().min(0),
  
  // Loan Information
  loanAmount: z.number().positive(),
  loanTerm: z.number().min(1).max(60), // months
  
  // Employment Information (Only permanent employees from partner companies)
  employmentType: z.enum(['permanent']), // Only permanent employees eligible
  industrySector: z.string(),
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']),
  partnerCompanyId: z.string(), // Required - must be from partner company
  
  // Additional Factors
  hasGuarantor: z.boolean().optional(),
  previousLoans: z.number().min(0).optional(),
  latePayments: z.number().min(0).optional(),
  bankruptcies: z.number().min(0).optional(),
});

/**
 * Credit scoring result schema
 */
export const CreditScoringResultSchema = z.object({
  creditScore: z.number().min(300).max(850),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  approvalStatus: z.enum(['approved', 'declined', 'manual_review']),
  confidence: z.number().min(0).max(1),
  
  // Detailed Analysis
  factors: z.array(z.object({
    factor: z.string(),
    weight: z.number(),
    score: z.number(),
    impact: z.enum(['positive', 'negative', 'neutral']),
    explanation: z.string(),
  })),
  
  // Recommendations
  recommendations: z.array(z.string()),
  maxLoanAmount: z.number().optional(),
  suggestedInterestRate: z.number().optional(),
  
  // Metadata
  modelVersion: z.string(),
  calculatedAt: z.date(),
  processingTime: z.number(),
});

// ============================================================================
// CREDIT SCORING ENGINE
// ============================================================================

export class CreditScoringEngine {
  private modelVersion = '1.0.0';
  private weights: Record<string, number> = {
    // Financial factors (40% total)
    debtToIncomeRatio: 0.15,
    incomeStability: 0.10,
    savingsRatio: 0.08,
    creditHistory: 0.07,
    
    // Employment factors (25% total)
    employmentTenure: 0.10,
    employmentType: 0.08,
    industryStability: 0.07,
    
    // Personal factors (20% total)
    age: 0.05,
    bankAccountAge: 0.08,
    previousLoans: 0.07,
    
    // Risk factors (15% total)
    latePayments: 0.08,
    bankruptcies: 0.04,
    guarantor: 0.03,
  };

  constructor() {
    this.initializeEngine();
  }

  /**
   * Initialize the credit scoring engine
   */
  private async initializeEngine(): Promise<void> {
    console.log('Initializing Credit Scoring Engine...');
    // Load any pre-trained models or configurations
  }

  /**
   * Calculate credit score for a loan application
   */
  async calculateCreditScore(input: z.infer<typeof CreditScoringInputSchema>): Promise<z.infer<typeof CreditScoringResultSchema>> {
    const startTime = Date.now();
    
    try {
      // Validate input
      const validatedInput = CreditScoringInputSchema.parse(input);
      
      // Calculate individual factor scores
      const factors = this.calculateFactorScores(validatedInput);
      
      // Calculate weighted credit score
      const creditScore = this.calculateWeightedScore(factors);
      
      // Determine risk level and approval status
      const riskLevel = this.determineRiskLevel(creditScore);
      const approvalStatus = this.determineApprovalStatus(creditScore, riskLevel, validatedInput);
      
      // Calculate confidence based on data completeness
      const confidence = this.calculateConfidence(validatedInput);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(creditScore, riskLevel, factors);
      
      // Calculate loan parameters
      const maxLoanAmount = this.calculateMaxLoanAmount(validatedInput, creditScore);
      const suggestedInterestRate = this.calculateInterestRate(creditScore, riskLevel);
      
      const processingTime = Date.now() - startTime;
      
      return {
        creditScore: Math.round(creditScore),
        riskLevel,
        approvalStatus,
        confidence,
        factors,
        recommendations,
        maxLoanAmount,
        suggestedInterestRate,
        modelVersion: this.modelVersion,
        calculatedAt: new Date(),
        processingTime,
      };
    } catch (error) {
      throw new Error(`Credit scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate individual factor scores
   */
  private calculateFactorScores(input: z.infer<typeof CreditScoringInputSchema>): Array<{
    factor: string;
    weight: number;
    score: number;
    impact: 'positive' | 'negative' | 'neutral';
    explanation: string;
  }> {
    const factors: Array<{
      factor: string;
      weight: number;
      score: number;
      impact: 'positive' | 'negative' | 'neutral';
      explanation: string;
    }> = [];

    // Debt-to-Income Ratio
    const dti = input.existingDebt / input.monthlyIncome;
    const dtiScore = Math.max(0, 100 - (dti * 200));
    factors.push({
      factor: 'Debt-to-Income Ratio',
      weight: this.weights.debtToIncomeRatio,
      score: dtiScore,
      impact: dti < 0.3 ? 'positive' : dti > 0.5 ? 'negative' : 'neutral',
      explanation: `DTI of ${(dti * 100).toFixed(1)}% is ${dti < 0.3 ? 'excellent' : dti < 0.5 ? 'acceptable' : 'concerning'}`,
    });

    // Income Stability
    const incomeScore = Math.min(100, (input.monthlyIncome / 1000) * 10);
    factors.push({
      factor: 'Income Level',
      weight: this.weights.incomeStability,
      score: incomeScore,
      impact: input.monthlyIncome > 15000 ? 'positive' : input.monthlyIncome < 5000 ? 'negative' : 'neutral',
      explanation: `Monthly income of N$${input.monthlyIncome.toLocaleString()} is ${input.monthlyIncome > 15000 ? 'strong' : input.monthlyIncome < 5000 ? 'low' : 'moderate'}`,
    });

    // Savings Ratio
    const savingsRatio = input.savingsBalance / input.monthlyIncome;
    const savingsScore = Math.min(100, savingsRatio * 50);
    factors.push({
      factor: 'Savings Ratio',
      weight: this.weights.savingsRatio,
      score: savingsScore,
      impact: savingsRatio > 3 ? 'positive' : savingsRatio < 1 ? 'negative' : 'neutral',
      explanation: `Savings of ${(savingsRatio * 100).toFixed(1)}% of monthly income shows ${savingsRatio > 3 ? 'strong' : savingsRatio < 1 ? 'weak' : 'moderate'} financial discipline`,
    });

    // Credit History
    const creditHistoryScores = {
      excellent: 100,
      good: 80,
      fair: 60,
      poor: 30,
      none: 50,
    };
    const creditScore = creditHistoryScores[input.creditHistory];
    factors.push({
      factor: 'Credit History',
      weight: this.weights.creditHistory,
      score: creditScore,
      impact: input.creditHistory === 'excellent' ? 'positive' : input.creditHistory === 'poor' ? 'negative' : 'neutral',
      explanation: `${input.creditHistory.charAt(0).toUpperCase() + input.creditHistory.slice(1)} credit history`,
    });

    // Employment Tenure
    const tenureScore = Math.min(100, (input.employmentTenure / 24) * 100);
    factors.push({
      factor: 'Employment Tenure',
      weight: this.weights.employmentTenure,
      score: tenureScore,
      impact: input.employmentTenure > 24 ? 'positive' : input.employmentTenure < 6 ? 'negative' : 'neutral',
      explanation: `${input.employmentTenure} months of employment shows ${input.employmentTenure > 24 ? 'strong' : input.employmentTenure < 6 ? 'limited' : 'moderate'} job stability`,
    });

    // Employment Type (Only permanent employees from partner companies)
    const employmentScore = 100; // All applicants are permanent employees from partner companies
    factors.push({
      factor: 'Employment Type',
      weight: this.weights.employmentType,
      score: employmentScore,
      impact: 'positive', // Always positive since only permanent employees are eligible
      explanation: 'Permanent employment from partner company provides high income stability and salary deduction capability',
    });

    // Age Factor
    const ageScore = input.age >= 25 && input.age <= 55 ? 100 : 
                    input.age < 25 ? 70 : 80;
    factors.push({
      factor: 'Age',
      weight: this.weights.age,
      score: ageScore,
      impact: input.age >= 25 && input.age <= 55 ? 'positive' : 'neutral',
      explanation: `Age ${input.age} is in the ${input.age >= 25 && input.age <= 55 ? 'optimal' : 'acceptable'} range for credit assessment`,
    });

    // Bank Account Age
    const bankAccountScore = Math.min(100, (input.bankAccountAge / 12) * 20);
    factors.push({
      factor: 'Banking Relationship',
      weight: this.weights.bankAccountAge,
      score: bankAccountScore,
      impact: input.bankAccountAge > 24 ? 'positive' : input.bankAccountAge < 6 ? 'negative' : 'neutral',
      explanation: `${input.bankAccountAge} months of banking history shows ${input.bankAccountAge > 24 ? 'established' : input.bankAccountAge < 6 ? 'limited' : 'developing'} banking relationship`,
    });

    // Previous Loans
    const previousLoans = input.previousLoans || 0;
    const previousLoansScore = previousLoans > 0 ? Math.min(100, 60 + (previousLoans * 10)) : 50;
    factors.push({
      factor: 'Previous Loan Experience',
      weight: this.weights.previousLoans,
      score: previousLoansScore,
      impact: previousLoans > 0 ? 'positive' : 'neutral',
      explanation: `${previousLoans} previous loans show ${previousLoans > 0 ? 'experience' : 'no experience'} with credit products`,
    });

    // Late Payments
    const latePayments = input.latePayments || 0;
    const latePaymentsScore = Math.max(0, 100 - (latePayments * 20));
    factors.push({
      factor: 'Payment History',
      weight: this.weights.latePayments,
      score: latePaymentsScore,
      impact: latePayments === 0 ? 'positive' : latePayments > 2 ? 'negative' : 'neutral',
      explanation: `${latePayments} late payments indicate ${latePayments === 0 ? 'excellent' : latePayments > 2 ? 'poor' : 'acceptable'} payment behavior`,
    });

    // Bankruptcies
    const bankruptcies = input.bankruptcies || 0;
    const bankruptciesScore = bankruptcies === 0 ? 100 : 0;
    factors.push({
      factor: 'Bankruptcy History',
      weight: this.weights.bankruptcies,
      score: bankruptciesScore,
      impact: bankruptcies === 0 ? 'positive' : 'negative',
      explanation: `${bankruptcies} bankruptcies ${bankruptcies === 0 ? 'show clean financial history' : 'indicate serious financial distress'}`,
    });

    // Guarantor
    const guarantorScore = input.hasGuarantor ? 100 : 70;
    factors.push({
      factor: 'Guarantor Support',
      weight: this.weights.guarantor,
      score: guarantorScore,
      impact: input.hasGuarantor ? 'positive' : 'neutral',
      explanation: input.hasGuarantor ? 'Guarantor provides additional security' : 'No guarantor support available',
    });

    return factors;
  }

  /**
   * Calculate weighted credit score
   */
  private calculateWeightedScore(factors: Array<{
    factor: string;
    weight: number;
    score: number;
    impact: 'positive' | 'negative' | 'neutral';
    explanation: string;
  }>): number {
    const weightedSum = factors.reduce((sum, factor) => {
      return sum + (factor.score * factor.weight);
    }, 0);

    // Convert to 300-850 scale (standard credit score range)
    const baseScore = 300;
    const maxScore = 550;
    return baseScore + (weightedSum / 100) * maxScore;
  }

  /**
   * Determine risk level based on credit score
   */
  private determineRiskLevel(creditScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (creditScore >= 720) return 'low';
    if (creditScore >= 650) return 'medium';
    if (creditScore >= 580) return 'high';
    return 'critical';
  }

  /**
   * Determine approval status
   */
  private determineApprovalStatus(
    creditScore: number,
    riskLevel: string,
    input: z.infer<typeof CreditScoringInputSchema>
  ): 'approved' | 'declined' | 'manual_review' {
    // Auto-approve high scores with good factors (all applicants are permanent employees)
    if (creditScore >= 720 && input.creditHistory !== 'poor') {
      return 'approved';
    }

    // Auto-decline very low scores or critical factors
    if (creditScore < 580 || (input.bankruptcies && input.bankruptcies > 0)) {
      return 'declined';
    }

    // Manual review for borderline cases
    return 'manual_review';
  }

  /**
   * Calculate confidence in the score
   */
  private calculateConfidence(
    input: z.infer<typeof CreditScoringInputSchema>
  ): number {
    let confidence = 0.8; // Base confidence

    // Increase confidence with more data points
    if (input.savingsBalance > 0) confidence += 0.05;
    if (input.previousLoans && input.previousLoans > 0) confidence += 0.05;
    if (input.bankAccountAge > 12) confidence += 0.05;
    if (input.employmentTenure > 12) confidence += 0.05;

    // Decrease confidence with missing critical data
    if (input.creditHistory === 'none') confidence -= 0.1;
    // All applicants are permanent employees, so no confidence reduction needed

    return Math.max(0.5, Math.min(1.0, confidence));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    creditScore: number,
    riskLevel: string,
    _factors: Array<{
      factor: string;
      weight: number;
      score: number;
      impact: 'positive' | 'negative' | 'neutral';
      explanation: string;
    }>
  ): string[] {
    const recommendations = [];

    // Score-based recommendations
    if (creditScore < 580) {
      recommendations.push('Consider improving credit history before applying');
      recommendations.push('Build savings to demonstrate financial stability');
    } else if (creditScore < 650) {
      recommendations.push('Consider a smaller loan amount to reduce risk');
      recommendations.push('Provide additional documentation to support application');
    }

    // Factor-based recommendations
    const negativeFactors = _factors.filter(f => f.impact === 'negative');
    negativeFactors.forEach(factor => {
      switch (factor.factor) {
        case 'Debt-to-Income Ratio':
          recommendations.push('Reduce existing debt to improve debt-to-income ratio');
          break;
        case 'Employment Tenure':
          recommendations.push('Consider waiting until employment tenure increases');
          break;
        case 'Payment History':
          recommendations.push('Focus on making all payments on time going forward');
          break;
        case 'Savings Ratio':
          recommendations.push('Build emergency savings to improve financial profile');
          break;
      }
    });

    // General recommendations
    if (riskLevel === 'low') {
      recommendations.push('Excellent credit profile - consider premium loan products');
    } else if (riskLevel === 'medium') {
      recommendations.push('Good credit profile - standard loan terms available');
    } else {
      recommendations.push('Consider financial counseling to improve credit profile');
    }

    return recommendations;
  }

  /**
   * Calculate maximum loan amount
   */
  private calculateMaxLoanAmount(
    input: z.infer<typeof CreditScoringInputSchema>,
    creditScore: number
  ): number {
    const baseMultiplier = creditScore / 850;
    const incomeMultiplier = input.monthlyIncome * 0.3; // 30% of monthly income
    const maxAmount = incomeMultiplier * baseMultiplier * 12; // Annual amount
    
    return Math.min(maxAmount, input.monthlyIncome * 24); // Cap at 24 months income
  }

  /**
   * Calculate suggested interest rate
   */
  private calculateInterestRate(creditScore: number, riskLevel: string): number {
    const baseRate = 15; // 15% base rate
    
    const riskMultipliers = {
      low: 0.8,
      medium: 1.0,
      high: 1.3,
      critical: 1.8,
    };

    const scoreAdjustment = (850 - creditScore) / 850 * 5; // Up to 5% adjustment
    
    return baseRate * riskMultipliers[riskLevel as keyof typeof riskMultipliers] + scoreAdjustment;
  }

  /**
   * Batch process multiple applications
   */
  async batchProcessApplications(
    applications: z.infer<typeof CreditScoringInputSchema>[]
  ): Promise<z.infer<typeof CreditScoringResultSchema>[]> {
    const results = [];
    
    for (const application of applications) {
      try {
        const result = await this.calculateCreditScore(application);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process application: ${error}`);
        // Continue with other applications
      }
    }
    
    return results;
  }

  /**
   * Get engine statistics
   */
  getEngineStatistics(): {
    modelVersion: string;
    totalFactors: number;
    weights: Record<string, number>;
  } {
    return {
      modelVersion: this.modelVersion,
      totalFactors: Object.keys(this.weights).length,
      weights: this.weights,
    };
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreditScoringInput = z.infer<typeof CreditScoringInputSchema>;
export type CreditScoringResult = z.infer<typeof CreditScoringResultSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a new credit scoring engine instance
 */
export function createCreditScoringEngine(): CreditScoringEngine {
  return new CreditScoringEngine();
}

/**
 * Quick credit score calculation
 */
export async function calculateQuickCreditScore(
  engine: CreditScoringEngine,
  input: CreditScoringInput
): Promise<CreditScoringResult> {
  return engine.calculateCreditScore(input);
}

/**
 * Validate credit scoring input
 */
export function validateCreditScoringInput(input: unknown): {
  success: boolean;
  data?: CreditScoringInput;
  errors?: z.ZodError;
} {
  try {
    const validatedData = CreditScoringInputSchema.parse(input);
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
export const creditScoringEngine = createCreditScoringEngine();
