'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { LoanService } from '@/lib/services/loan-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select } from '@/components/ui/select';
import { CheckCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Validation schemas
const loanDetailsSchema = z.object({
  amount: z.number().min(500, 'Minimum loan amount is N$500').max(10000, 'Maximum loan amount is N$10,000'),
  term_months: z.number().min(1, 'Minimum term is 1 month').max(5, 'Maximum term is 5 months'),
  purpose: z.string().min(1, 'Please select a loan purpose'),
});

const employmentInfoSchema = z.object({
  employer_name: z.string().min(1, 'Employer name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  monthly_salary: z.number().min(1000, 'Minimum salary is N$1,000'),
  employment_start_date: z.string().min(1, 'Employment start date is required'),
  employment_type: z.literal('permanent'),
  partner_company_id: z.string().min(1, 'Partner company is required'),
});

const documentSchema = z.object({
  id_document: z.boolean().refine(val => val, 'ID document is required'),
  payslip: z.boolean().refine(val => val, 'Latest payslip is required'),
  bank_statement: z.boolean().refine(val => val, 'Bank statement is required'),
});

type LoanApplicationData = {
  loan_details: z.infer<typeof loanDetailsSchema>;
  employment_info: z.infer<typeof employmentInfoSchema>;
  documents: z.infer<typeof documentSchema>;
};

const LOAN_PURPOSES = [
  'Emergency expenses',
  'Medical bills',
  'Education',
  'Home improvement',
  'Vehicle maintenance',
  'Business investment',
  'Other'
];

// Partner companies will be fetched from Supabase

export default function LoanApplicationPage() {
  const router = useRouter();
  const { user, isRole } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerCompanies, setPartnerCompanies] = useState<Array<{id: string, name: string}>>([]);
  const [formData, setFormData] = useState<LoanApplicationData>({
    loan_details: {
      amount: 0,
      term_months: 1,
      purpose: '',
    },
    employment_info: {
      employer_name: '',
      job_title: '',
      monthly_salary: 0,
      employment_start_date: '',
      employment_type: 'permanent',
      partner_company_id: '',
    },
    documents: {
      id_document: false,
      payslip: false,
      bank_statement: false,
    },
  });

  // Redirect if not a user and fetch partner companies
  useEffect(() => {
    if (user && !isRole('user')) {
      router.push('/dashboard');
    } else if (user) {
      fetchPartnerCompanies();
    }
  }, [user, isRole, router]);

  const fetchPartnerCompanies = async () => {
    try {
      const companies = await LoanService.getPartnerCompanies();
      setPartnerCompanies(companies.map(company => ({
        id: company.id,
        name: company.company_name
      })));
    } catch (err) {
      console.error('Error fetching partner companies:', err);
      setError('Failed to load partner companies');
    }
  };

  const steps = [
    { number: 1, title: 'Loan Details', description: 'Amount, term, and purpose' },
    { number: 2, title: 'Employment Info', description: 'Work and salary details' },
    { number: 3, title: 'Documents', description: 'Required documentation' },
    { number: 4, title: 'Review', description: 'Confirm and submit' },
  ];

  const handleInputChange = (step: keyof LoanApplicationData, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value,
      },
    }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    try {
      switch (step) {
        case 1:
          loanDetailsSchema.parse(formData.loan_details);
          return true;
        case 2:
          employmentInfoSchema.parse(formData.employment_info);
          return true;
        case 3:
          documentSchema.parse(formData.documents);
          return true;
        default:
          return true;
      }
    } catch (err: unknown) {
      if (isZodError(err)) {
        // @ts-expect-error: ZodError.errors is not recognized by compiler despite instanceof check
        setError(err.errors[0].message);
        return false;
      }
      return false;
    }
  };

  function isZodError(err: unknown): err is z.ZodError {
    return err instanceof z.ZodError;
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Create loan application
      const applicationData = {
        user_id: user.id,
        application_id: uuidv4(),
        company_id: formData.employment_info.partner_company_id,
        employee_verification_id: uuidv4(), // Placeholder for now
        loan_amount: formData.loan_details.amount,
        partner_company_id: formData.employment_info.partner_company_id,
        amount: formData.loan_details.amount,
        term_months: formData.loan_details.term_months,
        purpose: formData.loan_details.purpose,
        employer_name: formData.employment_info.employer_name,
        job_title: formData.employment_info.job_title,
        monthly_salary: formData.employment_info.monthly_salary,
        employment_start_date: formData.employment_info.employment_start_date,
        employment_type: formData.employment_info.employment_type,
        status: 'pending' as const,
      };

      await LoanService.createLoanApplication(applicationData);
      
      // Redirect to application status page
      router.push('/loan-history');
    } catch (err) {
      console.error('Loan application error:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const { amount, term_months } = formData.loan_details;
    if (amount === 0 || term_months === 0) return 0;
    
    // Simple calculation - in real implementation, this would use proper interest rates
    const interestRate = 0.025; // 2.5% monthly
    const monthlyPayment = (amount * (1 + interestRate * term_months)) / term_months;
    return Math.round(monthlyPayment);
  };

  const isEligible = () => {
    const { monthly_salary } = formData.employment_info;
    const monthlyPayment = calculateMonthlyPayment();
    return monthlyPayment <= monthly_salary * 0.33; // 1/3 salary rule
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
          <p className="text-gray-600">Complete your application in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle size={20} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Loan Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Loan Amount (N$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="500"
                    max="10000"
                    value={formData.loan_details.amount || ''}
                    onChange={(e) => handleInputChange('loan_details', 'amount', Number(e.target.value))}
                    placeholder="Enter amount between N$500 - N$10,000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="term">Loan Term (Months)</Label>
                  <Select
                    value={formData.loan_details.term_months.toString()}
                    onChange={(e) => handleInputChange('loan_details', 'term_months', Number(e.target.value))}
                    options={[
                      { value: '1', label: '1 month' },
                      { value: '2', label: '2 months' },
                      { value: '3', label: '3 months' },
                      { value: '4', label: '4 months' },
                      { value: '5', label: '5 months' },
                    ]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="purpose">Loan Purpose</Label>
                  <Select
                    value={formData.loan_details.purpose}
                    onChange={(e) => handleInputChange('loan_details', 'purpose', e.target.value)}
                    options={LOAN_PURPOSES.map(purpose => ({ value: purpose, label: purpose }))}
                  />
                </div>

                {/* Loan Calculator */}
                {formData.loan_details.amount > 0 && formData.loan_details.term_months > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Loan Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Monthly Payment:</span>
                        <span className="font-semibold ml-2">N${calculateMonthlyPayment().toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Total Amount:</span>
                        <span className="font-semibold ml-2">N${(calculateMonthlyPayment() * formData.loan_details.term_months).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Employment Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="partner_company">Partner Company *</Label>
                  <Select
                    value={formData.employment_info.partner_company_id}
                    onChange={(e) => handleInputChange('employment_info', 'partner_company_id', e.target.value)}
                    options={partnerCompanies.map(company => ({ value: company.id, label: company.name }))}
                  />
                </div>

                <div>
                  <Label htmlFor="employer_name">Employer Name</Label>
                  <Input
                    id="employer_name"
                    value={formData.employment_info.employer_name}
                    onChange={(e) => handleInputChange('employment_info', 'employer_name', e.target.value)}
                    placeholder="Enter your employer's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    value={formData.employment_info.job_title}
                    onChange={(e) => handleInputChange('employment_info', 'job_title', e.target.value)}
                    placeholder="Enter your job title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="monthly_salary">Monthly Salary (N$)</Label>
                  <Input
                    id="monthly_salary"
                    type="number"
                    min="1000"
                    value={formData.employment_info.monthly_salary || ''}
                    onChange={(e) => handleInputChange('employment_info', 'monthly_salary', Number(e.target.value))}
                    placeholder="Enter your monthly salary"
                  />
                </div>
                
                <div>
                  <Label htmlFor="employment_start_date">Employment Start Date</Label>
                  <Input
                    id="employment_start_date"
                    type="date"
                    value={formData.employment_info.employment_start_date}
                    onChange={(e) => handleInputChange('employment_info', 'employment_start_date', e.target.value)}
                  />
                </div>

                {/* Eligibility Check */}
                {formData.employment_info.monthly_salary > 0 && formData.loan_details.amount > 0 && (
                  <div className={`p-4 rounded-lg ${
                    isEligible() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      isEligible() ? 'text-green-900' : 'text-red-900'
                    }`}>
                      Eligibility Check
                    </h3>
                    <p className={`text-sm ${
                      isEligible() ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isEligible() 
                        ? '✓ You are eligible for this loan amount based on your salary.'
                        : '⚠ Monthly payment exceeds 1/3 of your salary. Please reduce loan amount.'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Please confirm that you have the following documents ready for upload:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="id_document"
                      checked={formData.documents.id_document}
                      onChange={(e) => handleInputChange('documents', 'id_document', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="id_document" className="text-sm">
                      Valid Namibian ID Document or Passport
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="payslip"
                      checked={formData.documents.payslip}
                      onChange={(e) => handleInputChange('documents', 'payslip', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="payslip" className="text-sm">
                      Latest Payslip (last 3 months)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="bank_statement"
                      checked={formData.documents.bank_statement}
                      onChange={(e) => handleInputChange('documents', 'bank_statement', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="bank_statement" className="text-sm">
                      Bank Statement (last 3 months)
                    </Label>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Note:</strong> You will be redirected to the document upload page after submitting this application. 
                    All documents will be processed using our AI-powered verification system.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Loan Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold ml-2">N${formData.loan_details.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Term:</span>
                      <span className="font-semibold ml-2">{formData.loan_details.term_months} month{formData.loan_details.term_months > 1 ? 's' : ''}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-semibold ml-2">{formData.loan_details.purpose}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="font-semibold ml-2">N${calculateMonthlyPayment().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
          
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Employment Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Employer:</span>
                      <span className="font-semibold ml-2">N${formData.employment_info.employer_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Job Title:</span>
                      <span className="font-semibold ml-2">N${formData.employment_info.job_title}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Monthly Salary:</span>
                      <span className="font-semibold ml-2">N${formData.employment_info.monthly_salary.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-semibold ml-2">N${formData.employment_info.employment_start_date}</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    By submitting this application, you agree to our terms and conditions and confirm that all information provided is accurate.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="flex items-center"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isEligible()}
              className="flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
