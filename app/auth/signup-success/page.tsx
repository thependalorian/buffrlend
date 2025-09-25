'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function SignupSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Created Successfully!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Welcome to BuffrLend. We&apos;ve sent you a confirmation email.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Check your email
              </p>
              <p className="text-xs text-blue-700">
                Click the confirmation link to activate your account
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Redirecting to login in {countdown} seconds...
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>
              Didn&apos;t receive the email?{' '}
              <Link href="/auth/resend-confirmation" className="text-blue-600 hover:underline">
                Resend confirmation
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
