import { NextRequest, NextResponse } from 'next/server'
import { HybridUserStore } from '../../../lib/hybridUserStore'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const user = await HybridUserStore.findById(userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update last active
    await HybridUserStore.updateLastActive(userId)

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const updates = await req.json()
    
    const success = await HybridUserStore.updateProfile(userId, updates)
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the updated user to return the profile
    const user = await HybridUserStore.findById(userId)
    
    return NextResponse.json({
      success: true,
      profile: user?.profile
    })

  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 