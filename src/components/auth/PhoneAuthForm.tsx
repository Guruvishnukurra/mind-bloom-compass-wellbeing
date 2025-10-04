import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Phone, ArrowLeft, RefreshCw } from 'lucide-react';

type AuthStep = 'phone' | 'otp';

export function PhoneAuthForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<AuthStep>('phone');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { sendOTP, verifyOTP } = useAuth();

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const [, area, exchange, number] = match;
      if (number) return `(${area}) ${exchange}-${number}`;
      if (exchange) return `(${area}) ${exchange}`;
      if (area) return `(${area}`;
    }
    return cleaned;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean phone number for processing
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        toast.error('Please enter a valid phone number');
        return;
      }

      const result = await sendOTP(phoneNumber);
      if (result.success) {
        setOtpSent(true);
        setStep('otp');
        setResendCooldown(60); // 60 second cooldown
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP(phoneNumber, otp);
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      const result = await sendOTP(phoneNumber);
      if (result.success) {
        setResendCooldown(60);
        toast.success('OTP sent again');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setOtpSent(false);
    setResendCooldown(0);
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex flex-col items-center mb-4">
            <img src="/mindbloom-logo.svg" alt="MindBloom Logo" className="w-16 h-16 mb-2" />
            <h1 className="text-2xl font-heading font-semibold text-foreground">MindBloom</h1>
          </div>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {step === 'phone' ? 'Sign In with Phone' : 'Verify Your Phone'}
          </CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your phone number to receive a verification code'
              : `We sent a 6-digit code to ${phoneNumber}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  required
                  className="text-center"
                />
                <p className="text-xs text-muted-foreground text-center">
                  We'll send you a verification code via SMS
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-center block">Enter Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive the code? Check your SMS messages
                </p>
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBackToPhone}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Number
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleResendOTP}
                    disabled={isLoading || resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? (
                      `Resend in ${resendCooldown}s`
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
