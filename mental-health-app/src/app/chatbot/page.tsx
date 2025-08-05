'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isCrisisResponse?: boolean
  userContext?: {
    hasContext: boolean
    avgMood?: number
    focusAreas?: string[]
  }
}

interface UsageStats {
  requestsToday: number
  estimatedCostToday: number
  requestsThisMonth: number
  estimatedCostThisMonth: number
}

interface ChatSession {
  id: string
  title: string
  createdAt: string
  lastMessageAt: string
  messageCount: number
  lastMessage: string
}

export default function ChatbotPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your mental health assistant. I'm here to provide actionable guidance, coping strategies, and resources to help you feel better. I can help with breathing exercises, create action plans, suggest coping strategies, and connect you with resources. How can I support you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [usageStats, setUsageStats] = useState<UsageStats>({
    requestsToday: 0,
    estimatedCostToday: 0,
    requestsThisMonth: 0,
    estimatedCostThisMonth: 0
  })
  const [rateLimitWarning, setRateLimitWarning] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Chat history state
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Suggested prompts to help users get started
  const suggestedPrompts = [
    "I'm feeling anxious and need some immediate relief techniques",
    "Can you help me create a daily routine for better mental health?",
    "I'm struggling with depression and need an action plan",
    "Teach me a breathing exercise I can use when stressed",
    "How can I find a therapist in my area?",
    "I need help setting realistic mental health goals",
    "What are some coping strategies for overwhelming emotions?",
    "I'm having trouble sleeping due to anxiety"
  ]

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load usage stats and chat history on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUsageStats()
      loadChatHistory()
    }
  }, [isAuthenticated])

  const loadUsageStats = async () => {
    try {
      const response = await fetch('/api/chatbot/usage')
      if (response.ok) {
        const stats = await response.json()
        setUsageStats(stats)
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error)
    }
  }

  const loadChatHistory = async () => {
    if (!user?.id) return
    
    setIsLoadingHistory(true)
    try {
      const response = await fetch(`/api/chatbot/history?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.chatHistory)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const createNewSession = async () => {
    if (!user?.id) return
    
    const title = `Chat ${new Date().toLocaleDateString()}`
    
    try {
      const response = await fetch('/api/chatbot/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentSessionId(data.sessionId)
        setMessages([{
          id: '1',
          role: 'assistant',
          content: "Hello! I'm your mental health assistant. I'm here to provide actionable guidance, coping strategies, and resources to help you feel better. I can help with breathing exercises, create action plans, suggest coping strategies, and connect you with resources. How can I support you today?",
          timestamp: new Date()
        }])
        loadChatHistory() // Refresh history
      }
    } catch (error) {
      console.error('Failed to create new session:', error)
    }
  }

  const loadSession = async (sessionId: string) => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/chatbot/session/${sessionId}?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const session = data.session
        
        setCurrentSessionId(sessionId)
        setMessages(session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
        setShowHistory(false)
      }
    } catch (error) {
      console.error('Failed to load session:', error)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/chatbot/history?userId=${user.id}&sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        if (currentSessionId === sessionId) {
          // If we're deleting the current session, start a new one
          createNewSession()
        }
        loadChatHistory() // Refresh history
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const saveMessageToSession = async (message: Message) => {
    if (!user?.id || !currentSessionId) return
    
    try {
      await fetch(`/api/chatbot/session/${currentSessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: {
            id: message.id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp.toISOString()
          }
        })
      })
      
      // Refresh history to update last message
      loadChatHistory()
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  const checkRateLimit = (): boolean => {
    const dailyLimit = 50 // configurable
    const monthlyLimit = 500 // configurable
    const costLimit = 20 // $20 monthly limit

    if (usageStats.requestsToday >= dailyLimit) {
      setRateLimitWarning('Daily request limit reached. Please try again tomorrow.')
      return false
    }

    if (usageStats.requestsThisMonth >= monthlyLimit) {
      setRateLimitWarning('Monthly request limit reached. Please try again next month.')
      return false
    }

    if (usageStats.estimatedCostThisMonth >= costLimit) {
      setRateLimitWarning('Monthly cost limit reached to protect your budget. Please try again next month.')
      return false
    }

    if (usageStats.requestsToday >= dailyLimit * 0.8) {
      setRateLimitWarning('Warning: Approaching daily limit. Use wisely!')
    } else if (usageStats.estimatedCostThisMonth >= costLimit * 0.8) {
      setRateLimitWarning('Warning: Approaching monthly cost limit.')
    } else {
      setRateLimitWarning('')
    }

    return true
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    // Check rate limits before making API call
    if (!checkRateLimit()) return

    // Create new session if we don't have one
    if (!currentSessionId) {
      await createNewSession()
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Save user message to session
    if (currentSessionId) {
      saveMessageToSession(userMessage)
    }

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          userId: user?.id
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        isCrisisResponse: data.isCrisisResponse,
        userContext: data.userContext
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Save assistant message to session
      if (currentSessionId) {
        saveMessageToSession(assistantMessage)
      }
      
      // Update usage stats
      loadUsageStats()

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
          <p className="mt-4 text-amber-900 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      <Navigation />
      
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex gap-6">
            {/* Chat History Sidebar */}
            <div className={`${showHistory ? 'w-80' : 'w-12'} transition-all duration-300 flex-shrink-0`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200 h-full">
                
                {/* Toggle Button */}
                <div className="p-4 border-b border-amber-200">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-amber-800 to-yellow-700 hover:from-amber-900 hover:to-yellow-800 text-white p-2 rounded-xl transition-all"
                  >
                    {showHistory ? (
                      <>
                        <span className="mr-2">📚</span>
                        <span>Hide History</span>
                      </>
                    ) : (
                      <span className="text-xl">📚</span>
                    )}
                  </button>
                </div>

                {/* Chat History Content */}
                {showHistory && (
                  <div className="p-4 h-[600px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-amber-900">Chat History</h3>
                      <button
                        onClick={createNewSession}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                      >
                        + New Chat
                      </button>
                    </div>

                    {isLoadingHistory ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto"></div>
                        <p className="text-amber-700 mt-2">Loading...</p>
                      </div>
                    ) : chatHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">💬</div>
                        <p className="text-amber-700">No chat history yet</p>
                        <p className="text-sm text-amber-600 mt-1">Start a conversation to see it here</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chatHistory.map((session) => (
                          <div
                            key={session.id}
                            className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                              currentSessionId === session.id
                                ? 'bg-amber-50 border-amber-300 shadow-sm'
                                : 'bg-white border-amber-200 hover:bg-amber-25'
                            }`}
                            onClick={() => loadSession(session.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-amber-900 truncate">
                                  {session.title}
                                </h4>
                                <p className="text-xs text-amber-600 mt-1">
                                  {new Date(session.lastMessageAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-amber-700 mt-1 truncate">
                                  {session.lastMessage}
                                </p>
                                <div className="text-xs text-amber-500 mt-1">
                                  {session.messageCount} messages
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSession(session.id)
                                }}
                                className="text-red-500 hover:text-red-700 ml-2 p-1"
                                title="Delete chat"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-200">
              <h1 className="text-3xl font-bold text-amber-900 mb-2">
                AI Mental Health Assistant 💬
              </h1>
              <p className="text-amber-800">
                Get actionable guidance, coping strategies, and personalized mental health support
              </p>
            </div>
          </div>

          {/* Usage Stats & Rate Limit Warning */}
          <div className="mb-6 space-y-3">
            {rateLimitWarning && (
              <div className={`p-4 rounded-xl text-center font-medium ${
                rateLimitWarning.includes('Warning') 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {rateLimitWarning}
              </div>
            )}
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-amber-900">Today</div>
                  <div className="text-amber-700">{usageStats.requestsToday}/50 requests</div>
                </div>
                <div>
                  <div className="font-semibold text-amber-900">Cost Today</div>
                  <div className="text-amber-700">${usageStats.estimatedCostToday.toFixed(3)}</div>
                </div>
                <div>
                  <div className="font-semibold text-amber-900">This Month</div>
                  <div className="text-amber-700">{usageStats.requestsThisMonth} requests</div>
                </div>
                <div>
                  <div className="font-semibold text-amber-900">Cost Month</div>
                  <div className="text-amber-700">${usageStats.estimatedCostThisMonth.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">💡 Try asking about:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="text-left p-3 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors text-amber-800 text-sm"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
            
            {/* Messages */}
            <div className="h-96 md:h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-amber-800 to-yellow-700 text-white'
                        : message.isCrisisResponse
                        ? 'bg-red-50 text-red-900 border-2 border-red-300 shadow-lg'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {/* Crisis Response Header */}
                    {message.isCrisisResponse && (
                      <div className="flex items-center mb-2 pb-2 border-b border-red-200">
                        <span className="text-red-600 mr-2">🚨</span>
                        <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Crisis Support</span>
                      </div>
                    )}
                    
                    {/* Personalized Response Indicator */}
                    {message.userContext?.hasContext && !message.isCrisisResponse && (
                      <div className="flex items-center mb-2 pb-2 border-b border-amber-200">
                        <span className="text-amber-600 mr-2">🎯</span>
                        <span className="text-xs font-medium text-amber-700">
                          Personalized for you
                          {message.userContext.avgMood && (
                            <span className="ml-2 text-amber-600">
                              • Mood: {message.userContext.avgMood}/10
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Enhanced timestamp with context info */}
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs opacity-70 ${
                        message.role === 'user' 
                          ? 'text-amber-100' 
                          : message.isCrisisResponse 
                          ? 'text-red-500' 
                          : 'text-amber-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      
                      {/* Focus areas indicator */}
                      {message.userContext?.focusAreas && message.userContext.focusAreas.length > 0 && (
                        <div className="flex items-center">
                          <span className="text-xs text-amber-600 mr-1">Focus:</span>
                          <div className="flex gap-1">
                            {message.userContext.focusAreas.slice(0, 2).map((area, index) => (
                              <span key={index} className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                                {area}
                              </span>
                            ))}
                            {message.userContext.focusAreas.length > 2 && (
                              <span className="text-xs text-amber-600">+{message.userContext.focusAreas.length - 2}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-amber-100 text-amber-900 border border-amber-200 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-amber-200 p-4">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for coping strategies, breathing exercises, action plans, or resources..."
                  className="flex-1 px-4 py-3 border border-amber-300 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  disabled={isTyping || !!rateLimitWarning.includes('limit reached')}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={isTyping || !input.trim() || !!rateLimitWarning.includes('limit reached')}
                  className="bg-gradient-to-r from-amber-800 to-yellow-700 hover:from-amber-900 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
                >
                  {isTyping ? 'Sending...' : 'Send'}
                </button>
              </form>
              
              <div className="mt-3 text-xs text-amber-700 text-center">
                <strong>Disclaimer:</strong> This AI assistant provides general guidance only. 
                Always consult healthcare professionals for medical advice.
              </div>
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 