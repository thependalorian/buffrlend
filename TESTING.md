# BuffrLend Testing Documentation

## Overview

This document provides comprehensive information about the testing strategy, setup, and execution for the BuffrLend platform. The testing suite ensures production readiness and maintains the highest quality standards for this financial services application.

## Testing Strategy

### 1. Testing Pyramid

```
    /\
   /  \     E2E Tests (Playwright)
  /____\    - User journeys
 /      \   - Critical workflows
/________\  - Cross-browser testing

   /\
  /  \      Integration Tests
 /____\     - API endpoints
/      \    - Database operations
/________\  - Authentication flows

  /\
 /  \       Unit Tests (Jest)
/____\      - Components
/      \    - Utilities
/________\  - Business logic
```

### 2. Coverage Requirements

- **Minimum 80% code coverage** for all modules
- **100% coverage** for critical financial calculations
- **Complete coverage** for authentication flows
- **Full coverage** for API endpoints

## Test Types

### Unit Tests

**Location**: `__tests__/components/`, `__tests__/lib/`

**Purpose**: Test individual components and utility functions in isolation

**Key Areas**:
- Loan calculator components and utilities
- Company lookup functionality
- Document upload components
- Navigation and layout components
- Form validation and error handling

**Example**:
```bash
npm run test -- --testPathPattern=components/loan-calculator
```

### Integration Tests

**Location**: `__tests__/integration/`

**Purpose**: Test interactions between different parts of the system

**Key Areas**:
- Authentication flows (signup, login, password recovery)
- API route handlers
- Database operations
- WhatsApp integration
- CRM system integration

**Example**:
```bash
npm run test -- --testPathPattern=integration/auth
```

### End-to-End Tests

**Location**: `e2e/`

**Purpose**: Test complete user journeys from start to finish

**Key Areas**:
- Complete loan application process
- Admin workflow for application management
- Mobile-responsive interactions
- Cross-browser compatibility

**Example**:
```bash
npm run test:e2e
```

### Security Tests

**Location**: `__tests__/security/`

**Purpose**: Ensure the application is secure and compliant

**Key Areas**:
- Authentication and authorization
- Input validation and sanitization
- API security
- Data protection
- Session management

**Example**:
```bash
npm run test -- --testPathPattern=security
```

### Performance Tests

**Location**: `__tests__/performance/`

**Purpose**: Ensure the application performs well under load

**Key Areas**:
- API response times
- Database query optimization
- Frontend performance
- Memory usage
- Scalability

**Example**:
```bash
npm run test -- --testPathPattern=performance
```

## Test Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Playwright** browsers installed

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Setup

1. **Test Database**: Set up a separate Supabase project for testing
2. **Environment Variables**: Create `.env.test` with test-specific configurations
3. **Mock Services**: Configure MSW (Mock Service Worker) for API mocking

### Configuration Files

- **Jest**: `jest.config.js` - Unit and integration test configuration
- **Playwright**: `playwright.config.ts` - E2E test configuration
- **MSW**: `__tests__/mocks/server.ts` - API mocking setup

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- loan-calculator.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="Loan Calculator"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific E2E test
npm run test:e2e -- loan-application.spec.ts
```

### Test Reports

```bash
# Generate coverage report
npm run test:coverage

# Generate E2E report
npm run test:e2e
# Report available at: playwright-report/index.html
```

## Test Data and Fixtures

### Mock Data

**Location**: `__tests__/fixtures/`

- **User Data**: `userData.ts` - Mock users, profiles, and employment data
- **Loan Data**: `loanData.ts` - Mock loan applications, payments, and calculations
- **Company Data**: `companyData.ts` - Mock companies and partnership information

### Test Utilities

**Location**: `__tests__/utils/`

- **Test Utils**: `testUtils.tsx` - Custom render functions and test helpers
- **MSW Setup**: `__tests__/mocks/server.ts` - API mocking configuration

## Namibian Context Testing

### Currency and Financial Calculations

- **NAD Currency**: All financial calculations use Namibian Dollars
- **Interest Rate**: 15% once-off interest rate validation
- **NAMFISA Levy**: 4% levy calculation and validation
- **Salary Compliance**: 1/3 salary rule enforcement

### Local Compliance

- **Namibian ID**: Validation of Namibian ID number formats
- **Local Employers**: Testing with Namibian company databases
- **Regional Requirements**: Compliance with local financial regulations

### Phone Number Formats

- **Namibian Numbers**: Testing with +264 country code
- **WhatsApp Integration**: Local phone number validation

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

### Pre-deployment Checks

1. **Unit Tests**: Must pass with 80%+ coverage
2. **Integration Tests**: All authentication and API tests must pass
3. **E2E Tests**: Critical user journeys must pass
4. **Security Tests**: All security validations must pass
5. **Performance Tests**: Response times must meet benchmarks

## Test Maintenance

### Adding New Tests

1. **Unit Tests**: Add to appropriate component or utility test file
2. **Integration Tests**: Add to integration test directory
3. **E2E Tests**: Add to e2e directory with descriptive spec name
4. **Security Tests**: Add to security test directory

### Updating Tests

1. **Mock Data**: Update fixtures when data structures change
2. **Test Utilities**: Update helpers when common patterns change
3. **MSW Handlers**: Update API mocks when endpoints change

### Test Debugging

```bash
# Debug Jest tests
npm run test -- --verbose --no-cache

# Debug Playwright tests
npm run test:e2e -- --debug

# Debug specific test
npm run test -- --testNamePattern="specific test" --verbose
```

## Best Practices

### Test Writing

1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Single Responsibility**: Each test should test one thing
4. **Independent Tests**: Tests should not depend on each other
5. **Clean Setup**: Use beforeEach/afterEach for test isolation

### Test Data

1. **Realistic Data**: Use realistic test data that matches production
2. **Edge Cases**: Test boundary conditions and edge cases
3. **Error Scenarios**: Test error handling and failure modes
4. **Security**: Never use real user data in tests

### Performance

1. **Fast Tests**: Keep unit tests fast (< 100ms each)
2. **Parallel Execution**: Use parallel test execution where possible
3. **Efficient Mocks**: Use efficient mocking strategies
4. **Resource Cleanup**: Clean up resources after tests

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout for slow tests
2. **Mock Issues**: Check MSW handler configuration
3. **Environment Issues**: Verify test environment setup
4. **Coverage Issues**: Check coverage thresholds and exclusions

### Debug Commands

```bash
# Check test configuration
npm run test -- --showConfig

# Run tests with debug output
DEBUG=* npm run test

# Check Playwright installation
npx playwright --version
```

## Monitoring and Reporting

### Test Metrics

- **Coverage Percentage**: Track code coverage over time
- **Test Execution Time**: Monitor test performance
- **Flaky Tests**: Identify and fix unstable tests
- **Test Failure Rate**: Track test reliability

### Reports

- **Coverage Report**: HTML report in `coverage/` directory
- **E2E Report**: HTML report in `playwright-report/` directory
- **CI Reports**: Integrated with GitHub Actions

## Conclusion

This comprehensive testing strategy ensures that the BuffrLend platform maintains the highest quality standards while serving Namibian private sector employees. The multi-layered approach covers unit testing, integration testing, end-to-end testing, security validation, and performance monitoring.

For questions or issues with testing, please refer to the troubleshooting section or contact the development team.
