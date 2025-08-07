import fs from 'fs'
import path from 'path'
import { User } from './userStore'
import { S3Service } from './s3Service'

// Hybrid User Store - supports both local files and S3
export class HybridUserStore {
  private static users: User[] = []
  private static isLoaded = false
  private static readonly USERS_FILE = path.join(process.cwd(), 'users.json')
  private static readonly USE_S3 = process.env.USE_S3_STORAGE === 'true'

  // Initialize the store
  static async initialize(): Promise<void> {
    if (this.isLoaded) return

    console.log(`🔄 Initializing HybridUserStore (S3: ${this.USE_S3})`)

    if (this.USE_S3 && S3Service.isConfigured()) {
      await this.loadFromS3()
    } else {
      this.loadFromLocal()
    }

    this.isLoaded = true
    console.log(`✅ HybridUserStore initialized with ${this.users.length} users`)
  }

  // Load users from S3
  private static async loadFromS3(): Promise<void> {
    try {
      this.users = await S3Service.loadAllUsers()
      console.log(`📥 Loaded ${this.users.length} users from S3`)
    } catch (error) {
      console.error('❌ Failed to load from S3, falling back to local:', error)
      this.loadFromLocal()
    }
  }

  // Load users from local file
  private static loadFromLocal(): void {
    try {
      if (fs.existsSync(this.USERS_FILE)) {
        const data = fs.readFileSync(this.USERS_FILE, 'utf8')
        this.users = JSON.parse(data)
        console.log(`📁 Loaded ${this.users.length} users from local file`)
      } else {
        this.users = []
        console.log('📄 No local users file found, starting fresh')
      }
    } catch (error) {
      console.error('❌ Error loading local users:', error)
      this.users = []
    }
  }

  // Save users to storage
  private static async saveUsers(): Promise<void> {
    if (this.USE_S3 && S3Service.isConfigured()) {
      await this.saveToS3()
    } else {
      this.saveToLocal()
    }
  }

  // Save users to S3 (individual user files)
  private static async saveToS3(): Promise<void> {
    try {
      // Save each user individually for better performance
      const savePromises = this.users.map(user => S3Service.saveUser(user))
      await Promise.all(savePromises)
      
      // Also create a backup periodically
      if (Math.random() < 0.1) { // 10% chance to create backup
        await S3Service.createBackup(this.users)
      }
      
      console.log(`☁️ Saved ${this.users.length} users to S3`)
    } catch (error) {
      console.error('❌ Failed to save to S3, falling back to local:', error)
      this.saveToLocal()
    }
  }

  // Save users to local file
  private static saveToLocal(): void {
    try {
      fs.writeFileSync(this.USERS_FILE, JSON.stringify(this.users, null, 2))
      console.log(`💾 Saved ${this.users.length} users to local file`)
    } catch (error) {
      console.error('❌ Error saving local users:', error)
    }
  }

  // Public API methods
  static async getAll(): Promise<User[]> {
    await this.initialize()
    return [...this.users] // Return copy to prevent external modification
  }

  static async findById(id: string): Promise<User | undefined> {
    await this.initialize()
    return this.users.find(u => u.id === id)
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    await this.initialize()
    return this.users.find(u => u.email === email)
  }

  static async create(userData: { id?: string, email: string, password: string, name: string, profile?: Partial<User['profile']> }): Promise<User> {
    await this.initialize()
    
    const user: User = {
      id: userData.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      profile: {
        ...userData.profile,
        dateJoined: userData.profile?.dateJoined || new Date().toISOString(),
        lastActive: new Date().toISOString(),
        preferences: {
          focusAreas: userData.profile?.preferences?.focusAreas || [],
          notificationSettings: {
            ...userData.profile?.preferences?.notificationSettings,
            dailyReminders: userData.profile?.preferences?.notificationSettings?.dailyReminders ?? true,
            weeklyCheckins: userData.profile?.preferences?.notificationSettings?.weeklyCheckins ?? true,
            emergencyResources: userData.profile?.preferences?.notificationSettings?.emergencyResources ?? true
          },
          privacySettings: {
            ...userData.profile?.preferences?.privacySettings,
            shareProgress: userData.profile?.preferences?.privacySettings?.shareProgress ?? false,
            anonymousMode: userData.profile?.preferences?.privacySettings?.anonymousMode ?? false
          }
        },
        mentalHealthData: {
          ...userData.profile?.mentalHealthData,
          favoriteResources: userData.profile?.mentalHealthData?.favoriteResources || [],
          moodTracking: userData.profile?.mentalHealthData?.moodTracking || [],
          achievements: userData.profile?.mentalHealthData?.achievements || [],
          weeklyCheckins: userData.profile?.mentalHealthData?.weeklyCheckins || [],
          chatHistory: userData.profile?.mentalHealthData?.chatHistory || []
        }
      }
    }

    this.users.push(user)
    await this.saveUsers()
    return user
  }

