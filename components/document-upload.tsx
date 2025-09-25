/**
 * Document Upload Component with Google Drive Integration
 * Handles KYC and loan document uploads with progress tracking
 */

'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
  userId: string
  loanApplicationId?: string
  documentType?: 'national_id' | 'passport' | 'drivers_license' | 'payslip' | 'bank_statement' | 'employment_letter' | 'loan_agreement'
  onUploadComplete?: (document: unknown) => void
  onUploadError?: (error: string) => void
  maxFileSize?: number // in MB
  allowedTypes?: string[]
  className?: string
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  documentId?: string
}

export function DocumentUpload({
  userId,
  loanApplicationId,
  documentType,
  onUploadComplete,
  onUploadError,
  maxFileSize = 10,
  allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/tiff',
    'image/bmp',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ],
  className = '',
}: DocumentUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        onUploadError?.(`File ${file.name} exceeds ${maxFileSize}MB limit`)
        return false
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        onUploadError?.(`File type ${file.type} is not supported`)
        return false
      }

      return true
    })

    // Initialize upload progress for valid files
    const newUploads: UploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading',
    }))

    setUploads(prev => [...prev, ...newUploads])

    // Start uploads
    validFiles.forEach((file) => {
      uploadFile(file)
    })
  }

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)
      
      if (loanApplicationId) {
        formData.append('loanApplicationId', loanApplicationId)
      }
      
      if (documentType) {
        formData.append('documentType', documentType)
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map(upload => {
          if (upload.file === file && upload.progress < 90) {
            return { ...upload, progress: upload.progress + 10 }
          }
          return upload
        }))
      }, 200)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      const result = await response.json()

      if (result.success) {
        setUploads(prev => prev.map(upload => {
          if (upload.file === file) {
            return {
              ...upload,
              progress: 100,
              status: 'success',
              documentId: result.document.id,
            }
          }
          return upload
        }))

        onUploadComplete?.(result.document)
      } else {
        setUploads(prev => prev.map(upload => {
          if (upload.file === file) {
            return {
              ...upload,
              status: 'error',
              error: result.error,
            }
          }
          return upload
        }))

        onUploadError?.(result.error)
      }
    } catch {
      setUploads(prev => prev.map(upload => {
        if (upload.file === file) {
          return {
            ...upload,
            status: 'error',
            error: 'Upload failed',
          }
        }
        return upload
      }))

      onUploadError?.('Upload failed')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file))
  }

  const getStatusIcon = (status: UploadProgress['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'uploading':
        return <AlertCircle className="h-5 w-5 text-blue-500 animate-pulse" />
    }
  }

  const getStatusBadge = (status: UploadProgress['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Uploaded</Badge>
      case 'error':
        return <Badge variant="destructive">Failed</Badge>
      case 'uploading':
        return <Badge variant="secondary">Uploading...</Badge>
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload your KYC documents and loan agreements. Files will be automatically stored in Google Drive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, PNG, JPG, JPEG, TIFF, BMP, DOC, DOCX, TXT
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: {maxFileSize}MB
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Upload Progress</h4>
              {uploads.map((upload, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(upload.status)}
                      <span className="font-medium">{upload.file.name}</span>
                      <span className="text-sm text-gray-500">
                        ({(upload.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(upload.status)}
                      {upload.status !== 'uploading' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUpload(upload.file)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {upload.status === 'uploading' && (
                    <Progress value={upload.progress} className="mb-2" />
                  )}
                  
                  {upload.status === 'error' && upload.error && (
                    <Alert variant="error">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{upload.error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {upload.status === 'success' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Document uploaded successfully and stored in Google Drive
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Document Type Info */}
          {documentType && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This upload is for: <strong>{documentType.replace('_', ' ').toUpperCase()}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentUpload