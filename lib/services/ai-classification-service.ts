/**
 * AI Classification Service
 * 
 * This service provides AI-powered document classification and analysis
 * using natural language processing techniques for KYC document verification.
 */

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export interface DocumentClassification {
  type: 'national_id' | 'passport' | 'drivers_license' | 'bank_statement' | 'payslip' | 'employment_letter' | 'unknown';
  confidence: number;
  extractedFields: Record<string, unknown>;
  validationResults: ValidationResult[];
  riskScore: number;
  recommendations: string[];
}

export interface ValidationResult {
  field: string;
  isValid: boolean;
  confidence: number;
  reason?: string;
}

export interface DocumentAnalysis {
  authenticity: number;
  completeness: number;
  clarity: number;
  riskFactors: string[];
  complianceIssues: string[];
}

export class AIClassificationService {
  private static instance: AIClassificationService;
  private llm: unknown;

  private constructor() {
    this.initializeLLM();
  }

  public static getInstance(): AIClassificationService {
    if (!AIClassificationService.instance) {
      AIClassificationService.instance = new AIClassificationService();
    }
    return AIClassificationService.instance;
  }

  private initializeLLM(): void {
    this.llm = new ChatOpenAI({
      modelName: process.env.LLM_CHOICE || 'gpt-4o-mini',
      temperature: 0.1,
      maxTokens: 2000,
    });
  }

