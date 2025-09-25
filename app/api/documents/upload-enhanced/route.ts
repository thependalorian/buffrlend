/**
 * Enhanced Document Upload API Route
 * 
 * This route handles document uploads with integrated OCR processing,
 * AI classification, and Google Drive storage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { googleDriveService } from '@/lib/services/google-drive-service';
import { ocrService } from '@/lib/services/ocr-service';
import { aiClassificationService } from '@/lib/services/ai-classification-service';
// import { withAuditLogging } from '@/lib/security/audit-logger';
// import { withRateLimit } from '@/lib/security/rate-limiter';

export interface EnhancedUploadResponse {
  success: boolean;
  documentId: string;
  classification: {
    type: string;
    confidence: number;
    extractedFields: Record<string, unknown>;
    validationResults: Array<{
      field: string;
      isValid: boolean;
      confidence: number;
      reason?: string;
    }>;
    riskScore: number;
    recommendations: string[];
  };
  analysis: {
    authenticity: number;
    completeness: number;
    clarity: number;
    riskFactors: string[];
    complianceIssues: string[];
  };
  googleDriveInfo: {
    fileId: string;
    folderId: string;
    webViewLink: string;
  };
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    // const { data: { user }, error: authError } = await supabase.auth.getUser();
    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    const user = { id: 'test-user' };

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize services
    await googleDriveService.initialize();
    await ocrService.initialize();

    // Step 1: Extract text using OCR
    console.log('Starting OCR processing...');
    const ocrResult = await ocrService.extractText(buffer);
    return NextResponse.json(ocrResult);

    // Step 2: Classify document using AI
    console.log('Starting AI classification...');
    const classification = await aiClassificationService.classifyDocument(
      ocrResult.text,
      {
        width: 0, // Will be extracted from image if needed
        height: 0,
        format: file.type,
        size: file.size,
      }
    );
    console.log('AI classification completed:', { 
      type: classification.type, 
      confidence: classification.confidence 
    });

    // Step 3: Analyze document quality
    console.log('Starting document quality analysis...');
    const analysis = await aiClassificationService.analyzeDocumentQuality(
      ocrResult.text,
      {
        width: 0,
        height: 0,
        format: file.type,
        size: file.size,
      }
    );
    console.log('Document analysis completed:', { 
      authenticity: analysis.authenticity,
      completeness: analysis.completeness 
    });

    // Step 4: Validate extracted information
    const validationResults = aiClassificationService.validateExtractedInformation(
      classification.type,
      classification.extractedFields
    );

    // Step 5: Calculate risk score
    const riskScore = aiClassificationService.calculateRiskScore(
      validationResults,
      analysis
    );

    // Step 6: Upload to Google Drive
    console.log('Uploading to Google Drive...');
    const uploadResult = await googleDriveService.uploadDocument(
      buffer,
      file.name,
      file.type,
      user.id,
      undefined // loanApplicationId - can be added later if needed
    );

    if (!uploadResult.success) {
      throw new Error('Failed to upload document to Google Drive');
    }

    // Step 7: Save to database
    const { data: documentRecord, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        document_type: classification.type,
        google_drive_file_id: uploadResult.file_id,
        google_drive_folder_id: uploadResult.file_id, // Using file_id as folder reference
        status: riskScore > 0.7 ? 'pending_review' : 'verified',
        extracted_data: classification.extractedFields,
        ocr_text: ocrResult.text,
        ocr_confidence: ocrResult.confidence,
        ai_confidence: classification.confidence,
        risk_score: riskScore,
        validation_results: validationResults,
        analysis_results: analysis,
        metadata: {
          originalDocumentType: documentType,
          description: description,
          uploadTimestamp: new Date().toISOString(),
          processingVersion: '1.0',
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save document record');
    }

    // Step 8: Create audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'document_upload_enhanced',
        resource: 'document',
        resource_id: documentRecord.id,
        details: {
          filename: file.name,
          documentType: classification.type,
          riskScore: riskScore,
          extractedFields: Object.keys(classification.extractedFields),
        },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

    // Step 9: Clean up OCR service
    await ocrService.cleanup();

    const response: EnhancedUploadResponse = {
      success: true,
      documentId: documentRecord.id,
      classification: {
        type: classification.type,
        confidence: classification.confidence,
        extractedFields: classification.extractedFields,
        validationResults: validationResults,
        riskScore: riskScore,
        recommendations: classification.recommendations,
      },
      analysis: analysis,
      googleDriveInfo: {
        fileId: uploadResult.file_id || '',
        folderId: uploadResult.file_id || '',
        webViewLink: uploadResult.file_url || '',
      },
      message: 'Document uploaded and processed successfully',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Enhanced upload error:', error);
    
    // Clean up OCR service on error
    try {
      await ocrService.cleanup();
    } catch (cleanupError) {
      console.error('OCR cleanup error:', cleanupError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to process document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Note: Middleware would be applied in middleware.ts or through a wrapper function
// For now, we'll keep the handler simple and add middleware later if needed