  static async update(userId: string, updates: Partial<User>): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false

    this.users[userIndex] = { ...this.users[userIndex], ...updates }
    this.users[userIndex].profile.lastActive = new Date().toISOString()
    
    await this.saveUsers()
    return true
  }

  static async updateProfile(userId: string, profileUpdates: Partial<User['profile']>): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false

    this.users[userIndex].profile = {
      ...this.users[userIndex].profile,
      ...profileUpdates,
      lastActive: new Date().toISOString()
    }
    
    await this.saveUsers()
    return true
  }

  static async updateLastActive(userId: string): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false

    this.users[userIndex].profile.lastActive = new Date().toISOString()
    await this.saveUsers()
    return true
  }

  // Mental health data operations
  static async addMoodEntry(userId: string, moodData: Omit<User['profile']['mentalHealthData']['moodTracking'][0], 'date'>): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    // Ensure structure exists
    if (!this.users[userIndex].profile.mentalHealthData) {
      this.users[userIndex].profile.mentalHealthData = {
        favoriteResources: [],
        moodTracking: [],
        achievements: [],
        weeklyCheckins: [],
        chatHistory: []
      }
    }
    
    if (!this.users[userIndex].profile.mentalHealthData.moodTracking) {
      this.users[userIndex].profile.mentalHealthData.moodTracking = []
    }
    
    const newMoodEntry = {
      ...moodData,
      date: new Date().toISOString()
    }
    
    this.users[userIndex].profile.mentalHealthData.moodTracking.push(newMoodEntry)
    this.users[userIndex].profile.lastActive = new Date().toISOString()
    await this.saveUsers()
    return true
  }

  static async addWeeklyCheckin(userId: string, checkinData: Omit<User['profile']['mentalHealthData']['weeklyCheckins'][0], 'date'>): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    // Ensure structure exists
    if (!this.users[userIndex].profile.mentalHealthData) {
      this.users[userIndex].profile.mentalHealthData = {
        favoriteResources: [],
        moodTracking: [],
        achievements: [],
        weeklyCheckins: [],
        chatHistory: []
      }
    }
    
    if (!this.users[userIndex].profile.mentalHealthData.weeklyCheckins) {
      this.users[userIndex].profile.mentalHealthData.weeklyCheckins = []
    }
    
    const newCheckinEntry = {
      ...checkinData,
      date: new Date().toISOString()
    }
    
    this.users[userIndex].profile.mentalHealthData.weeklyCheckins.push(newCheckinEntry)
    this.users[userIndex].profile.lastActive = new Date().toISOString()
    await this.saveUsers()
    return true
  }

  // Chat history operations
  static async createChatSession(userId: string, title: string): Promise<string | null> {
    try {
      console.log('=== HybridUserStore.createChatSession DEBUG ===')
      console.log('Input:', { userId, title })
      
      await this.initialize()
      console.log('✅ Store initialized')
      
      const userIndex = this.users.findIndex(u => u.id === userId)
      console.log('User index found:', userIndex)
      
      if (userIndex === -1) {
        console.log('❌ User not found in store')
        console.log('Available user IDs:', this.users.map(u => u.id))
        return null
      }
      
      console.log('✅ User found at index:', userIndex)
      
      // Ensure structure exists
      if (!this.users[userIndex].profile.mentalHealthData) {
        console.log('Creating mentalHealthData structure')
        this.users[userIndex].profile.mentalHealthData = {
          favoriteResources: [],
          moodTracking: [],
          achievements: [],
          weeklyCheckins: [],
          chatHistory: []
        }
      }
      
      if (!this.users[userIndex].profile.mentalHealthData.chatHistory) {
        console.log('Creating chatHistory array')
        this.users[userIndex].profile.mentalHealthData.chatHistory = []
      }
      
      const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('Generated session ID:', sessionId)
      
      const newSession = {
        id: sessionId,
        title,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messages: []
      }
      
      console.log('Created session object:', newSession)
      
      this.users[userIndex].profile.mentalHealthData.chatHistory.unshift(newSession)
      this.users[userIndex].profile.lastActive = new Date().toISOString()
      
      console.log('Session added to user data, saving...')
      await this.saveUsers()
      console.log('✅ Users saved successfully')
      
      return sessionId
    } catch (error) {
      console.error('❌ Error in createChatSession:', error)
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      return null
    }
  }

  static async saveChatMessage(userId: string, sessionId: string, message: { id: string, role: 'user' | 'assistant', content: string, timestamp: string }): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    if (!this.users[userIndex].profile.mentalHealthData?.chatHistory) return false
    
    const sessionIndex = this.users[userIndex].profile.mentalHealthData.chatHistory.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) return false
    
    this.users[userIndex].profile.mentalHealthData.chatHistory[sessionIndex].messages.push(message)
    this.users[userIndex].profile.mentalHealthData.chatHistory[sessionIndex].lastMessageAt = new Date().toISOString()
    this.users[userIndex].profile.lastActive = new Date().toISOString()
    await this.saveUsers()
    return true
  }

  static async getChatHistory(userId: string): Promise<User['profile']['mentalHealthData']['chatHistory']> {
    await this.initialize()
    
    const user = this.users.find(u => u.id === userId)
    return user?.profile?.mentalHealthData?.chatHistory || []
  }

  static async getChatSession(userId: string, sessionId: string): Promise<User['profile']['mentalHealthData']['chatHistory'][0] | null> {
    await this.initialize()
    
    const user = this.users.find(u => u.id === userId)
    if (!user?.profile?.mentalHealthData?.chatHistory) return null
    
    return user.profile.mentalHealthData.chatHistory.find(s => s.id === sessionId) || null
  }

  static async deleteChatSession(userId: string, sessionId: string): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    if (!this.users[userIndex].profile.mentalHealthData?.chatHistory) return false
    
    const sessionIndex = this.users[userIndex].profile.mentalHealthData.chatHistory.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) return false
    
    this.users[userIndex].profile.mentalHealthData.chatHistory.splice(sessionIndex, 1)
    this.users[userIndex].profile.lastActive = new Date().toISOString()
    await this.saveUsers()
    return true
  }

  static async updateChatSessionTitle(userId: string, sessionId: string, title: string): Promise<boolean> {
    await this.initialize()
    
    const userIndex = this.users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    if (!this.users[userIndex].profile.mentalHealthData?.chatHistory) return false
    
    const sessionIndex = this.users[userIndex].profile.mentalHealthData.chatHistory.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) return false
    
    this.users[userIndex].profile.mentalHealthData.chatHistory[sessionIndex].title = title
    this.users[userIndex].profile.lastActive = new Date().toISOString()
    await this.saveUsers()
    return true
  }

  // Migration and admin operations
  static async migrateToS3(): Promise<boolean> {
    if (!S3Service.isConfigured()) {
      console.error('❌ S3 not configured for migration')
      return false
    }

    console.log('🔄 Starting migration to S3...')
    
    try {
      // Load from local if not already loaded
      if (!this.isLoaded) {
        this.loadFromLocal()
      }

      // Save each user to S3
      const savePromises = this.users.map(user => S3Service.saveUser(user))
      await Promise.all(savePromises)

      // Create a backup
      await S3Service.createBackup(this.users)

      console.log(`✅ Successfully migrated ${this.users.length} users to S3`)
      return true
    } catch (error) {
      console.error('❌ Migration to S3 failed:', error)
      return false
    }
  }

  static async getStorageInfo(): Promise<{
    storageType: 'local' | 's3'
    isConfigured: boolean
    userCount: number
    lastSync?: string
  }> {
    await this.initialize()
    
    return {
      storageType: this.USE_S3 ? 's3' : 'local',
      isConfigured: this.USE_S3 ? S3Service.isConfigured() : true,
      userCount: this.users.length,
      lastSync: new Date().toISOString()
    }
  }
} 