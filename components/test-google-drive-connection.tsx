import React, { useState } from 'react'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { GoogleDriveService } from '@/lib/services/google-drive-service'
import { RAGPipelineService } from '@/lib/services/rag-pipeline-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: Record<string, unknown>
}

export default function TestGoogleDriveConnection() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [googleDriveService] = useState(() => new GoogleDriveService())
  const [ragPipelineService] = useState(() => new RAGPipelineService())

  const runTests = async () => {
    setIsRunning(true)
    setResults([])

    const tests: TestResult[] = [
      {
        name: 'Google Drive Connection',
        status: 'pending',
        message: 'Testing connection...'
      },
      {
        name: 'Google Drive Statistics',
        status: 'pending',
        message: 'Getting statistics...'
      },
      {
        name: 'Sync Status',
        status: 'pending',
        message: 'Getting sync status...'
      },
      {
        name: 'RAG Pipeline Connection',
        status: 'pending',
        message: 'Testing RAG pipeline...'
      },
      {
        name: 'RAG Pipeline Statistics',
        status: 'pending',
        message: 'Getting statistics...'
      }
    ]

    setResults([...tests])

    // Test 1: Google Drive Connection
    try {
      const connectionTest = await googleDriveService.testConnection()
      tests[0] = {
        name: 'Google Drive Connection',
        status: connectionTest.success ? 'success' : 'error',
        message: connectionTest.message,
        details: connectionTest.details as Record<string, unknown> | undefined
      }
      setResults([...tests])
    } catch (error) {
      tests[0] = {
        name: 'Google Drive Connection',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      setResults([...tests])
    }

    // Test 2: Google Drive Statistics
    try {
      const statsResponse = await googleDriveService.getStats()
      tests[1] = {
        name: 'Google Drive Statistics',
        status: statsResponse.success ? 'success' : 'error',
        message: statsResponse.success ? 'Statistics retrieved successfully' : `Error: ${statsResponse.message}`,
        details: statsResponse.details as Record<string, unknown> | undefined
      }
      setResults([...tests])
    } catch (error) {
      tests[1] = {
        name: 'Google Drive Statistics',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      setResults([...tests])
    }

    // Test 3: Sync Status
    try {
      const syncResponse = await googleDriveService.getSyncStatus()
      tests[2] = {
        name: 'Sync Status',
        status: syncResponse.success ? 'success' : 'error',
        message: syncResponse.success ? 'Sync status retrieved successfully' : `Error: ${syncResponse.message}`,
        details: syncResponse.details as Record<string, unknown> | undefined
      }
      setResults([...tests])
    } catch (error) {
      tests[2] = {
        name: 'Sync Status',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      setResults([...tests])
    }

    // Test 4: RAG Pipeline Connection
    try {
      const ragConnectionTest = await ragPipelineService.testConnection()
      tests[3] = {
        name: 'RAG Pipeline Connection',
        status: ragConnectionTest.success ? 'success' : 'error',
        message: ragConnectionTest.message,
        details: ragConnectionTest.details as Record<string, unknown> | undefined
      }
      setResults([...tests])
    } catch (error) {
      tests[3] = {
        name: 'RAG Pipeline Connection',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      setResults([...tests])
    }

    // Test 5: RAG Pipeline Statistics
    try {
      const statsResponse = await ragPipelineService.getStats()
      tests[4] = {
        name: 'RAG Pipeline Statistics',
        status: statsResponse.success ? 'success' : 'error',
        message: statsResponse.success ? 'Statistics retrieved successfully' : `Error: ${statsResponse.message}`,
        details: statsResponse.details as Record<string, unknown> | undefined
      }
      setResults([...tests])
    } catch (error) {
      tests[4] = {
        name: 'RAG Pipeline Statistics',
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      setResults([...tests])
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Google Drive & RAG Pipeline Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection to Google Drive and RAG pipeline services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Connection Tests'
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {results.map((result, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Test Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tests Google Drive API connection via backend</li>
              <li>• Tests RAG pipeline connection and health</li>
              <li>• Retrieves statistics and sync status</li>
              <li>• Requires backend API to be running on port 8001</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
