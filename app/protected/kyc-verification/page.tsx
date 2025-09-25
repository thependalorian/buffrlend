'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Loader2,
  Eye,
  Download
} from 'lucide-react';

interface Document {
  id: string;
  type: 'id_document' | 'payslip' | 'bank_statement' | 'employment_letter';
  name: string;
  status: 'pending' | 'uploaded' | 'processing' | 'verified' | 'rejected';
  uploaded_at?: string;
  file_size?: number;
  ai_confidence?: number;
  rejection_reason?: string;
}

interface KYCStatus {
  overall_status: 'incomplete' | 'pending' | 'verified' | 'rejected';
  completion_percentage: number;
  documents: Document[];
  verification_date?: string;
  next_steps: string[];
}

const REQUIRED_DOCUMENTS = [
  {
    type: 'id_document' as const,
    name: 'Namibian ID Document or Passport',
    description: 'Valid government-issued identification document',
    accepted_formats: ['PDF', 'JPG', 'PNG'],
    max_size: '10MB',
  },
  {
    type: 'payslip' as const,
    name: 'Latest Payslip',
    description: 'Most recent payslip from your employer (last 3 months)',
    accepted_formats: ['PDF', 'JPG', 'PNG'],
    max_size: '5MB',
  },
  {
    type: 'bank_statement' as const,
    name: 'Bank Statement',
    description: 'Bank statement showing salary deposits (last 3 months)',
    accepted_formats: ['PDF', 'JPG', 'PNG'],
    max_size: '10MB',
  },
  {
    type: 'employment_letter' as const,
    name: 'Employment Letter',
    description: 'Official letter from your employer confirming employment',
    accepted_formats: ['PDF', 'JPG', 'PNG'],
    max_size: '5MB',
  },
];

export default function KYCVerificationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchKYCStatus();
    }
  }, [user, authLoading]);

  const fetchKYCStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - in real implementation, this would come from the backend
      const mockKYCStatus: KYCStatus = {
        overall_status: 'pending',
        completion_percentage: 50,
        documents: [
          {
            id: '1',
            type: 'id_document',
            name: 'Namibian_ID_2024.pdf',
            status: 'verified',
            uploaded_at: '2025-01-15T10:30:00Z',
            file_size: 2048576,
            ai_confidence: 95,
          },
          {
            id: '2',
            type: 'payslip',
            name: 'Payslip_January_2025.pdf',
            status: 'processing',
            uploaded_at: '2025-01-20T14:15:00Z',
            file_size: 1024768,
            ai_confidence: 78,
          },
          {
            id: '3',
            type: 'bank_statement',
            name: 'Bank_Statement_Dec_2024.pdf',
            status: 'rejected',
            uploaded_at: '2025-01-18T09:45:00Z',
            file_size: 5123456,
            ai_confidence: 45,
            rejection_reason: 'Document quality is too low. Please upload a clearer image.',
          },
          {
            id: '4',
            type: 'employment_letter',
            name: '',
            status: 'pending',
          },
        ],
        next_steps: [
          'Upload a clearer bank statement',
          'Upload employment letter from your employer',
          'Wait for AI verification of all documents',
        ],
      };

      setKycStatus(mockKYCStatus);
    } catch (err) {
      setError('Failed to load KYC status');
      console.error('KYC error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (documentType: Document['type'], file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      // TODO: Implement actual file upload with AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate AI processing
      const mockConfidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      const mockStatus = mockConfidence > 80 ? 'verified' : mockConfidence > 60 ? 'processing' : 'rejected';

      // Update the document status
      if (kycStatus) {
        const updatedDocuments = kycStatus.documents.map(doc => {
          if (doc.type === documentType) {
            return {
              ...doc,
              name: file.name,
              status: mockStatus,
              uploaded_at: new Date().toISOString(),
              file_size: file.size,
              ai_confidence: mockConfidence,
              rejection_reason: mockStatus === 'rejected' ? 'Document quality needs improvement' : undefined,
            } as Document;
          }
          return doc;
        });

        const completedDocs = updatedDocuments.filter(doc => doc.status === 'verified').length;
        const newCompletionPercentage = Math.round((completedDocs / REQUIRED_DOCUMENTS.length) * 100);
        const newOverallStatus = newCompletionPercentage === 100 ? 'verified' : 
                                completedDocs > 0 ? 'pending' : 'incomplete';

        setKycStatus({
          ...kycStatus,
          overall_status: newOverallStatus,
          completion_percentage: newCompletionPercentage,
          documents: updatedDocuments,
        });
      }

      // Refresh status after a delay to simulate AI processing
      setTimeout(() => {
        fetchKYCStatus();
      }, 3000);

    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'uploaded':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'uploaded':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600">Complete your identity verification to access all features</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Overall Status */}
        {kycStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your KYC verification progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{kycStatus.completion_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${kycStatus.completion_percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    kycStatus.overall_status === 'verified' ? 'text-green-600 bg-green-100' :
                    kycStatus.overall_status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                    kycStatus.overall_status === 'rejected' ? 'text-red-600 bg-red-100' :
                    'text-gray-600 bg-gray-100'
                  }`}>
                    {kycStatus.overall_status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {kycStatus.overall_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {kycStatus.overall_status === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{kycStatus.overall_status}</span>
                  </span>
                  {kycStatus.verification_date && (
                    <span className="text-xs text-gray-500">
                      Verified on {formatDate(kycStatus.verification_date)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {kycStatus && kycStatus.next_steps.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong>
              <ul className="mt-2 list-disc list-inside">
                {kycStatus.next_steps.map((step, index) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Document Upload Section */}
        <div className="space-y-4">
          {REQUIRED_DOCUMENTS.map((docType) => {
            const document = kycStatus?.documents.find(d => d.type === docType.type);
            
            return (
              <Card key={docType.type}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{docType.name}</CardTitle>
                      <CardDescription>{docType.description}</CardDescription>
                    </div>
                    {document && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1 capitalize">{document.status}</span>
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {document && document.status !== 'pending' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-sm">{document.name}</p>
                            <p className="text-xs text-gray-500">
                              {document.file_size && formatFileSize(document.file_size)} • 
                              {document.uploaded_at && ` Uploaded ${formatDate(document.uploaded_at)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {document.ai_confidence && (
                            <span className="text-xs text-gray-500">
                              AI Confidence: {document.ai_confidence}%
                            </span>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {document.status === 'rejected' && document.rejection_reason && (
                        <Alert variant="error">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Rejection Reason:</strong> {document.rejection_reason}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {document.status === 'rejected' && (
                        <div className="pt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload New Document
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(docType.type, file);
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={isUploading}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload your {docType.name.toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Accepted formats: {docType.accepted_formats.join(', ')} • Max size: {docType.max_size}
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(docType.type, file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Processing Info */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Verification</CardTitle>
            <CardDescription>How our verification system works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p>Our AI system automatically analyzes your documents for authenticity and quality</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p>Documents are processed securely and confidentially</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p>Human review is available for complex cases or when AI confidence is low</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p>Verification typically takes 1-24 hours depending on document quality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
          {kycStatus?.overall_status === 'verified' && (
            <Button 
              onClick={() => router.push('/loan-application')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply for Loan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}