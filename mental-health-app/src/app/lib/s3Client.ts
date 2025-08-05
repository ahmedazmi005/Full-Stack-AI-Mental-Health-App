import { S3Client } from '@aws-sdk/client-s3'

// Configure AWS S3 Client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

// S3 Configuration
export const S3_CONFIG = {
  BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'mental-health-app-data',
  USER_DATA_PREFIX: 'users/',
  CHAT_HISTORY_PREFIX: 'chat-history/',
  PROFILE_IMAGES_PREFIX: 'profile-images/',
  BACKUP_PREFIX: 'backups/',
}

// Helper function to generate S3 keys
export const generateS3Key = {
  userData: (userId: string) => `${S3_CONFIG.USER_DATA_PREFIX}${userId}.json`,
  chatHistory: (userId: string, sessionId: string) => `${S3_CONFIG.CHAT_HISTORY_PREFIX}${userId}/${sessionId}.json`,
  profileImage: (userId: string, fileName: string) => `${S3_CONFIG.PROFILE_IMAGES_PREFIX}${userId}/${fileName}`,
  backup: (timestamp: string) => `${S3_CONFIG.BACKUP_PREFIX}users-backup-${timestamp}.json`,
} 