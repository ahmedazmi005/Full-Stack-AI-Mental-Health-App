import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { usageTracker } from '../../../lib/usageTracker'

export async function POST(req: NextRequest) {
  try {
    // Debug environment variables
    console.log('Environment check:')
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
    console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
    console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'))

    if (!process.env.OPENAI_API_KEY) {
      console.error('No OpenAI API key found in environment variables')
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Check if request is allowed
    const { allowed, reason } = usageTracker.canMakeRequest()
    
    if (!allowed) {
      return NextResponse.json(
        { error: reason },
        { status: 429 }
      )
    }

    const { messages } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert mental health assistant focused on providing actionable, practical guidance. Your role is to offer specific action plans, coping strategies, and resources to help users feel better and take concrete steps toward mental wellness.

CORE PRINCIPLES:
- Always provide actionable advice and specific steps
- Offer multiple options so users can choose what resonates
- Include both immediate relief techniques and longer-term strategies
- Be empathetic, non-judgmental, and encouraging
- Always remind users that you're not a replacement for professional help

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
- Mindful observation exercises

CONDITION-SPECIFIC GUIDANCE:
Depression: Activity scheduling, behavioral activation, sleep hygiene, social connection, sunlight exposure
Anxiety: Exposure exercises, thought challenging, worry time scheduling, relaxation techniques
ADHD: Time management tools, breaking tasks down, fidget strategies, routine building
PTSD: Grounding techniques, safe space visualization, trauma-informed breathing
OCD: Response prevention, uncertainty tolerance, mindfulness of thoughts
Eating Disorders: Meal planning support, body neutrality practices, distraction techniques

COPING STRATEGIES BY CATEGORY:
Immediate Relief: Deep breathing, cold water on face, progressive muscle relaxation, grounding techniques
Daily Management: Sleep schedule, exercise routine, meal planning, social connection, hobby engagement
Long-term Building: Therapy referrals, support groups, skill development, goal setting, lifestyle changes

RESOURCE RECOMMENDATIONS:
- Local therapy finder: Psychology Today, BetterHelp, local community centers
- Support groups: NAMI, local peer support, online communities
- Apps: Headspace, Calm, Sanvello, Youper for mood tracking
- Books: Self-help resources based on specific conditions
- Workplace/school counseling services

ACTION PLAN FORMAT:
1. Immediate (next 10 minutes): [specific breathing/grounding technique]
2. Today: [one concrete action they can take]
3. This week: [2-3 practical steps]
4. Ongoing: [sustainable practices and resource connections]

GOAL-SETTING ASSISTANCE:
- Help break large goals into small, achievable steps
- SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Weekly check-ins and adjustments
- Celebrate small wins and progress

Always end responses with encouragement and remind users that seeking professional help is a sign of strength, not weakness. Tailor advice to their specific situation and offer multiple options when possible.`
        },
        ...messages
      ],
      max_tokens: 400, // Increased slightly for more detailed responses
      temperature: 0.7,
    })

    const completion = response.choices[0]?.message?.content
    const tokensUsed = response.usage?.total_tokens || 0

    // Record the request
    const usage = usageTracker.recordRequest(tokensUsed)

    return NextResponse.json({
      message: completion,
      tokensUsed,
      requestCost: usage.requestCost.toFixed(4)
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 