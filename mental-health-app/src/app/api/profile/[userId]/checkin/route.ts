import { NextRequest, NextResponse } from 'next/server'
import { HybridUserStore } from '../../../../lib/hybridUserStore'

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const checkinData = await req.json()
    
    console.log('=== WEEKLY CHECKIN DEBUG ===')
    console.log('User ID:', userId)
    console.log('Checkin data:', checkinData)
    
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
    
    const success = await HybridUserStore.addWeeklyCheckin(userId, checkinData)
    
    if (!success) {
      console.log('❌ Failed to add weekly check-in')
      return NextResponse.json(
        { error: 'Failed to save weekly check-in' },
        { status: 500 }
      )
    }
    
    console.log('✅ Weekly check-in saved successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Weekly check-in saved successfully'
    })

  } catch (error) {
    console.error('Weekly check-in error:', error)
    return NextResponse.json(
      { error: 'Failed to save weekly check-in' },
      { status: 500 }
    )
  }
} 