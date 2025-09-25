# Authentication Setup Guide

This document outlines the complete authentication system implementation for BuffrLend.

## ✅ Implemented Features

### 1. Supabase Authentication
- ✅ Email/password authentication
- ✅ User profile management
- ✅ Session management
- ✅ Route protection middleware
- ✅ Password reset functionality

### 2. OAuth Providers
- ✅ Google OAuth integration
- ✅ WhatsApp phone number verification
- ✅ OAuth callback handling
- ✅ Error handling for failed authentications

### 3. Security Features
- ✅ Row Level Security (RLS) policies
- ✅ JWT token management
- ✅ Secure cookie handling
- ✅ CSRF protection
- ✅ Rate limiting ready

## 🔧 Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# WhatsApp Business API (optional)
WHATSAPP_BUSINESS_ACCOUNT_ID=your_whatsapp_business_account_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Setup Instructions

### 1. Supabase Setup
1. Create a new Supabase project
2. Run the database schema from `lib/supabase/schema.sql`
3. Enable Google OAuth in Authentication > Providers
4. Configure OAuth redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to environment variables

### 3. WhatsApp Integration (Optional)
1. Set up WhatsApp Business API account
2. Get Business Account ID, Access Token, and Phone Number ID
3. Configure webhook endpoints for OTP delivery
4. Add credentials to environment variables

## 📁 File Structure

```
app/auth/
├── login/page.tsx              # Main login page
├── signup/page.tsx             # User registration
├── callback/route.ts           # OAuth callback handler
├── verify-otp/page.tsx         # WhatsApp OTP verification
├── auth-code-error/page.tsx    # OAuth error handling
├── forgot-password/page.tsx    # Password reset
└── update-password/page.tsx    # Password update

lib/
├── contexts/auth-context.tsx   # Authentication context
├── supabase/
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   ├── middleware.ts          # Route protection
│   └── schema.sql             # Database schema
└── types/auth.ts              # TypeScript types
```

## 🔐 Authentication Flow

### Email/Password Login
1. User enters credentials
2. Supabase validates and creates session
3. User profile is fetched and stored in context
4. Redirect to dashboard

### Google OAuth
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back to `/auth/callback`
4. Supabase exchanges code for session
5. User profile created/updated
6. Redirect to dashboard

### WhatsApp Authentication
1. User clicks "Sign in with WhatsApp"
2. Phone number input prompt
3. OTP sent via WhatsApp Business API
4. User enters OTP on verification page
5. Supabase verifies OTP and creates session
6. Redirect to dashboard

## 🛡️ Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Admin users have elevated permissions
- All tables have proper RLS policies

### Middleware Protection
- Automatic route protection
- Redirects unauthenticated users to login
- Handles session refresh

### Error Handling
- Comprehensive error messages
- OAuth error recovery
- Network failure handling

## 🧪 Testing

### Manual Testing
1. Test email/password login
2. Test Google OAuth flow
3. Test WhatsApp phone verification
4. Test password reset
5. Test route protection
6. Test session persistence

### Environment Testing
- Development: `http://localhost:3000`
- Production: Configure proper domain
- Test OAuth redirects work correctly

## 🚨 Troubleshooting

### Common Issues
1. **OAuth redirect errors**: Check redirect URLs in provider settings
2. **Session not persisting**: Verify cookie settings and domain
3. **RLS policy errors**: Check user permissions and policies
4. **WhatsApp OTP not sending**: Verify Business API credentials

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📝 Next Steps

1. Set up production environment variables
2. Configure proper domain for OAuth redirects
3. Test all authentication flows
4. Set up monitoring and logging
5. Implement additional security measures (2FA, etc.)

## 🔗 Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
