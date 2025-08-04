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
}

interface UsageStats {
  requestsToday: number
  estimatedCostToday: number
  requestsThisMonth: number
  estimatedCostThisMonth: number
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

  // Load usage stats on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUsageStats()
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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

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
          }))
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
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
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
        <div className="max-w-4xl mx-auto">
          
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
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.role === 'user' ? 'text-amber-100' : 'text-amber-600'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
  )
} 