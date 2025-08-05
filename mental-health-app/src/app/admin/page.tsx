'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'

interface StorageInfo {
  storageType: 'local' | 's3'
  isConfigured: boolean
  userCount: number
  lastSync?: string
}

interface S3Health {
  status: 'healthy' | 'unhealthy'
  details: any
}

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [s3Health, setS3Health] = useState<S3Health | null>(null)
  const [isOperating, setIsOperating] = useState(false)
  const [operationResult, setOperationResult] = useState<string | null>(null)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Load storage information
  useEffect(() => {
    if (isAuthenticated) {
      loadStorageInfo()
    }
  }, [isAuthenticated])

  const loadStorageInfo = async () => {
    try {
      const response = await fetch('/api/admin/storage')
      if (response.ok) {
        const data = await response.json()
        setStorageInfo(data)
      }
    } catch (error) {
      console.error('Failed to load storage info:', error)
    }
  }

  const loadHealthCheck = async () => {
    try {
      const response = await fetch('/api/admin/storage?action=health')
      if (response.ok) {
        const data = await response.json()
        setStorageInfo(data.storageInfo)
        setS3Health(data.s3Health)
      }
    } catch (error) {
      console.error('Failed to load health check:', error)
    }
  }

  const performOperation = async (action: string) => {
    setIsOperating(true)
    setOperationResult(null)

    try {
      const response = await fetch('/api/admin/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (response.ok) {
        setOperationResult(`✅ ${data.message || 'Operation completed successfully'}`)
        loadStorageInfo() // Refresh storage info
      } else {
        setOperationResult(`❌ ${data.error || 'Operation failed'}`)
      }
    } catch (error) {
      setOperationResult(`❌ Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsOperating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
          <p className="text-amber-800 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      <Navigation />
      
      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200">
              <h1 className="text-3xl font-bold text-amber-900 mb-2">
                🔧 Admin Dashboard
              </h1>
              <p className="text-amber-800">
                Manage storage, backups, and system health
              </p>
            </div>
          </div>

          {/* Storage Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-900">Storage Information</h2>
              <button
                onClick={loadStorageInfo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                🔄 Refresh
              </button>
            </div>

            {storageInfo ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-amber-900">Storage Type:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      storageInfo.storageType === 's3' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {storageInfo.storageType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-amber-900">Configured:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      storageInfo.isConfigured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {storageInfo.isConfigured ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-amber-900">User Count:</span>
                    <span className="text-amber-800 font-bold">{storageInfo.userCount}</span>
                  </div>
                  {storageInfo.lastSync && (
                    <div className="flex justify-between">
                      <span className="font-medium text-amber-900">Last Sync:</span>
                      <span className="text-amber-700 text-sm">
                        {new Date(storageInfo.lastSync).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto"></div>
                <p className="text-amber-700 mt-2">Loading storage information...</p>
              </div>
            )}
          </div>

          {/* S3 Health Check */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-900">S3 Health Check</h2>
              <button
                onClick={loadHealthCheck}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                🏥 Check Health
              </button>
            </div>

            {s3Health ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className={`w-4 h-4 rounded-full ${
                    s3Health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium text-amber-900">
                    Status: {s3Health.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">Details:</h4>
                  <pre className="text-sm text-amber-800 overflow-auto">
                    {JSON.stringify(s3Health.details, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-amber-700">Click "Check Health" to test S3 connection</p>
            )}
          </div>

          {/* Operations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200 mb-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Storage Operations</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => performOperation('migrate-to-s3')}
                disabled={isOperating || storageInfo?.storageType === 's3'}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                {isOperating ? '⏳ Processing...' : '☁️ Migrate to S3'}
              </button>

              <button
                onClick={() => performOperation('create-backup')}
                disabled={isOperating}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                {isOperating ? '⏳ Processing...' : '💾 Create Backup'}
              </button>

              <button
                onClick={() => performOperation('test-s3-connection')}
                disabled={isOperating}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                {isOperating ? '⏳ Processing...' : '🔌 Test S3 Connection'}
              </button>

              <div className="flex items-center justify-center">
                <span className="text-amber-700 text-sm">More operations coming soon...</span>
              </div>
            </div>
          </div>

          {/* Operation Result */}
          {operationResult && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-3">Operation Result</h3>
              <div className={`p-4 rounded-lg ${
                operationResult.startsWith('✅') 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {operationResult}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
} 