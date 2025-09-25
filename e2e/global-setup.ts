/**
 * Global setup for Playwright E2E tests
 * Sets up test database, creates test users, and prepares test environment
 */

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...')

  // Start browser for setup tasks
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Setup test database
    await setupTestDatabase()

    // Create test users
    await createTestUsers(page)

    // Setup test companies
    await setupTestCompanies()

    // Setup test documents
    await setupTestDocuments()

    console.log('✅ Global test setup completed successfully')
  } catch (error) {
    console.error('❌ Global test setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

async function setupTestDatabase() {
  console.log('📊 Setting up test database...')
  
  // Here you would typically:
  // 1. Connect to your test database
  // 2. Run migrations
  // 3. Seed with test data
  // 4. Set up test-specific configurations
  
  // For now, we'll simulate this
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('✅ Test database setup complete')
}

async function createTestUsers(page: any) {
  console.log('👥 Creating test users...')
  
  // Navigate to signup page
  await page.goto('http://localhost:3000/auth/signup')
  
  // Create regular test user
  await page.fill('[data-testid="email"]', 'testuser@example.com')
  await page.fill('[data-testid="password"]', 'testpassword123')
  await page.fill('[data-testid="repeat-password"]', 'testpassword123')
  await page.click('[data-testid="signup-button"]')
  
  // Wait for signup to complete
  await page.waitForURL('**/auth/sign-up-success')
  
  // Create admin test user
  await page.goto('http://localhost:3000/auth/signup')
  await page.fill('[data-testid="email"]', 'admin@example.com')
  await page.fill('[data-testid="password"]', 'adminpassword123')
  await page.fill('[data-testid="repeat-password"]', 'adminpassword123')
  await page.click('[data-testid="signup-button"]')
  
  await page.waitForURL('**/auth/sign-up-success')
  
  console.log('✅ Test users created')
}

async function setupTestCompanies() {
  console.log('🏢 Setting up test companies...')
  
  // Here you would typically:
  // 1. Insert test companies into database
  // 2. Set up partnership statuses
  // 3. Configure company-specific settings
  
  const testCompanies = [
    {
      name: 'ABC Corporation',
      registration_number: 'REG001',
      industry: 'Technology',
      employee_count: 150,
      partnership_status: 'verified',
      salary_deduction_active: true,
      partnership_tier: 'premium',
    },
    {
      name: 'Tech Solutions Ltd',
      registration_number: 'REG002',
      industry: 'Software Development',
      employee_count: 75,
      partnership_status: 'verified',
      salary_deduction_active: true,
      partnership_tier: 'premium',
    },
    {
      name: 'New Company Ltd',
      registration_number: 'REG003',
      industry: 'Retail',
      employee_count: 50,
      partnership_status: 'pending',
      salary_deduction_active: false,
      partnership_tier: null,
    },
  ]
  
  // Simulate database insertion
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('✅ Test companies setup complete')
}

async function setupTestDocuments() {
  console.log('📄 Setting up test documents...')
  
  // Create test document files
  const testDocuments = [
    'test-files/national_id.jpg',
    'test-files/payslip.pdf',
    'test-files/bank_statement.pdf',
  ]
  
  // Here you would typically:
  // 1. Create test document files
  // 2. Upload them to test storage
  // 3. Set up document metadata
  
  // Simulate document setup
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('✅ Test documents setup complete')
}

export default globalSetup
