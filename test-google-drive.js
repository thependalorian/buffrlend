/**
 * Google Drive Connection Test Script
 * Tests the Google Drive API connection and credentials
 */

const { google } = require('googleapis');
require('dotenv').config();

async function testGoogleDriveConnection() {
  try {
    console.log('🔍 Testing Google Drive Connection...');
    console.log('=====================================');
    
    // Check environment variables
    console.log('📋 Environment Variables Check:');
    console.log('GOOGLE_DRIVE_CLIENT_ID:', process.env.GOOGLE_DRIVE_CLIENT_ID ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_DRIVE_CLIENT_SECRET:', process.env.GOOGLE_DRIVE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_DRIVE_REFRESH_TOKEN:', process.env.GOOGLE_DRIVE_REFRESH_TOKEN ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_DRIVE_FOLDER_ID:', process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Missing');
    console.log('');
    
    if (!process.env.GOOGLE_DRIVE_CLIENT_ID || !process.env.GOOGLE_DRIVE_CLIENT_SECRET || !process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
      console.log('❌ Missing required Google Drive credentials');
      console.log('Please ensure all required environment variables are set in your .env file');
      return;
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Test API connection
    console.log('🔗 Testing API connection...');
    const response = await drive.about.get({
      fields: 'user,storageQuota'
    });
    
    console.log('✅ Google Drive Connection Successful!');
    console.log('👤 User:', response.data.user?.displayName);
    console.log('📧 Email:', response.data.user?.emailAddress);
    console.log('📊 Storage Quota:');
    console.log('   - Total:', formatBytes(response.data.storageQuota?.limit));
    console.log('   - Used:', formatBytes(response.data.storageQuota?.usage));
    console.log('   - Available:', formatBytes(response.data.storageQuota?.limit - response.data.storageQuota?.usage));
    console.log('');
    
    // Test folder access if folder ID is provided
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      console.log('📁 Testing folder access...');
      try {
        const folder = await drive.files.get({
          fileId: process.env.GOOGLE_DRIVE_FOLDER_ID,
          fields: 'id,name,mimeType,createdTime,modifiedTime'
        });
        console.log('✅ Folder Access Successful!');
        console.log('📂 Folder Name:', folder.data.name);
        console.log('🆔 Folder ID:', folder.data.id);
        console.log('📅 Created:', folder.data.createdTime);
        console.log('📅 Modified:', folder.data.modifiedTime);
        console.log('');
        
        // List files in the folder
        console.log('📄 Listing files in folder...');
        const files = await drive.files.list({
          q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
          fields: 'files(id,name,mimeType,size,createdTime)',
          pageSize: 5
        });
        
        if (files.data.files && files.data.files.length > 0) {
          console.log(`Found ${files.data.files.length} files:`);
          files.data.files.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file.name} (${formatBytes(file.size || 0)})`);
          });
        } else {
          console.log('   No files found in the folder');
        }
        
      } catch (folderError) {
        console.log('❌ Folder Access Failed:');
        console.log('Error:', folderError.message);
      }
    } else {
      console.log('⚠️  No GOOGLE_DRIVE_FOLDER_ID provided - skipping folder test');
    }
    
    console.log('');
    console.log('🎉 Google Drive integration test completed successfully!');
    
  } catch (error) {
    console.log('❌ Google Drive Connection Failed:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('1. Verify your Google Drive API credentials are correct');
    console.log('2. Ensure the refresh token is valid and not expired');
    console.log('3. Check that the Google Drive API is enabled in your Google Cloud Console');
    console.log('4. Verify the folder ID exists and is accessible');
  }
}

function formatBytes(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the test
testGoogleDriveConnection();
