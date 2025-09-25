'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const supabase = createClient();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!phone) {
      router.push('/auth/login');
    }
  }, [phone, router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !otp) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // Clear stored phone number
      sessionStorage.removeItem('whatsapp_phone');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      if (error instanceof Error) {
        setError(error.message || 'Invalid OTP. Please try again.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phone || resendCooldown > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'whatsapp'
        }
      });

      if (error) throw error;

      setResendCooldown(60); // 60 second cooldown
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to resend OTP. Please try again.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!phone) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Phone
          </CardTitle>
          <CardDescription className="text-gray-600">
            We sent a verification code to your WhatsApp
          </CardDescription>
          <div className="text-sm text-gray-500 mt-2">
            {phone}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="w-full text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>
          </form>
          
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={isLoading || resendCooldown > 0}
                className="text-sm text-green-600 hover:text-green-800 hover:underline disabled:text-gray-400"
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend verification code'
                }
              </button>
            </div>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
