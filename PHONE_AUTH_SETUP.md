# Phone Number Authentication Setup

This document explains how to set up phone number and OTP-based authentication for the MindBloom Compass app.

## Overview

The app now supports phone number authentication with OTP (One-Time Password) verification instead of the traditional email/password system. This provides a simpler and more user-friendly authentication experience.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Supabase Configuration (existing)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# SMS Service Configuration
# Choose one of: mock, twilio, aws-sns, firebase
VITE_SMS_PROVIDER=mock

# Twilio Configuration (if using Twilio)
VITE_SMS_API_KEY=your_twilio_account_sid
VITE_SMS_API_SECRET=your_twilio_auth_token
VITE_SMS_FROM_NUMBER=+1234567890

# AWS SNS Configuration (if using AWS SNS)
# VITE_SMS_API_KEY=your_aws_access_key_id
# VITE_SMS_API_SECRET=your_aws_secret_access_key
# VITE_SMS_SERVICE_ID=your_sns_topic_arn

# Firebase Configuration (if using Firebase)
# VITE_SMS_SERVICE_ID=your_firebase_project_id
```

## SMS Provider Options

### 1. Mock Provider (Development)
- **Provider**: `mock`
- **Use case**: Development and testing
- **Setup**: No additional configuration needed
- **Behavior**: OTP codes are logged to the console instead of being sent via SMS

### 2. Twilio (Recommended for Production)
- **Provider**: `twilio`
- **Setup**: 
  1. Create a Twilio account
  2. Get your Account SID and Auth Token
  3. Purchase a phone number
  4. Set the environment variables

### 3. AWS SNS
- **Provider**: `aws-sns`
- **Setup**: 
  1. Set up AWS SNS
  2. Configure IAM permissions
  3. Set the environment variables

### 4. Firebase
- **Provider**: `firebase`
- **Setup**: 
  1. Set up Firebase project
  2. Enable Authentication
  3. Configure phone authentication
  4. Set the environment variables

## Database Setup

Run the following migration to add phone number support:

```sql
-- This migration is already created in supabase/migrations/20241201000000_create_profiles_table.sql
-- It will be automatically applied when you run your Supabase migrations
```

## How It Works

1. **User enters phone number**: The user enters their Indian mobile number in the format 9876-543-210 or +91-9876-543-210
2. **OTP is sent**: The system sends a 6-digit OTP to the provided phone number
3. **User verifies OTP**: The user enters the 6-digit code they received
4. **Account creation/sign-in**: 
   - If it's a new phone number, a new account is created
   - If it's an existing phone number, the user is signed in

## Indian Phone Number Support

The system is specifically configured for Indian phone numbers:
- **10-digit format**: 9876-543-210 (automatically adds +91 country code)
- **12-digit format**: +91-9876-543-210 (with country code)
- **Validation**: Ensures proper Indian mobile number format
- **SMS delivery**: Optimized for Indian mobile networks

## Features

- **Phone number formatting**: Automatic formatting as the user types
- **OTP validation**: 6-digit code with 5-minute expiration
- **Resend functionality**: Users can request a new OTP after 60 seconds
- **Error handling**: Clear error messages for invalid numbers or expired codes
- **Responsive design**: Works on both desktop and mobile devices

## Security Considerations

- OTPs expire after 5 minutes
- Rate limiting is implemented to prevent spam
- Phone numbers are validated before sending OTPs
- All OTPs are stored securely and cleaned up after expiration

## Testing

For development and testing, use the `mock` provider. OTP codes will be displayed in the browser console, making it easy to test the authentication flow without sending actual SMS messages.

## Migration from Email Authentication

The app maintains backward compatibility with email/password authentication. Users with existing email accounts can still sign in using their email and password. New users will use the phone number authentication by default.

## Troubleshooting

### Common Issues

1. **OTP not received**: Check your SMS provider configuration
2. **Invalid phone number**: Ensure the phone number is in the correct format
3. **OTP expired**: Request a new OTP using the resend button
4. **Database errors**: Ensure the profiles table migration has been applied

### Debug Mode

Set `VITE_SMS_PROVIDER=mock` to see OTP codes in the console for debugging.
