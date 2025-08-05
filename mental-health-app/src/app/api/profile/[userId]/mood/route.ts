import { NextRequest, NextResponse } from 'next/server'
import { HybridUserStore } from '../../../../lib/hybridUserStore'

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const moodData = await req.json()
    
    console.log('=== MOOD ENTRY DEBUG ===')
    console.log('User ID:', userId)
    console.log('Mood data:', moodData)
    
    // Check if user exists
    const user = await HybridUserStore.findById(userId)
    if (!user) {
      console.log('❌ User not found with ID:', userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email })
    console.log('User has profile:', !!user.profile)
    console.log('User has mentalHealthData:', !!user.profile?.mentalHealthData)
    console.log('User has moodTracking array:', !!user.profile?.mentalHealthData?.moodTracking)
    
    const success = await HybridUserStore.addMoodEntry(userId, moodData)
    
    if (!success) {
      console.log('❌ Failed to add mood entry')
      return NextResponse.json(
        { error: 'Failed to add mood entry' },
        { status: 500 }
      )
    }
    
    console.log('✅ Mood entry added successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Mood entry added successfully'
    })

  } catch (error) {
    console.error('Mood entry error:', error)
    return NextResponse.json(
      { error: 'Failed to add mood entry' },
      { status: 500 }
    )
  }
} 