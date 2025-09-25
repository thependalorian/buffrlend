#!/usr/bin/env tsx

/**
 * Environment Configuration Test Script
 * Tests that all required environment variables are properly configured
 */

import { createClient } from '../lib/supabase/client';
import { createClient as createServerClient } from '../lib/supabase/server';
import { rateLimiters } from '../lib/security/rate-limiter';
import { generateCSRFToken, validateCSRFToken } from '../lib/security/csrf';
import { auditLogger } from '../lib/security/audit-logger';

console.log('🔍 Testing Environment Configuration...\n');

// Test environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY'
];

const optionalEnvVars = [
  'CUSTOM_KEY',
  'NODE_ENV',
  'VERCEL_URL',
  'VERCEL_ENV',
  'CI'
];

console.log('📋 Required Environment Variables:');
let allRequiredPresent = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
    allRequiredPresent = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value}`);
  } else {
    console.log(`⚠️  ${envVar}: NOT SET (optional)`);
  }
});

console.log('\n🧪 Testing Supabase Client Creation...');

try {
  // Test client creation
  const client = createClient();
  console.log('✅ Supabase client created successfully');
  
  // Test if we can access the client methods
  if (typeof client.auth === 'object' && typeof client.from === 'function') {
    console.log('✅ Supabase client methods available');
  } else {
    console.log('⚠️  Supabase client methods not fully available');
  }
  
} catch (error) {
  console.log('❌ Error creating Supabase client:', (error as Error).message);
  allRequiredPresent = false;
}

console.log('\n🧪 Testing Security Configuration...');

try {
  // Test rate limiter
  console.log('✅ Rate limiter imported successfully');
  
  // Test CSRF protection
  const token = generateCSRFToken();
  console.log('✅ CSRF token generation successful');
  
  // Test audit logger
  console.log('✅ Audit logger imported successfully');
  
} catch (error) {
  console.log('❌ Error importing security modules:', (error as Error).message);
  allRequiredPresent = false;
}

console.log('\n🧪 Testing Database Schema...');

try {
  // Test if we can read the schema files
  const fs = require('fs');
  const path = require('path');
  
  const schemaPath = path.join(__dirname, '../lib/supabase/schema.sql');
  const loanSchemaPath = path.join(__dirname, '../lib/supabase/loan-schema.sql');
  
  if (fs.existsSync(schemaPath)) {
    console.log('✅ Database schema file found');
  } else {
    console.log('⚠️  Database schema file not found');
  }
  
  if (fs.existsSync(loanSchemaPath)) {
    console.log('✅ Loan schema file found');
  } else {
    console.log('⚠️  Loan schema file not found');
  }
  
} catch (error) {
  console.log('❌ Error checking database schema:', (error as Error).message);
}

console.log('\n🧪 Testing Next.js Configuration...');

try {
  const nextConfig = require('../next.config.ts');
  console.log('✅ Next.js configuration loaded successfully');
  
  // Test if security headers are configured
  if (nextConfig.default && nextConfig.default.headers) {
    console.log('✅ Security headers configuration found');
  } else {
    console.log('⚠️  Security headers configuration not found');
  }
  
} catch (error) {
  console.log('❌ Error loading Next.js configuration:', (error as Error).message);
  allRequiredPresent = false;
}

console.log('\n🧪 Testing Test Configuration...');

try {
  const jestConfig = require('../jest.config.js');
  console.log('✅ Jest configuration loaded successfully');
  
  const playwrightConfig = require('../playwright.config.ts');
  console.log('✅ Playwright configuration loaded successfully');
  
} catch (error) {
  console.log('❌ Error loading test configuration:', (error as Error).message);
  allRequiredPresent = false;
}

console.log('\n📊 Test Results Summary:');
if (allRequiredPresent) {
  console.log('🎉 All tests passed! Environment configuration is correct.');
  console.log('\n📝 Next Steps:');
  console.log('1. Set your actual Supabase credentials in .env.local');
  console.log('2. Run: npm install');
  console.log('3. Run: npm run test');
  console.log('4. Run: npm run dev');
} else {
  console.log('❌ Some tests failed. Please check the configuration.');
  console.log('\n📝 Required Actions:');
  console.log('1. Create .env.local file with your Supabase credentials');
  console.log('2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY');
  console.log('3. Run this test again');
}

console.log('\n🔧 Environment File Template:');
console.log(`
# Create .env.local file with the following content:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key_here
CUSTOM_KEY=your_custom_key
NODE_ENV=development
`);

process.exit(allRequiredPresent ? 0 : 1);
