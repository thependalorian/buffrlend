/**
 * Digital Signature Component for Loan Agreements
 * Handles signature capture, validation, and processing
 */

import { useState, useRef, useCallback } from 'react';
import { PenTool, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DigitalSignatureProps {
  borrowerName: string
  onSignatureComplete: (signature: DigitalSignatureData) => void
  onSignatureError: (error: string) => void
  disabled?: boolean
  className?: string
}

interface DigitalSignatureData {
  borrower_name: string
  borrower_signature: string
  signature_date: string
  ip_address: string
  user_agent: string
  consent_given: boolean
  salary_deduction_authorized: boolean
}

export function DigitalSignature({
  borrowerName,
  onSignatureComplete,
  onSignatureError,
  disabled = false,
  className = ''
}: DigitalSignatureProps) {
  const [signature, setSignature] = useState<string>('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [salaryDeductionAuthorized, setSalaryDeductionAuthorized] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signatureRef = useRef<HTMLDivElement>(null)

  // Get client IP and user agent
  const getClientInfo = useCallback(() => {
    return {
      ip_address: '127.0.0.1', // Would be populated from request headers in real implementation
      user_agent: navigator.userAgent
    }
  }, [])

  // Handle signature drawing
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return
    
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.strokeStyle = '#1e40af'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [disabled])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }, [isDrawing, disabled])

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    
    e.preventDefault()
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.strokeStyle = '#1e40af'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [disabled])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return

    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }, [isDrawing, disabled])

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(false)
  }, [])

  // Clear signature
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setSignature('')
    setError('')
  }, [])

  // Get signature as base64
  const getSignatureData = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return ''

    return canvas.toDataURL('image/png')
  }, [])

  // Validate signature
  const validateSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Check if canvas has unknown non-transparent pixels
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) {
        return true
      }
    }
    return false
  }, [])

  // Process signature
  const processSignature = useCallback(async () => {
    try {
      setIsProcessing(true)
      setError('')

      // Validate signature
      if (!validateSignature()) {
        setError('Please provide your signature')
        return
      }

      if (!consentGiven) {
        setError('Please confirm that you have read and agree to the terms')
        return
      }

      if (!salaryDeductionAuthorized) {
        setError('Please authorize salary deduction')
        return
      }

      // Get signature data
      const signatureData = getSignatureData()
      const clientInfo = getClientInfo()

      const signaturePayload: DigitalSignatureData = {
        borrower_name: borrowerName,
        borrower_signature: signatureData,
        signature_date: new Date().toISOString(),
        ip_address: clientInfo.ip_address,
        user_agent: clientInfo.user_agent,
        consent_given: consentGiven,
        salary_deduction_authorized: salaryDeductionAuthorized
      }

      // Call parent callback
      onSignatureComplete(signaturePayload)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(errorMessage)
      onSignatureError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }, [
    validateSignature,
    consentGiven,
    salaryDeductionAuthorized,
    getSignatureData,
    getClientInfo,
    borrowerName,
    onSignatureComplete,
    onSignatureError
  ])

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Digital Signature
        </CardTitle>
        <CardDescription>
          Please sign below to complete your loan agreement
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Signature Canvas */}
        <div className="space-y-4">
          <Label htmlFor="signature-canvas">Your Signature</Label>
          <div 
            ref={signatureRef}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
          >
            <canvas
              ref={canvasRef}
              id="signature-canvas"
              width={400}
              height={150}
              className="border border-gray-200 rounded bg-white cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'none' }}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Sign above using your mouse or touch screen
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={disabled || isProcessing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked: boolean) => setConsentGiven(checked)}
              disabled={disabled || isProcessing}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed">
              I have read, understood, and agree to all the terms and conditions of this loan agreement. 
              I acknowledge that this is a legally binding document.
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="salary-deduction"
              checked={salaryDeductionAuthorized}
              onCheckedChange={(checked: boolean) => setSalaryDeductionAuthorized(checked)}
              disabled={disabled || isProcessing}
            />
            <Label htmlFor="salary-deduction" className="text-sm leading-relaxed">
              I authorize my employer to deduct the monthly payment amounts from my salary and 
              remit them directly to Buffr Lend until the loan is fully repaid.
            </Label>
          </div>
        </div>

        {/* Legal Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Legal Notice:</strong> By signing this agreement, you are entering into a legally 
            binding contract. Please ensure you have read and understood all terms before signing. 
            Your signature will be recorded with timestamp and IP address for legal compliance.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={processSignature}
            disabled={disabled || isProcessing || !consentGiven || !salaryDeductionAuthorized}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Sign & Accept Agreement
              </>
            )}
          </Button>
        </div>

        {/* Signature Preview */}
        {signature && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Signature Captured</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your signature has been successfully captured and will be included in the final agreement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
