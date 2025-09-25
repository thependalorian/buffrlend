/**
 * OCR Service for Document Processing
 * 
 * This service provides Optical Character Recognition (OCR) capabilities
 * for extracting text from uploaded documents like IDs, passports, and bank statements.
 */

import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
  lines: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export interface DocumentType {
  type: 'national_id' | 'passport' | 'drivers_license' | 'bank_statement' | 'payslip' | 'employment_letter' | 'unknown';
  confidence: number;
}

export class OCRService {
  private static instance: OCRService;
  private worker: Tesseract.Worker | null = null;

  private constructor() {}

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Initialize the Tesseract worker
   */
  public async initialize(): Promise<void> {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
    }
  }

  /**
   * Extract text from an image buffer
   */
  public async extractText(imageBuffer: Buffer): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('Failed to initialize OCR worker');
    }

    try {
      const { data } = await this.worker.recognize(imageBuffer);
      return data as unknown as OCRResult;
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from document');
    }
  }

  /**
   * Classify document type based on extracted text
   */
  public classifyDocument(ocrResult: OCRResult): DocumentType {
    const text = ocrResult.text.toLowerCase();
    
    // National ID patterns
    if (text.includes('national id') || text.includes('identity card') || text.includes('namibian id')) {
      return { type: 'national_id', confidence: 0.9 };
    }
    
    // Passport patterns
    if (text.includes('passport') || text.includes('republic of namibia') || text.includes('passport no')) {
      return { type: 'passport', confidence: 0.9 };
    }
    
    // Driver's License patterns
    if (text.includes('driving licence') || text.includes('driver license') || text.includes('drivers license')) {
      return { type: 'drivers_license', confidence: 0.9 };
    }
    
    // Bank Statement patterns
    if (text.includes('bank statement') || text.includes('account statement') || text.includes('transaction history')) {
      return { type: 'bank_statement', confidence: 0.9 };
    }
    
    // Payslip patterns
    if (text.includes('payslip') || text.includes('salary') || text.includes('gross pay') || text.includes('net pay')) {
      return { type: 'payslip', confidence: 0.9 };
    }
    
    // Employment Letter patterns
    if (text.includes('employment') || text.includes('job offer') || text.includes('work contract') || text.includes('appointment letter')) {
      return { type: 'employment_letter', confidence: 0.9 };
    }
    
    return { type: 'unknown', confidence: 0.1 };
  }

  /**
   * Extract key information from different document types
   */
  public extractKeyInformation(ocrResult: OCRResult, documentType: DocumentType): Record<string, unknown> {
    const text = ocrResult.text;
    const extractedInfo: Record<string, unknown> = {};

    switch (documentType.type) {
      case 'national_id':
        extractedInfo.idNumber = this.extractIdNumber(text);
        extractedInfo.fullName = this.extractFullName(text);
        extractedInfo.dateOfBirth = this.extractDateOfBirth(text);
        extractedInfo.placeOfBirth = this.extractPlaceOfBirth(text);
        break;
        
      case 'passport':
        extractedInfo.passportNumber = this.extractPassportNumber(text);
        extractedInfo.fullName = this.extractFullName(text);
        extractedInfo.dateOfBirth = this.extractDateOfBirth(text);
        extractedInfo.nationality = this.extractNationality(text);
        break;
        
      case 'drivers_license':
        extractedInfo.licenseNumber = this.extractLicenseNumber(text);
        extractedInfo.fullName = this.extractFullName(text);
        extractedInfo.dateOfBirth = this.extractDateOfBirth(text);
        extractedInfo.licenseClass = this.extractLicenseClass(text);
        break;
        
      case 'bank_statement':
        extractedInfo.accountNumber = this.extractAccountNumber(text);
        extractedInfo.bankName = this.extractBankName(text);
        extractedInfo.statementPeriod = this.extractStatementPeriod(text);
        break;
        
      case 'payslip':
        extractedInfo.employeeName = this.extractFullName(text);
        extractedInfo.employerName = this.extractEmployerName(text);
        extractedInfo.grossPay = this.extractGrossPay(text);
        extractedInfo.netPay = this.extractNetPay(text);
        break;
        
      case 'employment_letter':
        extractedInfo.employeeName = this.extractFullName(text);
        extractedInfo.employerName = this.extractEmployerName(text);
        extractedInfo.position = this.extractPosition(text);
        extractedInfo.startDate = this.extractStartDate(text);
        break;
    }

    return extractedInfo;
  }

  // Helper methods for extracting specific information
  private extractIdNumber(text: string): string | null {
    const idPattern = /(?:id|identity)\s*(?:number|no)?\s*:?\s*(\d{11,13})/i;
    const match = text.match(idPattern);
    return match ? match[1] : null;
  }

  private extractPassportNumber(text: string): string | null {
    const passportPattern = /passport\s*(?:number|no)?\s*:?\s*([A-Z0-9]{6,9})/i;
    const match = text.match(passportPattern);
    return match ? match[1] : null;
  }

  private extractLicenseNumber(text: string): string | null {
    const licensePattern = /(?:license|licence)\s*(?:number|no)?\s*:?\s*([A-Z0-9]{6,12})/i;
    const match = text.match(licensePattern);
    return match ? match[1] : null;
  }

  private extractFullName(text: string): string | null {
    // Look for common name patterns
    const namePatterns = [
      /(?:name|full name)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
      /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }

  private extractDateOfBirth(text: string): string | null {
    const datePatterns = [
      /(?:date of birth|dob|born)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  private extractPlaceOfBirth(text: string): string | null {
    const placePattern = /(?:place of birth|born in)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = text.match(placePattern);
    return match ? match[1] : null;
  }

  private extractNationality(text: string): string | null {
    const nationalityPattern = /(?:nationality)\s*:?\s*([A-Z][a-z]+)/i;
    const match = text.match(nationalityPattern);
    return match ? match[1] : null;
  }

  private extractLicenseClass(text: string): string | null {
    const classPattern = /(?:class|category)\s*:?\s*([A-Z0-9]+)/i;
    const match = text.match(classPattern);
    return match ? match[1] : null;
  }

  private extractAccountNumber(text: string): string | null {
    const accountPattern = /(?:account|acc)\s*(?:number|no)?\s*:?\s*(\d{8,16})/i;
    const match = text.match(accountPattern);
    return match ? match[1] : null;
  }

  private extractBankName(text: string): string | null {
    const bankPattern = /(?:bank|financial institution)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = text.match(bankPattern);
    return match ? match[1] : null;
  }

  private extractStatementPeriod(text: string): string | null {
    const periodPattern = /(?:statement period|period)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s*to\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const match = text.match(periodPattern);
    return match ? match[1] : null;
  }

  private extractEmployerName(text: string): string | null {
    const employerPattern = /(?:employer|company|organization)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = text.match(employerPattern);
    return match ? match[1] : null;
  }

  private extractGrossPay(text: string): string | null {
    const grossPattern = /(?:gross pay|gross salary|gross)\s*:?\s*N?\$?(\d+(?:\.\d{2})?)/i;
    const match = text.match(grossPattern);
    return match ? match[1] : null;
  }

  private extractNetPay(text: string): string | null {
    const netPattern = /(?:net pay|net salary|net|take home)\s*:?\s*N?\$?(\d+(?:\.\d{2})?)/i;
    const match = text.match(netPattern);
    return match ? match[1] : null;
  }

  private extractPosition(text: string): string | null {
    const positionPattern = /(?:position|title|job title|designation)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = text.match(positionPattern);
    return match ? match[1] : null;
  }

  private extractStartDate(text: string): string | null {
    const startPattern = /(?:start date|commencing|effective date)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const match = text.match(startPattern);
    return match ? match[1] : null;
  }

  /**
   * Clean up resources
   */
  public async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

// Export singleton instance
export const ocrService = OCRService.getInstance();

