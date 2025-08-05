import { 
  GetObjectCommand, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { s3Client, S3_CONFIG, generateS3Key } from './s3Client'
import { User } from './userStore'

// S3 Service for Mental Health App Data Storage
export class S3Service {
  
  // Check if S3 is properly configured
  static isConfigured(): boolean {
    return !!(
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_S3_BUCKET_NAME
    )
  }

  // Generic S3 operations
  static async uploadJSON(key: string, data: any): Promise<boolean> {
    try {
      const command = new PutObjectCommand({
        Bucket: S3_CONFIG.BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
        ServerSideEncryption: 'AES256', // Encrypt data at rest
      })
      
      await s3Client.send(command)
      console.log(`✅ Successfully uploaded to S3: ${key}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to upload to S3 (${key}):`, error)
      return false
    }
  }

  static async downloadJSON(key: string): Promise<any | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: S3_CONFIG.BUCKET_NAME,
        Key: key,
      })
      
      const response = await s3Client.send(command)
      const body = await response.Body?.transformToString()
      
      if (!body) return null
      
      console.log(`✅ Successfully downloaded from S3: ${key}`)
      return JSON.parse(body)
    } catch (error) {
      if ((error as any).name === 'NoSuchKey') {
        console.log(`📄 File not found in S3: ${key}`)
        return null
      }
      console.error(`❌ Failed to download from S3 (${key}):`, error)
      return null
    }
  }

  static async deleteObject(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: S3_CONFIG.BUCKET_NAME,
        Key: key,
      })
      
      await s3Client.send(command)
      console.log(`✅ Successfully deleted from S3: ${key}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to delete from S3 (${key}):`, error)
      return false
    }
  }

  static async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: S3_CONFIG.BUCKET_NAME,
        Key: key,
      })
      
      await s3Client.send(command)
      return true
    } catch (error) {
      return false
    }
  }

  // User-specific operations
  static async saveUser(user: User): Promise<boolean> {
    const key = generateS3Key.userData(user.id)
    return await this.uploadJSON(key, user)
  }

  static async loadUser(userId: string): Promise<User | null> {
    const key = generateS3Key.userData(userId)
    return await this.downloadJSON(key)
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const key = generateS3Key.userData(userId)
    return await this.deleteObject(key)
  }

  // Load all users (for migration or admin purposes)
  static async loadAllUsers(): Promise<User[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.BUCKET_NAME,
        Prefix: S3_CONFIG.USER_DATA_PREFIX,
      })
      
      const response = await s3Client.send(command)
      const users: User[] = []
      
      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key && object.Key.endsWith('.json')) {
            const userData = await this.downloadJSON(object.Key)
            if (userData) {
              users.push(userData)
            }
          }
        }
      }
      
      console.log(`✅ Loaded ${users.length} users from S3`)
      return users
    } catch (error) {
      console.error('❌ Failed to load all users from S3:', error)
      return []
    }
  }

  // Chat history operations
  static async saveChatSession(userId: string, sessionId: string, session: any): Promise<boolean> {
    const key = generateS3Key.chatHistory(userId, sessionId)
    return await this.uploadJSON(key, session)
  }

  static async loadChatSession(userId: string, sessionId: string): Promise<any | null> {
    const key = generateS3Key.chatHistory(userId, sessionId)
    return await this.downloadJSON(key)
  }

  static async deleteChatSession(userId: string, sessionId: string): Promise<boolean> {
    const key = generateS3Key.chatHistory(userId, sessionId)
    return await this.deleteObject(key)
  }

  // Backup operations
  static async createBackup(users: User[]): Promise<boolean> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const key = generateS3Key.backup(timestamp)
    
    const backupData = {
      timestamp: new Date().toISOString(),
      userCount: users.length,
      users: users,
      metadata: {
        version: '1.0',
        source: 'mental-health-app',
        environment: process.env.NODE_ENV || 'development'
      }
    }
    
    const success = await this.uploadJSON(key, backupData)
    if (success) {
      console.log(`✅ Created backup: ${key}`)
    }
    return success
  }

  // Profile image operations (for future use)
  static async uploadProfileImage(userId: string, file: Buffer, fileName: string, contentType: string): Promise<string | null> {
    try {
      const key = generateS3Key.profileImage(userId, fileName)
      
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: S3_CONFIG.BUCKET_NAME,
          Key: key,
          Body: file,
          ContentType: contentType,
          ServerSideEncryption: 'AES256',
        },
      })
      
      await upload.done()
      console.log(`✅ Successfully uploaded profile image: ${key}`)
      
      // Return the S3 URL (you might want to use CloudFront in production)
      return `https://${S3_CONFIG.BUCKET_NAME}.s3.amazonaws.com/${key}`
    } catch (error) {
      console.error('❌ Failed to upload profile image:', error)
      return null
    }
  }

  // Health check
  static async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy', details: any }> {
    try {
      // Try to list objects in the bucket (minimal operation)
      const command = new ListObjectsV2Command({
        Bucket: S3_CONFIG.BUCKET_NAME,
        MaxKeys: 1,
      })
      
      const response = await s3Client.send(command)
      
      return {
        status: 'healthy',
        details: {
          bucket: S3_CONFIG.BUCKET_NAME,
          region: process.env.AWS_REGION,
          configured: this.isConfigured(),
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          configured: this.isConfigured(),
          timestamp: new Date().toISOString()
        }
      }
    }
  }
} 