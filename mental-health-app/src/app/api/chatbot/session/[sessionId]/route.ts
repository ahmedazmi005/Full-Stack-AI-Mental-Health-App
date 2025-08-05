import { NextRequest, NextResponse } from 'next/server'
import { HybridUserStore } from '../../../../lib/hybridUserStore'

// GET - Retrieve a specific chat session with all messages
export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const { sessionId } = await params
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and session ID are required' },
        { status: 400 }
      )
    }
    
    const session = await HybridUserStore.getChatSession(userId, sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      session
    })
    
  } catch (error) {
    console.error('Get chat session error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}

// PUT - Update session (e.g., change title)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { userId, title } = await req.json()
    const { sessionId } = await params
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and session ID are required' },
        { status: 400 }
      )
    }
    
    const success = await HybridUserStore.updateChatSessionTitle(userId, sessionId, title)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update session or session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Session updated successfully'
    })
    
  } catch (error) {
    console.error('Update chat session error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// POST - Save a message to the session
export async function POST(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { userId, message } = await req.json()
    const { sessionId } = await params
    
    if (!userId || !sessionId || !message) {
      return NextResponse.json(
        { error: 'User ID, session ID, and message are required' },
        { status: 400 }
      )
    }
    
    const success = await HybridUserStore.saveChatMessage(userId, sessionId, message)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save message or session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Message saved successfully'
    })
    
  } catch (error) {
    console.error('Save chat message error:', error)
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    )
  }
} 