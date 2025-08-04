import fs from 'fs'
import path from 'path'

// Shared user store with file persistence (replace with database later)
export interface User {
  id: string
  email: string
  password: string
  name: string
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
  create: (user: User): User => {
    users.push(user)
    saveUsers(users) // Persist to file
    console.log('User created:', { email: user.email, name: user.name, id: user.id })
    console.log('Total users:', users.length)
    return user
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