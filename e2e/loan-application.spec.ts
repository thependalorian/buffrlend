/**
 * End-to-end tests for loan application flow
 * Tests complete user journey from landing page to loan application completion
 */

import { test, expect } from '@playwright/test'

test.describe('Loan Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/')
  })

  test('completes full loan application process', async ({ page }) => {
    // Step 1: Navigate to loan application from landing page
    await page.click('text=Apply Now')
    await expect(page).toHaveURL('/protected/loan-application')

    // Step 2: Fill out loan details
    await page.fill('[data-testid="loan-amount"]', '5000')
    await page.selectOption('[data-testid="loan-term"]', '3')
    
    // Verify loan calculator updates
    await expect(page.locator('[data-testid="monthly-payment"]')).toContainText('N$2,005')
    await expect(page.locator('[data-testid="total-payable"]')).toContainText('N$6,015')

    // Step 3: Fill out employment information
    await page.fill('[data-testid="employer-search"]', 'ABC Corporation')
    await page.click('[data-testid="select-company"]')
    
    await page.selectOption('[data-testid="employment-type"]', 'full_time')
    await page.fill('[data-testid="monthly-salary"]', '25000')
    await page.fill('[data-testid="next-payday"]', '2024-02-01')

    // Step 4: Upload required documents
    // National ID
    const nationalIdFile = await page.locator('[data-testid="national-id-upload"]')
    await nationalIdFile.setInputFiles('test-files/national_id.jpg')
    await expect(page.locator('[data-testid="national-id-status"]')).toContainText('Uploaded')

    // Payslip
    const payslipFile = await page.locator('[data-testid="payslip-upload"]')
    await payslipFile.setInputFiles('test-files/payslip.pdf')
    await expect(page.locator('[data-testid="payslip-status"]')).toContainText('Uploaded')

    // Bank Statement
    const bankStatementFile = await page.locator('[data-testid="bank-statement-upload"]')
    await bankStatementFile.setInputFiles('test-files/bank_statement.pdf')
    await expect(page.locator('[data-testid="bank-statement-status"]')).toContainText('Uploaded')

    // Step 5: Review and submit application
    await page.click('[data-testid="review-application"]')
    
    // Verify all information is displayed correctly
    await expect(page.locator('[data-testid="review-loan-amount"]')).toContainText('N$5,000')
    await expect(page.locator('[data-testid="review-term"]')).toContainText('3 months')
    await expect(page.locator('[data-testid="review-employer"]')).toContainText('ABC Corporation')
    await expect(page.locator('[data-testid="review-salary"]')).toContainText('N$25,000')

    // Accept terms and conditions
    await page.check('[data-testid="accept-terms"]')
    await page.check('[data-testid="accept-salary-deduction"]')

    // Submit application
    await page.click('[data-testid="submit-application"]')

    // Step 6: Verify application submission
    await expect(page).toHaveURL('/protected/loan-application/success')
    await expect(page.locator('[data-testid="application-id"]')).toBeVisible()
    await expect(page.locator('[data-testid="next-steps"]')).toContainText('KYC verification')
  })

  test('validates loan amount against salary compliance', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Set salary to 15000 (max loan should be 5000 - 1/3 rule)
    await page.fill('[data-testid="monthly-salary"]', '15000')
    await page.fill('[data-testid="loan-amount"]', '6000')

    // Should show compliance warning
    await expect(page.locator('[data-testid="salary-compliance-warning"]')).toBeVisible()
    await expect(page.locator('[data-testid="salary-compliance-warning"]')).toContainText('exceeds 1/3 of your salary')

    // Correct the loan amount
    await page.fill('[data-testid="loan-amount"]', '4000')
    await expect(page.locator('[data-testid="salary-compliance-success"]')).toBeVisible()
  })

  test('handles company lookup and selection', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Search for company
    await page.fill('[data-testid="employer-search"]', 'ABC')
    await page.waitForSelector('[data-testid="search-results"]')

    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toContainText('ABC Corporation')
    await expect(page.locator('[data-testid="partnership-status"]')).toContainText('Verified Partner')

    // Select company
    await page.click('[data-testid="select-company"]')
    await expect(page.locator('[data-testid="selected-company"]')).toContainText('ABC Corporation')
  })

  test('validates document upload requirements', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Try to proceed without uploading documents
    await page.click('[data-testid="review-application"]')
    await expect(page.locator('[data-testid="document-error"]')).toContainText('Please upload all required documents')

    // Upload invalid file type
    const nationalIdFile = await page.locator('[data-testid="national-id-upload"]')
    await nationalIdFile.setInputFiles('test-files/invalid.txt')
    await expect(page.locator('[data-testid="file-type-error"]')).toContainText('Unsupported file format')

    // Upload file that's too large
    await nationalIdFile.setInputFiles('test-files/large_file.pdf')
    await expect(page.locator('[data-testid="file-size-error"]')).toContainText('File size exceeds 2MB limit')
  })

  test('saves application progress automatically', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Fill out partial information
    await page.fill('[data-testid="loan-amount"]', '3000')
    await page.selectOption('[data-testid="loan-term"]', '2')
    await page.fill('[data-testid="monthly-salary"]', '20000')

    // Navigate away and back
    await page.goto('/protected/dashboard')
    await page.goto('/protected/loan-application')

    // Verify information is restored
    await expect(page.locator('[data-testid="loan-amount"]')).toHaveValue('3000')
    await expect(page.locator('[data-testid="loan-term"]')).toHaveValue('2')
    await expect(page.locator('[data-testid="monthly-salary"]')).toHaveValue('20000')
  })

  test('handles application submission errors gracefully', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Fill out application
    await page.fill('[data-testid="loan-amount"]', '5000')
    await page.selectOption('[data-testid="loan-term"]', '3')
    await page.fill('[data-testid="employer-search"]', 'ABC Corporation')
    await page.click('[data-testid="select-company"]')
    await page.fill('[data-testid="monthly-salary"]', '25000')

    // Mock network error
    await page.route('**/api/loan-applications', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      })
    })

    await page.click('[data-testid="submit-application"]')

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to submit application')
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })
})

