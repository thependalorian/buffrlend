const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  // Add polyfills for web APIs
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  // Set NODE_ENV to test
  globals: {
    'process.env.NODE_ENV': 'test',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jose)/)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Higher coverage requirements for critical financial components
    'components/loan-calculator.tsx': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'lib/loan-calculator.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    'lib/validation/schemas.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
    '<rootDir>/playwright-report/',
  ],
  // Add test timeout for integration tests
  testTimeout: 10000,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
