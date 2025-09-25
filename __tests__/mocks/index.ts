/**
 * Centralized Mock Setup for BuffrLend Tests
 * Provides consistent mocking across all test files
 */

import { mockSupabaseClient } from './supabase-mock';

// Mock Google Drive Service
export const mockGoogleDriveService = {
  initialize: jest.fn(),
  uploadDocument: jest.fn(),
  downloadDocument: jest.fn(),
  deleteDocument: jest.fn(),
  listDocuments: jest.fn(),
  importDocuments: jest.fn(),
  exportDocuments: jest.fn(),
  syncDocuments: jest.fn(),
  migrateDocuments: jest.fn(),
  backupDocuments: jest.fn(),
  restoreDocuments: jest.fn(),
  getImportStatus: jest.fn(),
  getExportStatus: jest.fn(),
  getSyncStatus: jest.fn(),
  getMigrationStatus: jest.fn(),
  getBackupStatus: jest.fn(),
  getRestoreStatus: jest.fn(),
};

// Mock WhatsApp Service
export const mockWhatsAppService = {
  sendMessage: jest.fn(),
  sendDocument: jest.fn(),
  sendTemplate: jest.fn(),
};

// Mock Email Service
export const mockEmailService = {
  sendEmail: jest.fn(),
  sendBulkEmail: jest.fn(),
  sendTemplateEmail: jest.fn(),
};

// Mock JWT Service
export const mockJWTService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

// Mock Loan Calculator Service
export const mockLoanCalculatorService = {
  calculateLoan: jest.fn(),
  calculateInterest: jest.fn(),
  calculatePayment: jest.fn(),
  calculateAmortization: jest.fn(),
};

// Setup default mock implementations
export const setupDefaultMocks = () => {
  // Default successful auth
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user: { id: 'user-123', email: 'test@example.com' } },
    error: null,
  });

  // Default successful Google Drive operations
  mockGoogleDriveService.initialize.mockResolvedValue(true);
  mockGoogleDriveService.uploadDocument.mockResolvedValue({
    success: true,
    file_id: 'google-file-id-123',
    file_url: 'https://drive.google.com/file/123',
  });

  // Default successful WhatsApp operations
  mockWhatsAppService.sendMessage.mockResolvedValue({
    success: true,
    message_id: 'whatsapp-msg-123',
  });

  // Default successful email operations
  mockEmailService.sendEmail.mockResolvedValue({
    success: true,
    message_id: 'email-msg-123',
  });

  // Default successful JWT operations
  mockJWTService.sign.mockReturnValue('mock-jwt-token');
  mockJWTService.verify.mockReturnValue({ userId: 'user-123' });

  // Default successful loan calculations
  mockLoanCalculatorService.calculateLoan.mockResolvedValue({
    monthly_payment: 1000,
    total_interest: 5000,
    total_amount: 25000,
    amortization_schedule: [],
  });
};

// Clear all mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
  setupDefaultMocks();
};

// Export all mocks
export {
  mockSupabaseClient,
};