test.describe('Mobile Loan Application', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('works correctly on mobile devices', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-layout"]')).toBeVisible()

    // Test touch interactions
    await page.tap('[data-testid="loan-amount"]')
    await page.fill('[data-testid="loan-amount"]', '3000')

    // Test mobile-specific UI elements
    await expect(page.locator('[data-testid="mobile-calculator"]')).toBeVisible()
    await expect(page.locator('[data-testid="mobile-progress"]')).toBeVisible()
  })

  test('handles mobile document upload', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Test mobile file upload
    const fileInput = page.locator('[data-testid="national-id-upload"]')
    await fileInput.setInputFiles('test-files/national_id.jpg')

    // Verify mobile upload UI
    await expect(page.locator('[data-testid="mobile-upload-success"]')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Navigate using Tab key
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="loan-amount"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="loan-term"]')).toBeFocused()

    // Fill form using keyboard
    await page.keyboard.type('5000')
    await page.keyboard.press('Tab')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
  })

  test('has proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Check for proper ARIA attributes
    await expect(page.locator('[data-testid="loan-amount"]')).toHaveAttribute('aria-label')
    await expect(page.locator('[data-testid="loan-term"]')).toHaveAttribute('aria-label')
    await expect(page.locator('[data-testid="employer-search"]')).toHaveAttribute('aria-label')

    // Check for proper roles
    await expect(page.locator('[data-testid="loan-calculator"]')).toHaveAttribute('role', 'region')
    await expect(page.locator('[data-testid="document-upload"]')).toHaveAttribute('role', 'region')
  })

  test('announces form validation errors to screen readers', async ({ page }) => {
    await page.goto('/protected/loan-application')

    // Submit form without required fields
    await page.click('[data-testid="submit-application"]')

    // Check for ARIA live regions
    await expect(page.locator('[role="alert"]')).toBeVisible()
    await expect(page.locator('[aria-live="polite"]')).toBeVisible()
  })
})

test.describe('Performance', () => {
  test('loads loan application page quickly', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/protected/loan-application')
    const loadTime = Date.now() - startTime

    expect(loadTime).toBeLessThan(3000) // Less than 3 seconds
  })

  test('calculates loan details efficiently', async ({ page }) => {
    await page.goto('/protected/loan-application')

    const startTime = Date.now()
    await page.fill('[data-testid="loan-amount"]', '5000')
    await page.selectOption('[data-testid="loan-term"]', '3')
    const calculationTime = Date.now() - startTime

    expect(calculationTime).toBeLessThan(500) // Less than 500ms
  })
})
