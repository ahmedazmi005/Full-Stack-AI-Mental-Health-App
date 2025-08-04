import { NextRequest, NextResponse } from 'next/server'
import { userStore } from '../../../../lib/userStore'

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const moodData = await req.json()
    
    console.log('=== MOOD ENTRY DEBUG ===')
    console.log('User ID:', userId)
    console.log('Mood data:', moodData)
    console.log('All users:', userStore.getAll().map(u => ({ id: u.id, email: u.email })))
    
    // Check if user exists
    const user = userStore.findById(userId)
    if (!user) {
      console.log('❌ User not found with ID:', userId)
      console.log('Available user IDs:', userStore.getAll().map(u => u.id))
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email })
    console.log('User has profile:', !!user.profile)
    console.log('User has mentalHealthData:', !!user.profile?.mentalHealthData)
    console.log('User has moodTracking array:', !!user.profile?.mentalHealthData?.moodTracking)
    
    const success = userStore.addMoodEntry(userId, moodData)
    
    if (!success) {
      console.log('❌ addMoodEntry returned false')
      return NextResponse.json(
        { error: 'Failed to save mood entry' },
        { status: 400 }
      )
    }

    console.log('✅ Mood entry saved successfully')
    console.log('Updated mood tracking length:', user.profile?.mentalHealthData?.moodTracking?.length)
    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('❌ Mood entry creation error:', error)
    return NextResponse.json(
      { error: `Failed to save mood entry: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 