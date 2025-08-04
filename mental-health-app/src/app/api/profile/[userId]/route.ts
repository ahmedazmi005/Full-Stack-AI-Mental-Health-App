import { NextRequest, NextResponse } from 'next/server'
import { userStore } from '../../../lib/userStore'

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const user = userStore.findById(userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update last active
    userStore.updateLastActive(userId)

    return NextResponse.json({
      profile: user.profile,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const updates = await req.json()
    
    const updatedUser = userStore.updateProfile(userId, updates)
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: updatedUser.profile
    })

  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 