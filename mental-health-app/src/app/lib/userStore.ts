import fs from 'fs'
import path from 'path'

// Enhanced user store with profile and mental health tracking
export interface User {
  id: string
  email: string
  password: string
  name: string
  
  // Profile information
  profile: {
    dateJoined: string
    lastActive: string
    bio?: string
    profilePicture?: string
    
    // Mental health preferences
    preferences: {
      focusAreas: string[] // e.g., ['anxiety', 'depression', 'stress']
      notificationSettings: {
        dailyReminders: boolean
        weeklyCheckins: boolean
        emergencyResources: boolean
      }
      privacySettings: {
        shareProgress: boolean
        anonymousMode: boolean
      }
    }
    
    // Mental health tracking
    mentalHealthData: {
      favoriteResources: {
        id: string
        type: 'condition' | 'article' | 'exercise' | 'resource'
        title: string
        url?: string
        dateAdded: string
      }[]
      
      moodTracking: {
        date: string
        mood: number // 1-10 scale
        notes?: string
        triggers?: string[]
        copingStrategies?: string[]
      }[]
      
      achievements: {
        id: string
        title: string
        description: string
        icon: string
        dateEarned: string
        category: 'consistency' | 'progress' | 'milestones' | 'engagement'
      }[]
      
      weeklyCheckins: {
        date: string
        overallMood: number
        sleepQuality: number
        stressLevel: number
        exerciseFrequency: number
        socialConnection: number
        notes?: string
        improvements?: string[]
        challenges?: string[]
      }[]
      
      chatHistory: {
        id: string
        title: string
        createdAt: string
        lastMessageAt: string
        messages: {
          id: string
          role: 'user' | 'assistant'
          content: string
          timestamp: string
        }[]
        summary?: string
      }[]
    }
  }
}

const USERS_FILE = path.join(process.cwd(), 'users.json')

// Load users from file
function loadUsers(): User[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
  return []
}

// Save users to file
function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving users:', error)
  }
}

// Initialize users from file
let users: User[] = loadUsers()

// Create default profile for new users
function createDefaultProfile(): User['profile'] {
  return {
    dateJoined: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      focusAreas: [],
      notificationSettings: {
        dailyReminders: true,
        weeklyCheckins: true,
        emergencyResources: true
      },
      privacySettings: {
        shareProgress: false,
        anonymousMode: false
      }
    },
            mentalHealthData: {
          favoriteResources: [],
          moodTracking: [],
          achievements: [],
          weeklyCheckins: [],
          chatHistory: []
        }
  }
}

