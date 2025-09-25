'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignUpCredentials } from '@/lib/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GoogleSignupButton } from '@/components/auth/google-signup-button';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpCredentials>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    company_name: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState({
    termsAccepted: false,
    marketingConsent: false
  });
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('consent.')) {
      const consentField = name.split('.')[1];
      setConsent(prev => ({
        ...prev,
        [consentField]: type === 'checkbox' ? checked : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateStep1 = () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!consent.termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    // Password confirmation validation removed since confirmPassword is not in SignUpCredentials
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            company_name: formData.company_name,
            phone: formData.phone,
            role: 'user',
            terms_accepted: consent.termsAccepted,
            marketing_consent: consent.marketingConsent,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) throw error;
      
      // Redirect to success page or KYC verification
      router.push('/auth/signup-success');
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900" data-testid="signup-title">
            Create Your BuffrLend Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Join thousands of users who trust BuffrLend for their financial needs
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <CheckCircle size={20} /> : '1'}
              </div>
              <div className={`w-16 h-1 ${
                currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 2 ? <CheckCircle size={20} /> : '2'}
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="termsAccepted"
                      name="consent.termsAccepted"
                      type="checkbox"
                      checked={consent.termsAccepted}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="termsAccepted" className="text-sm text-gray-600">
                      I accept the{' '}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      id="marketingConsent"
                      name="consent.marketingConsent"
                      type="checkbox"
                      checked={consent.marketingConsent}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="marketingConsent" className="text-sm text-gray-600">
                      I agree to receive marketing communications (optional)
                    </Label>
                  </div>
                </div>
                
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue to Step 2
                </Button>
              </div>
            )}

            {/* Step 2: Security & Verification */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+264 61 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name (Optional)</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                {/* Confirm password field removed since it's not in SignUpCredentials interface */}
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
          
          {/* Google Sign-up Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <GoogleSignupButton
                onSuccess={() => {
                  // Redirect to dashboard on successful Google sign-up
                  router.push('/dashboard');
                }}
                onError={(error) => {
                  setError(error);
                }}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
