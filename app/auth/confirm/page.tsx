'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'signup') {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) throw error;

        setStatus('success');
        setMessage('Email confirmed successfully! You can now sign in.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('Failed to confirm email. The link may be expired or invalid.');
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            {status === 'loading' && <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-green-600" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to login in 3 seconds...
              </p>
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-3">
              <Button
                onClick={() => router.push('/auth/signup')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Signing Up Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Please wait while we confirm your email address...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
