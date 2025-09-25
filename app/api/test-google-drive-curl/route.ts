/**
 * Test Google Drive Connection with Curl
 * This endpoint will help test the Google Drive API connection
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Google Drive connection with curl...')
    
    // Get credentials from environment
    const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON
    if (!credentialsJson) {
      return NextResponse.json({
        success: false,
        error: 'No Google Drive credentials found',
        curlCommand: 'No credentials available'
      }, { status: 400 })
    }

    let credentials
    try {
      credentials = JSON.parse(credentialsJson)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials JSON format',
        curlCommand: 'Invalid credentials'
      }, { status: 400 })
    }

    if (!credentials.web) {
      return NextResponse.json({
        success: false,
        error: 'Web application credentials not found',
        curlCommand: 'No web credentials'
      }, { status: 400 })
    }

    const { client_id, client_secret, redirect_uris } = credentials.web

    // Generate OAuth2 authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth')
    authUrl.searchParams.set('client_id', client_id)
    authUrl.searchParams.set('redirect_uri', redirect_uris[0])
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/drive.file')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')

    // Example curl commands for testing
    const curlCommands = {
      step1_get_auth_code: `# Step 1: Get authorization code
# Visit this URL in your browser and get the authorization code:
curl -v "${authUrl.toString()}"`,

      step2_exchange_for_token: `# Step 2: Exchange authorization code for access token
# Replace YOUR_AUTH_CODE with the code from step 1
curl -X POST "https://oauth2.googleapis.com/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "client_id=${client_id}" \\
  -d "client_secret=${client_secret}" \\
  -d "code=YOUR_AUTH_CODE" \\
  -d "grant_type=authorization_code" \\
  -d "redirect_uri=${redirect_uris[0]}"`,

      step3_test_drive_api: `# Step 3: Test Google Drive API with access token
# Replace YOUR_ACCESS_TOKEN with the token from step 2
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  "https://www.googleapis.com/drive/v3/files?pageSize=10"`,

      step4_list_folders: `# Step 4: List specific folders
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder'&pageSize=10"`
    }

    return NextResponse.json({
      success: true,
      message: 'Google Drive curl test commands generated',
      credentials: {
        client_id: client_id.substring(0, 20) + '...',
        has_client_secret: !!client_secret,
        redirect_uri: redirect_uris[0]
      },
      authUrl: authUrl.toString(),
      curlCommands,
      instructions: [
        '1. Copy the authUrl and visit it in your browser',
        '2. Authorize the application and copy the authorization code',
        '3. Use the authorization code in step2_exchange_for_token',
        '4. Copy the access_token from the response',
        '5. Use the access_token in step3_test_drive_api to test the connection'
      ]
    })

  } catch (error) {
    console.error('Google Drive curl test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate curl commands',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
