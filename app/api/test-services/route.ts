/**
 * Test Services API Route
 * Tests both Google Drive and RAG Pipeline standalone services
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleDriveService } from '@/lib/services/google-drive-service'
import { RAGPipelineService } from '@/lib/services/rag-pipeline-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service')
    const action = searchParams.get('action')

    if (!service || !action) {
      return NextResponse.json({
        success: false,
        error: 'Missing service or action parameter',
        availableServices: ['google-drive', 'rag-pipeline'],
        availableActions: {
          'google-drive': ['test-connection', 'get-stats', 'get-sync-status'],
          'rag-pipeline': ['test-connection', 'get-stats', 'add-document', 'query']
        }
      }, { status: 400 })
    }

    let result: unknown

    if (service === 'google-drive') {
      const googleDriveService = new GoogleDriveService()
      
      switch (action) {
        case 'test-connection':
          result = await googleDriveService.testConnection()
          break
        case 'get-stats':
          result = await googleDriveService.getStats()
          break
        case 'get-sync-status':
          result = await googleDriveService.getSyncStatus()
          break
        default:
          return NextResponse.json({
            success: false,
            error: `Unknown action: ${action}`,
            availableActions: ['test-connection', 'get-stats', 'get-sync-status']
          }, { status: 400 })
      }
    } else if (service === 'rag-pipeline') {
      const ragPipelineService = new RAGPipelineService()
      
      switch (action) {
        case 'test-connection':
          result = await ragPipelineService.testConnection()
          break
        case 'get-stats':
          result = await ragPipelineService.getStats()
          break
        case 'add-document':
          const content = searchParams.get('content') || 'This is a test document for the RAG pipeline.'
          result = await ragPipelineService.addDocument(content, {
            source: 'api-test',
            document_type: 'test'
          })
          break
        case 'query':
          const query = searchParams.get('query') || 'What is this document about?'
          result = await ragPipelineService.query(query)
          break
        default:
          return NextResponse.json({
            success: false,
            error: `Unknown action: ${action}`,
            availableActions: ['test-connection', 'get-stats', 'add-document', 'query']
          }, { status: 400 })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: `Unknown service: ${service}`,
        availableServices: ['google-drive', 'rag-pipeline']
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      service,
      action,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test services API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, action, data } = body

    if (!service || !action) {
      return NextResponse.json({
        success: false,
        error: 'Missing service or action in request body'
      }, { status: 400 })
    }

    let result: unknown

    if (service === 'rag-pipeline') {
      const ragPipelineService = new RAGPipelineService()
      
      switch (action) {
        case 'add-document':
          if (!data?.content) {
            return NextResponse.json({
              success: false,
              error: 'Missing content in request data'
            }, { status: 400 })
          }
          result = await ragPipelineService.addDocument(data.content, data.metadata || {})
          break
        case 'query':
          if (!data?.query) {
            return NextResponse.json({
              success: false,
              error: 'Missing query in request data'
            }, { status: 400 })
          }
          result = await ragPipelineService.query(data.query, data.options || {})
          break
        default:
          return NextResponse.json({
            success: false,
            error: `Unknown action: ${action}`
          }, { status: 400 })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: `Service ${service} does not support POST requests`
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      service,
      action,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Test services API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
