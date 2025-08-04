import { NextRequest, NextResponse } from 'next/server'
import { userStore } from '../../../../lib/userStore'

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const checkinData = await req.json()
    
    console.log('=== WEEKLY CHECKIN DEBUG ===')
    console.log('User ID:', userId)
    console.log('Checkin data:', checkinData)
    
    // Check if user exists
    const user = userStore.findById(userId)
    if (!user) {
      console.log('❌ User not found with ID:', userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ User found:', { id: user.id, email: user.email })
    
    const success = userStore.addWeeklyCheckin(userId, checkinData)
    
    if (!success) {
      console.log('❌ addWeeklyCheckin returned false')
      return NextResponse.json(
        { error: 'Failed to save weekly check-in' },
        { status: 400 }
      )
    }

    console.log('✅ Weekly check-in saved successfully')
    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('❌ Weekly check-in creation error:', error)
    return NextResponse.json(
      { error: `Failed to save weekly check-in: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 