export const userStore = {
  // Get all users (for debugging - remove in production)
  getAll: (): User[] => users,
  
  // Find user by email
  findByEmail: (email: string): User | undefined => {
    return users.find(u => u.email === email)
  },
  
  // Find user by ID
  findById: (id: string): User | undefined => {
    return users.find(u => u.id === id)
  },
  
  // Add new user
  create: (user: Omit<User, 'profile'>): User => {
    const newUser: User = {
      ...user,
      profile: createDefaultProfile()
    }
    users.push(newUser)
    saveUsers(users) // Persist to file
    console.log('User created:', { email: newUser.email, name: newUser.name, id: newUser.id })
    console.log('Total users:', users.length)
    return newUser
  },
  
  // Update user profile
  updateProfile: (userId: string, profileUpdates: Partial<User['profile']>): User | null => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return null
    
    users[userIndex].profile = {
      ...users[userIndex].profile,
      ...profileUpdates,
      lastActive: new Date().toISOString()
    }
    
    saveUsers(users)
    return users[userIndex]
  },
  
  // Update last active timestamp
  updateLastActive: (userId: string): void => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users[userIndex].profile.lastActive = new Date().toISOString()
      saveUsers(users)
    }
  },
  
  // Add favorite resource
  addFavoriteResource: (userId: string, resource: Omit<User['profile']['mentalHealthData']['favoriteResources'][0], 'dateAdded'>): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    const newResource = {
      ...resource,
      dateAdded: new Date().toISOString()
    }
    
    users[userIndex].profile.mentalHealthData.favoriteResources.push(newResource)
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },
  
  // Remove favorite resource
  removeFavoriteResource: (userId: string, resourceId: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    users[userIndex].profile.mentalHealthData.favoriteResources = 
      users[userIndex].profile.mentalHealthData.favoriteResources.filter(r => r.id !== resourceId)
    
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },
  
  // Add mood entry
  addMoodEntry: (userId: string, moodData: Omit<User['profile']['mentalHealthData']['moodTracking'][0], 'date'>): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    // Ensure profile structure exists for older users
    if (!users[userIndex].profile.mentalHealthData) {
      users[userIndex].profile.mentalHealthData = {
        favoriteResources: [],
        moodTracking: [],
        achievements: [],
        weeklyCheckins: [],
        chatHistory: []
      }
    }
    
    if (!users[userIndex].profile.mentalHealthData.moodTracking) {
      users[userIndex].profile.mentalHealthData.moodTracking = []
    }
    
    const newMoodEntry = {
      ...moodData,
      date: new Date().toISOString()
    }
    
    users[userIndex].profile.mentalHealthData.moodTracking.push(newMoodEntry)
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },

  // Add weekly check-in
  addWeeklyCheckin: (userId: string, checkinData: Omit<User['profile']['mentalHealthData']['weeklyCheckins'][0], 'date'>): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    // Ensure profile structure exists for older users
    if (!users[userIndex].profile.mentalHealthData) {
      users[userIndex].profile.mentalHealthData = {
        favoriteResources: [],
        moodTracking: [],
        achievements: [],
        weeklyCheckins: [],
        chatHistory: []
      }
    }
    
    if (!users[userIndex].profile.mentalHealthData.weeklyCheckins) {
      users[userIndex].profile.mentalHealthData.weeklyCheckins = []
    }
    
    const newCheckinEntry = {
      ...checkinData,
      date: new Date().toISOString()
    }
    
    users[userIndex].profile.mentalHealthData.weeklyCheckins.push(newCheckinEntry)
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },

  // Chat history methods
  createChatSession: (userId: string, title: string): string | null => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return null
    
    // Ensure profile structure exists for older users
    if (!users[userIndex].profile.mentalHealthData) {
      users[userIndex].profile.mentalHealthData = {
        favoriteResources: [],
        moodTracking: [],
        achievements: [],
        weeklyCheckins: [],
        chatHistory: []
      }
    }
    
    if (!users[userIndex].profile.mentalHealthData.chatHistory) {
      users[userIndex].profile.mentalHealthData.chatHistory = []
    }
    
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newSession = {
      id: sessionId,
      title,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messages: []
    }
    
    users[userIndex].profile.mentalHealthData.chatHistory.unshift(newSession) // Add to beginning
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return sessionId
  },

  saveChatMessage: (userId: string, sessionId: string, message: { id: string, role: 'user' | 'assistant', content: string, timestamp: string }): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    // Ensure chat history exists
    if (!users[userIndex].profile.mentalHealthData?.chatHistory) {
      return false
    }
    
    const sessionIndex = users[userIndex].profile.mentalHealthData.chatHistory.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) return false
    
    users[userIndex].profile.mentalHealthData.chatHistory[sessionIndex].messages.push(message)
    users[userIndex].profile.mentalHealthData.chatHistory[sessionIndex].lastMessageAt = new Date().toISOString()
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },

  getChatHistory: (userId: string): User['profile']['mentalHealthData']['chatHistory'] => {
    const user = users.find(u => u.id === userId)
    return user?.profile?.mentalHealthData?.chatHistory || []
  },

  getChatSession: (userId: string, sessionId: string): User['profile']['mentalHealthData']['chatHistory'][0] | null => {
    const user = users.find(u => u.id === userId)
    if (!user?.profile?.mentalHealthData?.chatHistory) return null
    
    return user.profile.mentalHealthData.chatHistory.find(s => s.id === sessionId) || null
  },

  deleteChatSession: (userId: string, sessionId: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    if (!users[userIndex].profile.mentalHealthData?.chatHistory) return false
    
    const sessionIndex = users[userIndex].profile.mentalHealthData.chatHistory.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) return false
    
    users[userIndex].profile.mentalHealthData.chatHistory.splice(sessionIndex, 1)
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },

  updateChatSessionTitle: (userId: string, sessionId: string, title: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) return false
    
    if (!users[userIndex].profile.mentalHealthData?.chatHistory) return false
    
    const sessionIndex = users[userIndex].profile.mentalHealthData.chatHistory.findIndex(s => s.id === sessionId)
    if (sessionIndex === -1) return false
    
    users[userIndex].profile.mentalHealthData.chatHistory[sessionIndex].title = title
    users[userIndex].profile.lastActive = new Date().toISOString()
    saveUsers(users)
    return true
  },

  
  // Check if user exists
  exists: (email: string): boolean => {
    return users.some(u => u.email === email)
  },

  // Force reload from file (useful for development)
  reload: (): void => {
    users = loadUsers()
  }
} 