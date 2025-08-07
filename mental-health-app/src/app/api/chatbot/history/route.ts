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
    const { userId, title } = await req.json()
    
    if (!userId || !title) {
      return NextResponse.json(
        { error: 'User ID and title are required' },
        { status: 400 }
      )
    }
    
    const sessionId = await HybridUserStore.createChatSession(userId, title)
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Failed to create chat session' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Chat session created successfully'
    })

  } catch (error) {
    console.error('Chat session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat session' },
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