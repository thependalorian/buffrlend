/**
 * Document Upload Component Tests
 * Tests the DocumentUpload component with Google Drive integration
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentUpload } from '@/components/document-upload'

// Mock fetch
global.fetch = jest.fn()

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('DocumentUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render document upload form', () => {
    render(<DocumentUpload userId="user-123" />)
    
    expect(screen.getByText('Document Upload')).toBeInTheDocument()
    expect(screen.getByText('Select Files')).toBeInTheDocument()
    expect(screen.getByText(/drag and drop files here/i)).toBeInTheDocument()
  })

  it('should show supported file formats', () => {
    render(<DocumentUpload userId="user-123" />)
    
    expect(screen.getByText(/supported formats/i)).toBeInTheDocument()
    expect(screen.getByText(/PDF, PNG, JPG, JPEG, TIFF, BMP, DOC, DOCX, TXT/i)).toBeInTheDocument()
    expect(screen.getByText(/maximum file size: 10MB/i)).toBeInTheDocument()
  })

  it('should upload document successfully', async () => {
    const user = userEvent.setup()
    const mockOnUploadComplete = jest.fn()
    
    // Mock successful upload
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        document: {
          id: 'doc-123',
          file_id: 'google-file-id',
          file_url: 'https://drive.google.com/file/d/google-file-id/view',
        },
      }),
    })

    render(<DocumentUpload userId="user-123" onUploadComplete={mockOnUploadComplete} />)
    
    // Get the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'national_id.pdf', { type: 'application/pdf' })
    
    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    await waitFor(() => {
      expect(screen.getByText('national_id.pdf')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByText('Uploaded')).toBeInTheDocument()
    })
    
    expect(mockOnUploadComplete).toHaveBeenCalledWith({
      id: 'doc-123',
      file_id: 'google-file-id',
      file_url: 'https://drive.google.com/file/d/google-file-id/view',
    })
  })

  it('should handle upload errors', async () => {
    const mockOnUploadError = jest.fn()
    
    // Mock failed upload
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: false,
        error: 'Upload failed',
      }),
    })

    render(<DocumentUpload userId="user-123" onUploadError={mockOnUploadError} />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument()
    })
    
    expect(mockOnUploadError).toHaveBeenCalledWith('Upload failed')
  })

  it('should handle network errors', async () => {
    const mockOnUploadError = jest.fn()
    
    // Mock network error
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<DocumentUpload userId="user-123" onUploadError={mockOnUploadError} />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument()
    })
    
    expect(mockOnUploadError).toHaveBeenCalledWith('Upload failed')
  })

  it('should validate file size', () => {
    const mockOnUploadError = jest.fn()
    render(<DocumentUpload userId="user-123" onUploadError={mockOnUploadError} maxFileSize={1} />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    // Create a large file (2MB)
    const largeContent = 'x'.repeat(2 * 1024 * 1024)
    const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    expect(mockOnUploadError).toHaveBeenCalledWith('File large.pdf exceeds 1MB limit')
  })

  it('should validate file types', () => {
    const mockOnUploadError = jest.fn()
    render(<DocumentUpload userId="user-123" onUploadError={mockOnUploadError} />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'test.zip', { type: 'application/zip' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    expect(mockOnUploadError).toHaveBeenCalledWith('File type application/zip is not supported')
  })

  it('should show upload progress', async () => {
    // Mock slow upload
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, document: { id: 'doc-1' } }),
      }), 100))
    )

    render(<DocumentUpload userId="user-123" />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    // Should show uploading state
    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument()
    })
  })

  it('should handle multiple files', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        document: { id: 'doc-123' },
      }),
    })

    render(<DocumentUpload userId="user-123" />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file1 = new File(['test content 1'], 'file1.pdf', { type: 'application/pdf' })
    const file2 = new File(['test content 2'], 'file2.pdf', { type: 'application/pdf' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file1, file2],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    await waitFor(() => {
      expect(screen.getByText('file1.pdf')).toBeInTheDocument()
      expect(screen.getByText('file2.pdf')).toBeInTheDocument()
    })
  })

  it('should show document type when specified', () => {
    render(<DocumentUpload userId="user-123" documentType="national_id" />)
    
    expect(screen.getByText(/this upload is for/i)).toBeInTheDocument()
    expect(screen.getByText(/NATIONAL ID/i)).toBeInTheDocument()
  })

  it('should allow removing uploads', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        document: { id: 'doc-123' },
      }),
    })

    render(<DocumentUpload userId="user-123" />)
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    
    fireEvent.change(fileInput)
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByText('Uploaded')).toBeInTheDocument()
    })
    
    const removeButton = screen.getByText('Remove')
    await user.click(removeButton)
    
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
  })
})