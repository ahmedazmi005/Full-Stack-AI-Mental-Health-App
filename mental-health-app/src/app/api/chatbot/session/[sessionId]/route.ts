import { NextRequest, NextResponse } from 'next/server'
import { userStore } from '../../../../lib/userStore'

// GET - Retrieve a specific chat session with all messages
export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sessionId = params.sessionId
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and session ID are required' },
        { status: 400 }
      )
    }
    
    const session = userStore.getChatSession(userId, sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      session
    })

  } catch (error) {
    console.error('❌ Chat session retrieval error:', error)
    return NextResponse.json(
      { error: `Failed to retrieve chat session: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// PUT - Update chat session title
export async function PUT(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { userId, title } = await req.json()
    const sessionId = params.sessionId
    
    if (!userId || !sessionId || !title) {
      return NextResponse.json(
        { error: 'User ID, session ID, and title are required' },
        { status: 400 }
      )
    }
    
    const success = userStore.updateChatSessionTitle(userId, sessionId, title)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update chat session title' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('❌ Chat session update error:', error)
    return NextResponse.json(
      { error: `Failed to update chat session: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// POST - Save a message to the chat session
export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { userId, message } = await req.json()
    const sessionId = params.sessionId
    
    if (!userId || !sessionId || !message) {
      return NextResponse.json(
        { error: 'User ID, session ID, and message are required' },
        { status: 400 }
      )
    }
    
    const success = userStore.saveChatMessage(userId, sessionId, message)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save chat message' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('❌ Chat message save error:', error)
    return NextResponse.json(
      { error: `Failed to save chat message: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 