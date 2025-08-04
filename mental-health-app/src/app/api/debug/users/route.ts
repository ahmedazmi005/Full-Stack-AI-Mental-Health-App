import { NextResponse } from 'next/server'
import { userStore } from '../../../lib/userStore'

export async function GET() {
  // Only enable in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  const users = userStore.getAll().map(user => ({
    id: user.id,
    email: user.email,
    name: user.name
    // Don't return password hash
  }))

  return NextResponse.json({ 
    users, 
    count: users.length 
  })
} 