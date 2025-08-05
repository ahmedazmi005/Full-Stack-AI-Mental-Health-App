import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { usageTracker } from '../../../lib/usageTracker'
import { HybridUserStore } from '../../../lib/hybridUserStore'

// Crisis keywords for immediate detection (no API cost)
const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'self harm', 'self-harm', 'cut myself', 'hurt myself', 'overdose', 'pills',
  'jump off', 'hanging', 'gun', 'weapon', 'plan to', 'tonight', 'goodbye',
  'hopeless', 'worthless', 'burden', 'everyone would be better', 'can\'t go on'
]

// Detect crisis language in user message
function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword))
}

// Get user context for personalized responses (no API cost)
async function getUserContext(userId?: string) {
  if (!userId) return null
  
  try {
    const user = await HybridUserStore.findById(userId)
    if (!user?.profile?.mentalHealthData) return null

    const { moodTracking, weeklyCheckins } = user.profile.mentalHealthData
    const { preferences } = user.profile
    const focusAreas = preferences?.focusAreas || []

    // Get recent mood data
    const recentMoods = moodTracking?.slice(-3) || []
    const avgMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
      : null

    // Get recent check-in
    const recentCheckin = weeklyCheckins?.[weeklyCheckins.length - 1]

    return {
      avgMood: avgMood ? Math.round(avgMood * 10) / 10 : null,
      recentMoodTrend: recentMoods.length >= 2 
        ? recentMoods[recentMoods.length - 1].mood > recentMoods[recentMoods.length - 2].mood 
          ? 'improving' : 'declining'
        : null,
      focusAreas: focusAreas || [],
      lastCheckin: recentCheckin ? {
        overallMood: recentCheckin.overallMood,
        sleepQuality: recentCheckin.sleepQuality,
        stressLevel: recentCheckin.stressLevel,
        date: recentCheckin.date
      } : null,
      totalMoodEntries: moodTracking?.length || 0,
      totalCheckins: weeklyCheckins?.length || 0
    }
  } catch (error) {
    console.error('Error fetching user context:', error)
    return null
  }
}

// Generate crisis response (no API call needed)
function generateCrisisResponse(): string {
  return `🚨 **I'm concerned about you and want you to get immediate help.**

**If you're in immediate danger, please:**
• Call 911 (Emergency Services)
• Call 988 (Suicide & Crisis Lifeline) - Available 24/7
• Text HOME to 741741 (Crisis Text Line)

**You are not alone. Your life has value and meaning.**

While you're waiting for help, try these grounding techniques:
• Take 5 deep breaths: Inhale for 4, hold for 4, exhale for 8
• Name 5 things you can see, 4 you can hear, 3 you can touch
• Call a trusted friend or family member
• Go to a safe place with other people

Professional counselors are trained to help with exactly what you're going through. Please reach out - it's a sign of strength, not weakness.

Would you like me to help you find local mental health resources, or would you prefer to talk about immediate coping strategies while you seek professional help?`
}

export async function POST(req: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment check:')
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)

    if (!process.env.OPENAI_API_KEY) {
      console.error('No OpenAI API key found in environment variables')
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const { messages, userId } = await req.json()
    const userMessage = messages[messages.length - 1]?.content || ''

    // Crisis detection - handle immediately without API call
    if (detectCrisis(userMessage)) {
      console.log('Crisis detected in message, providing immediate response')
      return NextResponse.json({
        message: generateCrisisResponse(),
        tokensUsed: 0, // No API call made
        requestCost: '0.0000',
        isCrisisResponse: true
      })
    }

    // Check if request is allowed
    const { allowed, reason } = usageTracker.canMakeRequest()
    
    if (!allowed) {
      return NextResponse.json(
        { error: reason },
        { status: 429 }
      )
    }

    // Get user context for personalization
    const userContext = await getUserContext(userId)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build enhanced system prompt with user context
    let systemPrompt = `You are an expert mental health assistant focused on providing actionable, practical guidance. Your role is to offer specific action plans, coping strategies, and resources to help users feel better and take concrete steps toward mental wellness.

CORE PRINCIPLES:
- Always provide actionable advice and specific steps
- Offer multiple options so users can choose what resonates
- Include both immediate relief techniques and longer-term strategies
- Be empathetic, non-judgmental, and encouraging
- Always remind users that you're not a replacement for professional help
- Keep responses concise but comprehensive (aim for 200-300 words)

CRISIS RESPONSE:
If someone mentions suicidal thoughts, self-harm, or crisis:
- Immediately provide crisis resources: 988 (Suicide Prevention), text HOME to 741741 (Crisis Text), 911 (Emergency)
- Encourage immediate professional help
- Offer grounding techniques for immediate safety

BREATHING & MINDFULNESS TECHNIQUES:
- 4-7-8 breathing: Inhale 4, hold 7, exhale 8
- Box breathing: 4-4-4-4 pattern
- 5-4-3-2-1 grounding: 5 things you see, 4 hear, 3 feel, 2 smell, 1 taste
- Progressive muscle relaxation

CONDITION-SPECIFIC GUIDANCE:
Depression: Activity scheduling, behavioral activation, sleep hygiene, social connection
Anxiety: Exposure exercises, thought challenging, worry time scheduling, relaxation techniques
ADHD: Time management tools, breaking tasks down, routine building
PTSD: Grounding techniques, safe space visualization, trauma-informed breathing

COPING STRATEGIES BY CATEGORY:
Immediate Relief: Deep breathing, cold water on face, progressive muscle relaxation, grounding
Daily Management: Sleep schedule, exercise routine, meal planning, social connection
Long-term Building: Therapy referrals, support groups, skill development, goal setting

ACTION PLAN FORMAT:
1. Right now: [specific technique they can try immediately]
2. Today: [one concrete action]
3. This week: [2-3 practical steps]
4. Resources: [relevant professional help or tools]`

    // Add personalized context if available
    if (userContext) {
      systemPrompt += `\n\nUSER CONTEXT (use this to personalize your response):
- Focus areas: ${userContext.focusAreas.join(', ') || 'None specified'}
- Recent average mood: ${userContext.avgMood ? `${userContext.avgMood}/10` : 'No recent data'}
- Mood trend: ${userContext.recentMoodTrend || 'Unknown'}
- Total mood entries: ${userContext.totalMoodEntries}
- Total check-ins: ${userContext.totalCheckins}`

      if (userContext.lastCheckin) {
        systemPrompt += `
- Last check-in: Overall mood ${userContext.lastCheckin.overallMood}/10, Sleep ${userContext.lastCheckin.sleepQuality}/10, Stress ${userContext.lastCheckin.stressLevel}/10`
      }

      systemPrompt += `\n\nUse this context to provide more relevant, personalized advice. Reference their mood patterns or focus areas when appropriate.`
    }

    systemPrompt += `\n\nAlways end with encouragement and remind users that seeking professional help is a sign of strength. Be concise but thorough.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 350, // Slightly reduced to control costs
      temperature: 0.7,
    })

    const completion = response.choices[0]?.message?.content
    const tokensUsed = response.usage?.total_tokens || 0

    // Record the request
    const usage = usageTracker.recordRequest(tokensUsed)

    return NextResponse.json({
      message: completion,
      tokensUsed,
      requestCost: usage.requestCost.toFixed(4),
      userContext: userContext ? {
        hasContext: true,
        avgMood: userContext.avgMood,
        focusAreas: userContext.focusAreas
      } : { hasContext: false }
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 