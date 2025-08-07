import { NextRequest, NextResponse } from 'next/server'
import { HybridUserStore } from '../../../lib/hybridUserStore'

// GET - Retrieve chat history for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const chatHistory = await HybridUserStore.getChatHistory(userId)
    
    return NextResponse.json({
      chatHistory: chatHistory.map(session => ({
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        lastMessageAt: session.lastMessageAt,
        messageCount: session.messages.length,
        lastMessage: session.messages[session.messages.length - 1]?.content?.substring(0, 100) + '...' || 'No messages yet'
      }))
    })

  } catch (error) {
    console.error('Chat history GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve chat history' },
      { status: 500 }
    )
  }
}

// POST - Create a new chat session
export async function POST(req: NextRequest) {
  try {
    console.log('=== CHAT SESSION CREATION DEBUG ===')
    
    const { userId, title } = await req.json()
    console.log('Request data:', { userId, title })
    
    if (!userId || !title) {
      console.log('❌ Missing required fields:', { userId: !!userId, title: !!title })
      return NextResponse.json(
        { error: 'User ID and title are required' },
        { status: 400 }
      )
    }
    
    // Check if user exists first
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
    
    const sessionId = await HybridUserStore.createChatSession(userId, title)
    console.log('Session creation result:', sessionId)
    
    if (!sessionId) {
      console.log('❌ createChatSession returned null')
      return NextResponse.json(
        { error: 'Failed to create chat session - session ID is null' },
        { status: 500 }
      )
    }
    
    console.log('✅ Chat session created successfully:', sessionId)
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Chat session created successfully'
    })

  } catch (error) {
    console.error('❌ Chat session creation error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Failed to create chat session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete a chat session
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'User ID and session ID are required' },
        { status: 400 }
      )
    }
    
    const success = await HybridUserStore.deleteChatSession(userId, sessionId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete chat session or session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully'
    })

  } catch (error) {
    console.error('Chat session deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    )
  }
} 