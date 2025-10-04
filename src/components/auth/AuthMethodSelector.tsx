import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneAuthForm } from './PhoneAuthForm';
import { AuthForm } from './AuthForm';
import { Phone, Mail } from 'lucide-react';

type AuthMethod = 'phone' | 'email';

export function AuthMethodSelector() {
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod | null>(null);

  if (selectedMethod === 'phone') {
    return <PhoneAuthForm />;
  }

  if (selectedMethod === 'email') {
    return <AuthForm />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex flex-col items-center mb-4">
            <img src="/mindbloom-logo.svg" alt="MindBloom Logo" className="w-16 h-16 mb-2" />
            <h1 className="text-2xl font-heading font-semibold text-foreground">MindBloom</h1>
          </div>
          <CardTitle>Choose Sign In Method</CardTitle>
          <CardDescription>
            Select how you'd like to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setSelectedMethod('phone')}
            className="w-full h-16 text-left justify-start"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Phone Number</div>
                <div className="text-sm text-muted-foreground">
                  Quick sign in with SMS verification
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setSelectedMethod('email')}
            className="w-full h-16 text-left justify-start"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Email & Password</div>
                <div className="text-sm text-muted-foreground">
                  Traditional email and password sign in
                </div>
              </div>
            </div>
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>New to MindBloom? Both methods will create an account for you.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
