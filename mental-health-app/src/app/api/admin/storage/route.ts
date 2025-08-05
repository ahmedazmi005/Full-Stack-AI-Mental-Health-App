import { NextRequest, NextResponse } from 'next/server'
import { HybridUserStore } from '../../../lib/hybridUserStore'
import { S3Service } from '../../../lib/s3Service'

// GET - Get storage information and health check
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (action === 'health') {
      // S3 Health Check
      const s3Health = await S3Service.healthCheck()
      const storageInfo = await HybridUserStore.getStorageInfo()

      return NextResponse.json({
        s3Health,
        storageInfo,
        timestamp: new Date().toISOString()
      })
    }

    // Default: Get storage info
    const storageInfo = await HybridUserStore.getStorageInfo()
    return NextResponse.json(storageInfo)

  } catch (error) {
    console.error('❌ Storage info error:', error)
    return NextResponse.json(
      { error: `Failed to get storage info: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// POST - Perform storage operations (migration, backup, etc.)
export async function POST(req: NextRequest) {
  try {
    const { action, ...params } = await req.json()

    switch (action) {
      case 'migrate-to-s3':
        if (!S3Service.isConfigured()) {
          return NextResponse.json(
            { error: 'S3 is not properly configured. Please check your AWS credentials.' },
            { status: 400 }
          )
        }

        console.log('🔄 Starting migration to S3...')
        const migrationSuccess = await HybridUserStore.migrateToS3()
        
        if (migrationSuccess) {
          return NextResponse.json({
            success: true,
            message: 'Successfully migrated data to S3',
            timestamp: new Date().toISOString()
          })
        } else {
          return NextResponse.json(
            { error: 'Migration to S3 failed. Check server logs for details.' },
            { status: 500 }
          )
        }

      case 'create-backup':
        if (!S3Service.isConfigured()) {
          return NextResponse.json(
            { error: 'S3 is not configured for backups' },
            { status: 400 }
          )
        }

        const users = await HybridUserStore.getAll()
        const backupSuccess = await S3Service.createBackup(users)
        
        if (backupSuccess) {
          return NextResponse.json({
            success: true,
            message: `Successfully created backup of ${users.length} users`,
            userCount: users.length,
            timestamp: new Date().toISOString()
          })
        } else {
          return NextResponse.json(
            { error: 'Backup creation failed' },
            { status: 500 }
          )
        }

      case 'test-s3-connection':
        const healthCheck = await S3Service.healthCheck()
        return NextResponse.json({
          success: healthCheck.status === 'healthy',
          healthCheck,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ Storage operation error:', error)
    return NextResponse.json(
      { error: `Storage operation failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// PUT - Update storage configuration
export async function PUT(req: NextRequest) {
  try {
    const { storageType } = await req.json()

    if (storageType === 's3' && !S3Service.isConfigured()) {
      return NextResponse.json(
        { error: 'Cannot switch to S3: AWS credentials not configured' },
        { status: 400 }
      )
    }

    // Note: In a real application, you'd want to update environment variables
    // or a configuration file. For now, we'll just return the current status.
    const storageInfo = await HybridUserStore.getStorageInfo()
    
    return NextResponse.json({
      message: `Storage type change requested to: ${storageType}`,
      currentStorage: storageInfo,
      note: 'To switch storage types, update the USE_S3_STORAGE environment variable and restart the application.',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Storage configuration error:', error)
    return NextResponse.json(
      { error: `Failed to update storage configuration: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 