// OTP Service for SMS verification
// This service can be configured to work with various SMS providers

interface OTPServiceConfig {
  provider: 'twilio' | 'aws-sns' | 'firebase' | 'mock';
  apiKey?: string;
  apiSecret?: string;
  fromNumber?: string;
  serviceId?: string;
}

class OTPService {
  private config: OTPServiceConfig;
  private otpStorage: Map<string, { code: string; expiresAt: number }> = new Map();

  constructor(config: OTPServiceConfig) {
    this.config = config;
  }

  // Generate a 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP with expiration (5 minutes)
  private storeOTP(phoneNumber: string, code: string): void {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.otpStorage.set(phoneNumber, { code, expiresAt });
  }

  // Verify OTP
  verifyOTP(phoneNumber: string, code: string): boolean {
    const stored = this.otpStorage.get(phoneNumber);
    if (!stored) return false;
    
    if (Date.now() > stored.expiresAt) {
      this.otpStorage.delete(phoneNumber);
      return false;
    }
    
    return stored.code === code;
  }

  // Send OTP via SMS
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const code = this.generateOTP();
      this.storeOTP(phoneNumber, code);

      switch (this.config.provider) {
        case 'mock':
          // For development/testing - just log the OTP
          console.log(`[MOCK SMS] OTP for ${phoneNumber}: ${code}`);
          return {
            success: true,
            message: 'OTP sent successfully (check console for development)'
          };

        case 'twilio':
          return await this.sendViaTwilio(phoneNumber, code);

        case 'aws-sns':
          return await this.sendViaAWSSNS(phoneNumber, code);

        case 'firebase':
          return await this.sendViaFirebase(phoneNumber, code);

        default:
          throw new Error('Unsupported SMS provider');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  private async sendViaTwilio(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    // Twilio implementation
    const accountSid = this.config.apiKey;
    const authToken = this.config.apiSecret;
    const fromNumber = this.config.fromNumber;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: fromNumber,
        Body: `Your MindBloom verification code is: ${code}. This code expires in 5 minutes.`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS via Twilio');
    }

    return {
      success: true,
      message: 'OTP sent successfully'
    };
  }

  private async sendViaAWSSNS(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    // AWS SNS implementation would go here
    // This is a placeholder - actual implementation would require AWS SDK
    throw new Error('AWS SNS implementation not yet available');
  }

  private async sendViaFirebase(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    // Firebase Auth implementation would go here
    // This is a placeholder - actual implementation would require Firebase SDK
    throw new Error('Firebase SMS implementation not yet available');
  }

  // Clean up expired OTPs
  cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [phoneNumber, data] of this.otpStorage.entries()) {
      if (now > data.expiresAt) {
        this.otpStorage.delete(phoneNumber);
      }
    }
  }
}

// Create singleton instance
const otpService = new OTPService({
  provider: (import.meta.env.VITE_SMS_PROVIDER as any) || 'mock',
  apiKey: import.meta.env.VITE_SMS_API_KEY,
  apiSecret: import.meta.env.VITE_SMS_API_SECRET,
  fromNumber: import.meta.env.VITE_SMS_FROM_NUMBER,
  serviceId: import.meta.env.VITE_SMS_SERVICE_ID,
});

export default otpService;

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  otpService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);
