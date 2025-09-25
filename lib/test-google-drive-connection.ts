/**
 * Test Google Drive Connection
 * TypeScript test script for Google Drive integration
 */

import { GoogleDriveService } from './services/google-drive-service'
import { RAGPipelineService } from './services/rag-pipeline-service'

async function testGoogleDriveConnection() {
  console.log('🚀 Testing Google Drive Connection...\n')

  // Initialize services
  const googleDriveService = new GoogleDriveService()
  const ragPipelineService = new RAGPipelineService()
  
  try {
    // Test 1: Test Google Drive connection via backend API
    console.log('1️⃣ Testing Google Drive connection via backend API...')
    const connectionTest = await googleDriveService.testConnection()
    
    if (connectionTest.success) {
      console.log('✅ Google Drive connection successful!')
      console.log('📊 Details:', JSON.stringify(connectionTest.details, null, 2))
    } else {
      console.log('❌ Google Drive connection failed:', connectionTest.message)
      console.log('🔍 Error details:', connectionTest.details)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 2: Get Google Drive statistics
    console.log('2️⃣ Getting Google Drive statistics...')
    const statsResponse = await googleDriveService.getStats()
    
    if (statsResponse.success) {
      console.log('✅ Statistics retrieved successfully!')
      console.log('📈 Stats:', JSON.stringify(statsResponse.details, null, 2))
    } else {
      console.log('❌ Failed to get statistics:', statsResponse.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 3: Get sync status
    console.log('3️⃣ Getting sync status...')
    const syncStatusResponse = await googleDriveService.getSyncStatus()
    
    if (syncStatusResponse.success) {
      console.log('✅ Sync status retrieved successfully!')
      console.log('🔄 Sync Status:', JSON.stringify(syncStatusResponse.details, null, 2))
    } else {
      console.log('❌ Failed to get sync status:', syncStatusResponse.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 4: Test RAG pipeline connection
    const ragConnectionTest = await ragPipelineService.testConnection()
    
    
    if (ragConnectionTest.success) {
      console.log('✅ RAG pipeline connection successful!')
      console.log('🧠 Details:', JSON.stringify(ragConnectionTest.details, null, 2))
    } else {
      console.log('❌ RAG pipeline connection failed:', ragConnectionTest.message)
      console.log('🔍 Error details:', ragConnectionTest.details)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 5: Get RAG pipeline configuration
    // console.log('5️⃣ Getting RAG pipeline configuration...')
    // const ragConfigResponse = await ragPipelineService.getConfig()
    
    // if (ragConfigResponse.success) {
    //   console.log('✅ RAG pipeline configuration retrieved successfully!')
    //   console.log('⚙️ Config:', JSON.stringify(ragConfigResponse.details, null, 2))
    // } else {
    //   console.log('❌ Failed to get RAG pipeline configuration:', ragConfigResponse.message)
    // }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 6: Get Google Drive watcher configuration
    // console.log('6️⃣ Getting Google Drive watcher configuration...')
    // const watcherResponse = await googleDriveService.getGoogleDriveWatcher()
    
    // if (watcherResponse.success) {
    //   console.log('✅ Google Drive watcher configuration retrieved successfully!')
    //   console.log('👀 Watcher Config:', JSON.stringify(watcherResponse.details, null, 2))
    // } else {
    //   console.log('❌ Failed to get Google Drive watcher configuration:', watcherResponse.message)
    // }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 7: Get documents (if any exist)
    console.log('7️⃣ Getting documents...')
    const documentsResponse = await googleDriveService.getDocuments({ limit: 5 })
    
    if (documentsResponse.success) {
      console.log('✅ Documents retrieved successfully!')
      console.log('📄 Documents:', JSON.stringify(documentsResponse.details, null, 2))
    } else {
      console.log('❌ Failed to get documents:', documentsResponse.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 8: Get folder structure
    console.log('8️⃣ Getting folder structure...')
    const folderResponse = await googleDriveService.getFolderStructure()
    
    if (folderResponse.success) {
      console.log('✅ Folder structure retrieved successfully!')
      console.log('📁 Folder Structure:', JSON.stringify(folderResponse.details, null, 2))
    } else {
      console.log('❌ Failed to get folder structure:', folderResponse.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 9: Get RAG pipeline health
    // console.log('9️⃣ Getting RAG pipeline health...')
    // const healthResponse = await ragPipelineService.getHealth()
    
    // if (healthResponse.success) {
    //   console.log('✅ RAG pipeline health retrieved successfully!')
    //   console.log('🏥 Health Status:', JSON.stringify(healthResponse.details, null, 2))
    // } else {
    //   console.log('❌ Failed to get RAG pipeline health:', healthResponse.message)
    // }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 10: Get RAG pipeline metrics
    console.log('🔟 Getting RAG pipeline stats...')
    const metricsResponse = await ragPipelineService.getStats()
    
    if (metricsResponse.success) {
      console.log('✅ RAG pipeline stats retrieved successfully!')
      console.log('📊 Stats:', JSON.stringify(metricsResponse.details, null, 2))
    } else {
      console.log('❌ Failed to get RAG pipeline stats:', metricsResponse.message)
    }

    console.log('\n🎉 All tests completed!')

  } catch (error) {
    console.error('💥 Test failed with error:', error)
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGoogleDriveConnection()
    .then(() => {
      console.log('✅ Test script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Test script failed:', error)
      process.exit(1)
    })
}

export { testGoogleDriveConnection }
