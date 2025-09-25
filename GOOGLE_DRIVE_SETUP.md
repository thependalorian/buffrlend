# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for the BuffrLend platform to store KYC documents and loan agreements.

## Prerequisites

1. Google Cloud Console account
2. Google Drive API enabled
3. Service account or OAuth2 credentials

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

### 1.2 Enable Google Drive API
1. Navigate to "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### 1.3 Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `buffrlend-kyc`
   - Description: `Service account for BuffrLend KYC document storage`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 1.4 Generate Service Account Key
1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file and keep it secure

## Step 2: Google Drive Folder Structure

Create the following folder structure in your Google Drive:

```
BuffrLend Documents/
├── KYC_Documents/
│   ├── National_IDs/
│   ├── Passports/
│   ├── Drivers_Licenses/
│   ├── Payslips/
│   ├── Bank_Statements/
│   └── Employment_Letters/
├── Loan_Agreements/
├── Verified/
├── Pending_Review/
└── Rejected/
```

### 2.1 Get Folder IDs
1. Open each folder in Google Drive
2. Copy the folder ID from the URL (the long string after `/folders/`)
3. Note down each folder ID

## Step 3: Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google Drive Configuration
GOOGLE_DRIVE_CLIENT_ID=your_google_drive_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_google_drive_client_secret
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Service Account Credentials (JSON format)
GOOGLE_DRIVE_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project-id","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n","client_email":"buffrlend-kyc@your-project.iam.gserviceaccount.com","client_id":"client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/buffrlend-kyc%40your-project.iam.gserviceaccount.com"}

# Google Drive Folder IDs
GOOGLE_DRIVE_KYC_FOLDER_ID=your_kyc_folder_id
GOOGLE_DRIVE_LOAN_AGREEMENTS_FOLDER_ID=your_loan_agreements_folder_id
GOOGLE_DRIVE_NATIONAL_IDS_FOLDER_ID=your_national_ids_folder_id
GOOGLE_DRIVE_PASSPORTS_FOLDER_ID=your_passports_folder_id
GOOGLE_DRIVE_DRIVERS_LICENSES_FOLDER_ID=your_drivers_licenses_folder_id
GOOGLE_DRIVE_PAYSLIPS_FOLDER_ID=your_payslips_folder_id
GOOGLE_DRIVE_BANK_STATEMENTS_FOLDER_ID=your_bank_statements_folder_id
GOOGLE_DRIVE_EMPLOYMENT_LETTERS_FOLDER_ID=your_employment_letters_folder_id
GOOGLE_DRIVE_VERIFIED_FOLDER_ID=your_verified_folder_id
GOOGLE_DRIVE_PENDING_REVIEW_FOLDER_ID=your_pending_review_folder_id
GOOGLE_DRIVE_REJECTED_FOLDER_ID=your_rejected_folder_id
```

## Step 4: Database Schema

Add the following table to your Supabase database:

```sql
-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  google_drive_file_id TEXT UNIQUE NOT NULL,
  google_drive_url TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'national_id', 'passport', 'drivers_license', 
    'payslip', 'bank_statement', 'employment_letter', 
    'loan_agreement', 'other'
  )),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activities table
CREATE TABLE admin_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all documents" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view admin activities" ON admin_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert admin activities" ON admin_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## Step 5: Service Account Permissions

### 5.1 Share Folders with Service Account
1. Open each Google Drive folder
2. Click "Share" button
3. Add the service account email: `buffrlend-kyc@your-project.iam.gserviceaccount.com`
4. Give "Editor" permissions
5. Click "Send"

### 5.2 Domain-wide Delegation (Optional)
If you need to access files on behalf of users:
1. Go to the service account in Google Cloud Console
2. Check "Enable Google Workspace Domain-wide Delegation"
3. Add the service account to your Google Workspace domain

## Step 6: Testing the Integration

### 6.1 Test Document Upload
1. Start your development server
2. Navigate to the document upload page
3. Upload a test document
4. Check if it appears in the correct Google Drive folder

### 6.2 Test Document Verification
1. Login as an admin
2. Go to the document verification page
3. Verify or reject a document
4. Check if it moves to the correct folder in Google Drive

## Step 7: Production Deployment

### 7.1 Update Environment Variables
Update the environment variables in your production environment:
- Change `GOOGLE_DRIVE_REDIRECT_URI` to your production domain
- Update `NEXT_PUBLIC_SITE_URL` to your production URL

### 7.2 Security Considerations
1. Keep service account credentials secure
2. Use environment variables for all sensitive data
3. Enable audit logging in Google Cloud Console
4. Regularly rotate service account keys
5. Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check if Google Drive API is enabled
   - Verify service account credentials
   - Ensure service account has access to folders

2. **Folder Not Found**
   - Verify folder IDs are correct
   - Check if service account has access to folders
   - Ensure folders exist in Google Drive

3. **Upload Failed**
   - Check file size limits
   - Verify file type is supported
   - Check network connectivity

4. **Permission Denied**
   - Verify RLS policies in Supabase
   - Check user authentication
   - Ensure admin role is properly set

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
LOG_LEVEL=debug
```

## Support

For issues with Google Drive integration:
1. Check Google Cloud Console logs
2. Review Supabase logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

## Cost Considerations

- Google Drive API has usage limits
- Monitor API usage in Google Cloud Console
- Consider implementing rate limiting
- Set up billing alerts for unexpected costs