  /**
   * Classify document type and extract information using AI
   */
  public async classifyDocument(
    text: string,
    imageMetadata?: {
      width: number;
      height: number;
      format: string;
      size: number;
    }
  ): Promise<DocumentClassification> {
    const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert document analyst specializing in KYC (Know Your Customer) document verification for financial services in Namibia.

Analyze the following document text and metadata to classify the document type and extract relevant information.

Document Text:
{text}

Image Metadata:
{metadata}

Please provide a JSON response with the following structure:
{{
  "type": "national_id|passport|drivers_license|bank_statement|payslip|employment_letter|unknown",
  "confidence": 0.0-1.0,
  "extractedFields": {{
    "idNumber": "string or null",
    "fullName": "string or null",
    "dateOfBirth": "string or null",
    "placeOfBirth": "string or null",
    "nationality": "string or null",
    "passportNumber": "string or null",
    "licenseNumber": "string or null",
    "licenseClass": "string or null",
    "accountNumber": "string or null",
    "bankName": "string or null",
    "statementPeriod": "string or null",
    "employerName": "string or null",
    "position": "string or null",
    "startDate": "string or null",
    "grossPay": "string or null",
    "netPay": "string or null"
  }},
  "validationResults": [
    {{
      "field": "field_name",
      "isValid": true/false,
      "confidence": 0.0-1.0,
      "reason": "explanation if invalid"
    }}
  ],
  "riskScore": 0.0-1.0,
  "recommendations": ["recommendation1", "recommendation2"]
}}

Guidelines:
1. Classify the document type based on content and structure
2. Extract all relevant fields for the document type
3. Validate extracted information for accuracy and completeness
4. Assess risk factors (inconsistencies, missing information, suspicious patterns)
5. Provide actionable recommendations for verification

Focus on Namibian document formats and requirements.
`);

    try {
      const formattedPrompt = await prompt.format({
        text: text,
        metadata: JSON.stringify(imageMetadata || {}),
      });
      const response = await (this.llm as ChatOpenAI).invoke(formattedPrompt);

      const result = JSON.parse(response.content as string);
      return result;
    } catch (error) {
      console.error('AI classification failed:', error);
      throw new Error('Failed to classify document using AI');
    }
  }

  /**
   * Analyze document authenticity and quality
   */
  public async analyzeDocumentQuality(
    text: string,
    imageMetadata?: {
      width: number;
      height: number;
      format: string;
      size: number;
    }
  ): Promise<DocumentAnalysis> {
    const prompt = ChatPromptTemplate.fromTemplate(`
You are a document authenticity expert analyzing KYC documents for potential fraud and quality issues.

Document Text:
{text}

Image Metadata:
{metadata}

Analyze the document for:
1. Authenticity indicators
2. Completeness of information
3. Image clarity and quality
4. Risk factors and red flags
5. Compliance issues

Provide a JSON response:
{{
  "authenticity": 0.0-1.0,
  "completeness": 0.0-1.0,
  "clarity": 0.0-1.0,
  "riskFactors": ["risk1", "risk2"],
  "complianceIssues": ["issue1", "issue2"]
}}

Consider:
- Document format consistency
- Information completeness
- Suspicious patterns or inconsistencies
- Image quality and readability
- Namibian document standards
- Anti-fraud indicators
`);

    try {
      const formattedPrompt = await prompt.format({
        text: text,
        metadata: JSON.stringify(imageMetadata || {}),
      });
      const response = await (this.llm as ChatOpenAI).invoke(formattedPrompt);

      const result = JSON.parse(response.content as string);
      return result;
    } catch (error) {
      console.error('Document quality analysis failed:', error);
      throw new Error('Failed to analyze document quality');
    }
  }

  /**
   * Validate extracted information against known patterns
   */
  public validateExtractedInformation(
    documentType: string,
    extractedFields: Record<string, unknown>
  ): ValidationResult[] {
    const validationResults: ValidationResult[] = [];

    switch (documentType) {
      case 'national_id':
        validationResults.push(...this.validateNationalId(extractedFields));
        break;
      case 'passport':
        validationResults.push(...this.validatePassport(extractedFields));
        break;
      case 'drivers_license':
        validationResults.push(...this.validateDriversLicense(extractedFields));
        break;
      case 'bank_statement':
        validationResults.push(...this.validateBankStatement(extractedFields));
        break;
      case 'payslip':
        validationResults.push(...this.validatePayslip(extractedFields));
        break;
      case 'employment_letter':
        validationResults.push(...this.validateEmploymentLetter(extractedFields));
        break;
    }

    return validationResults;
  }

  private validateNationalId(fields: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate ID number format (Namibian ID format)
    if (fields.idNumber) {
      const isValidFormat = /^\d{11,13}$/.test(String(fields.idNumber));
      results.push({
        field: 'idNumber',
        isValid: isValidFormat,
        confidence: isValidFormat ? 0.9 : 0.1,
        reason: isValidFormat ? undefined : 'Invalid ID number format',
      });
    }

    // Validate name format
    if (fields.fullName) {
      const isValidName = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(String(fields.fullName));
      results.push({
        field: 'fullName',
        isValid: isValidName,
        confidence: isValidName ? 0.8 : 0.3,
        reason: isValidName ? undefined : 'Invalid name format',
      });
    }

    // Validate date of birth
    if (fields.dateOfBirth) {
      const isValidDate = this.isValidDate(String(fields.dateOfBirth));
      results.push({
        field: 'dateOfBirth',
        isValid: isValidDate,
        confidence: isValidDate ? 0.8 : 0.2,
        reason: isValidDate ? undefined : 'Invalid date format',
      });
    }

    return results;
  }

  private validatePassport(fields: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate passport number format
    if (fields.passportNumber) {
      const isValidFormat = /^[A-Z0-9]{6,9}$/.test(String(fields.passportNumber));
      results.push({
        field: 'passportNumber',
        isValid: isValidFormat,
        confidence: isValidFormat ? 0.9 : 0.1,
        reason: isValidFormat ? undefined : 'Invalid passport number format',
      });
    }

    // Validate nationality
    if (fields.nationality) {
      const isValidNationality = /^[A-Z][a-z]+$/.test(String(fields.nationality));
      results.push({
        field: 'nationality',
        isValid: isValidNationality,
        confidence: isValidNationality ? 0.8 : 0.3,
        reason: isValidNationality ? undefined : 'Invalid nationality format',
      });
    }

    return results;
  }

  private validateDriversLicense(fields: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate license number format
    if (fields.licenseNumber) {
      const isValidFormat = /^[A-Z0-9]{6,12}$/.test(String(fields.licenseNumber));
      results.push({
        field: 'licenseNumber',
        isValid: isValidFormat,
        confidence: isValidFormat ? 0.9 : 0.1,
        reason: isValidFormat ? undefined : 'Invalid license number format',
      });
    }

    return results;
  }

  private validateBankStatement(fields: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate account number format
    if (fields.accountNumber) {
      const isValidFormat = /^\d{8,16}$/.test(String(fields.accountNumber));
      results.push({
        field: 'accountNumber',
        isValid: isValidFormat,
        confidence: isValidFormat ? 0.8 : 0.2,
        reason: isValidFormat ? undefined : 'Invalid account number format',
      });
    }

    return results;
  }

  private validatePayslip(fields: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate salary amounts
    if (fields.grossPay) {
      const isValidAmount = /^\d+(\.\d{2})?$/.test(String(fields.grossPay));
      results.push({
        field: 'grossPay',
        isValid: isValidAmount,
        confidence: isValidAmount ? 0.8 : 0.2,
        reason: isValidAmount ? undefined : 'Invalid salary amount format',
      });
    }

    return results;
  }

  private validateEmploymentLetter(fields: Record<string, unknown>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Validate start date
    if (fields.startDate) {
      const isValidDate = this.isValidDate(String(fields.startDate));
      results.push({
        field: 'startDate',
        isValid: isValidDate,
        confidence: isValidDate ? 0.8 : 0.2,
        reason: isValidDate ? undefined : 'Invalid start date format',
      });
    }

    return results;
  }

  private isValidDate(dateString: string): boolean {
    const datePatterns = [
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
      /^\d{1,2}-\d{1,2}-\d{2,4}$/,
      /^\d{4}-\d{1,2}-\d{1,2}$/,
    ];

    return datePatterns.some(pattern => pattern.test(dateString));
  }

  /**
   * Calculate risk score based on validation results and analysis
   */
  public calculateRiskScore(
    validationResults: ValidationResult[],
    analysis: DocumentAnalysis
  ): number {
    let riskScore = 0;

    // Factor in validation failures
    const invalidFields = validationResults.filter(r => !r.isValid);
    riskScore += (invalidFields.length / validationResults.length) * 0.4;

    // Factor in authenticity score
    riskScore += (1 - analysis.authenticity) * 0.3;

    // Factor in completeness
    riskScore += (1 - analysis.completeness) * 0.2;

    // Factor in clarity
    riskScore += (1 - analysis.clarity) * 0.1;

    return Math.min(riskScore, 1.0);
  }
}

// Export singleton instance
export const aiClassificationService = AIClassificationService.getInstance();
