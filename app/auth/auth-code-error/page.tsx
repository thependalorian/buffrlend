import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert variant="error">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                The authentication process encountered an error. This could be due to:
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                  <li>Invalid or expired authentication code</li>
                  <li>Network connectivity issues</li>
                  <li>OAuth provider configuration problems</li>
                </ul>
              </div>
            </div>
          </Alert>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Try Again
              </Link>
            </Button>
            
            <Button className="w-full" variant="outline" asChild>
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
