'use client'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'

interface AnxietyType {
  id: string
  name: string
  description: string
  symptoms: string[]
  prevalence: string
  icon: string
}

const anxietyTypes: AnxietyType[] = [
  {
    id: 'gad',
    name: 'Generalized Anxiety Disorder',
    description: 'Persistent and excessive worry about various aspects of life.',
    symptoms: ['Excessive worry', 'Restlessness', 'Fatigue', 'Difficulty concentrating', 'Muscle tension', 'Sleep problems'],
    prevalence: '3.1% of adults annually',
    icon: '😰'
  },
  {
    id: 'panic',
    name: 'Panic Disorder',
    description: 'Recurring panic attacks and fear of having more attacks.',
    symptoms: ['Rapid heartbeat', 'Sweating', 'Trembling', 'Shortness of breath', 'Chest pain', 'Fear of dying'],
    prevalence: '2.7% of adults annually',
    icon: '💓'
  },
  {
    id: 'social',
    name: 'Social Anxiety Disorder',
    description: 'Intense fear of social situations and being judged by others.',
    symptoms: ['Fear of social situations', 'Blushing', 'Sweating', 'Avoiding social events', 'Physical symptoms in social settings'],
    prevalence: '7.1% of adults annually',
    icon: '👥'
  },
  {
    id: 'phobias',
    name: 'Specific Phobias',
    description: 'Intense fear of specific objects or situations.',
    symptoms: ['Immediate fear response', 'Avoidance behavior', 'Physical symptoms', 'Interferes with daily life'],
    prevalence: '7-9% of adults annually',
    icon: '🕷️'
  }
]

const treatmentOptions = [
  {
    type: 'Cognitive Behavioral Therapy (CBT)',
    description: 'Helps identify and change negative thought patterns and behaviors.',
    effectiveness: '60-80% improvement rate',
    icon: '🧠'
  },
  {
    type: 'Exposure Therapy',
    description: 'Gradual exposure to feared situations in a controlled environment.',
    effectiveness: '70-90% improvement for phobias',
    icon: '🎯'
  },
  {
    type: 'Medication',
    description: 'SSRIs, SNRIs, or benzodiazepines may be prescribed.',
    effectiveness: '50-70% see significant improvement',
    icon: '💊'
  },
  {
    type: 'Mindfulness & Relaxation',
    description: 'Meditation, deep breathing, and progressive muscle relaxation.',
    effectiveness: '40-60% reduction in symptoms',
    icon: '🧘'
  }
]

const copingStrategies = [
  {
    strategy: 'Deep Breathing',
    description: 'Practice 4-7-8 breathing or diaphragmatic breathing',
    immediateUse: true,
    icon: '🫁'
  },
  {
    strategy: 'Grounding Techniques',
    description: '5-4-3-2-1 method: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
    immediateUse: true,
    icon: '🌱'
  },
  {
    strategy: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups to reduce physical tension',
    immediateUse: false,
    icon: '💪'
  },
  {
    strategy: 'Challenge Negative Thoughts',
    description: 'Question anxious thoughts: Is this realistic? What evidence do I have?',
    immediateUse: false,
    icon: '🤔'
  },
  {
    strategy: 'Regular Exercise',
    description: 'Physical activity helps reduce anxiety and improve mood',
    immediateUse: false,
    icon: '🏃'
  },
  {
    strategy: 'Limit Caffeine',
    description: 'Reduce coffee, tea, and energy drinks that can increase anxiety',
    immediateUse: false,
    icon: '☕'
  }
]

export default function AnxietyPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<AnxietyType>(anxietyTypes[0])
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'treatment' | 'coping'>('overview')

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

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
    return null // Will redirect to landing page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      <Navigation />
      
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center text-amber-800 hover:text-amber-900 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Learning Center
          </button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-amber-200 mb-8">
              <div className="text-6xl mb-4">😰</div>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Anxiety Disorders
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
                Understanding anxiety disorders, their symptoms, and evidence-based treatments. 
                Anxiety is treatable, and you're not alone in this journey.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-amber-200 flex flex-wrap justify-center">
              {[
                { id: 'overview', label: '📋 Overview', name: 'overview' },
                { id: 'types', label: '🔍 Types', name: 'types' },
                { id: 'treatment', label: '💊 Treatment', name: 'treatment' },
                { id: 'coping', label: '🛡️ Coping', name: 'coping' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.name as any)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.name
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* What is Anxiety */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
                <h2 className="text-3xl font-bold text-amber-900 mb-6">What is Anxiety?</h2>
                <p className="text-amber-800 leading-relaxed mb-6">
                  Anxiety is a normal human emotion that everyone experiences. However, when anxiety becomes persistent, 
                  excessive, and interferes with daily activities, it may be an anxiety disorder. Anxiety disorders are 
                  the most common mental health conditions, affecting millions of people worldwide.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-3">Normal Anxiety</h3>
                    <ul className="text-green-700 space-y-2">
                      <li>• Temporary and situational</li>
                      <li>• Proportionate to the situation</li>
                      <li>• Motivates action</li>
                      <li>• Doesn't interfere with daily life</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                    <h3 className="text-xl font-bold text-red-800 mb-3">Anxiety Disorder</h3>
                    <ul className="text-red-700 space-y-2">
                      <li>• Persistent and chronic</li>
                      <li>• Disproportionate to the situation</li>
                      <li>• Interferes with functioning</li>
                      <li>• Causes significant distress</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
                <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Key Statistics</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-amber-900 mb-2">40M</div>
                    <div className="text-amber-800">Adults in the US affected annually</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-amber-900 mb-2">18.1%</div>
                    <div className="text-amber-800">Of US adult population</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-amber-900 mb-2">2:1</div>
                    <div className="text-amber-800">Women to men ratio</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'types' && (
            <div className="space-y-8">
              {/* Type Selection */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {anxietyTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedType.id === type.id
                        ? 'bg-amber-100 border-amber-500 shadow-lg'
                        : 'bg-white/90 border-amber-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <h3 className="font-bold text-amber-900 text-sm">{type.name}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Type Details */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedType.icon}</div>
                  <h2 className="text-3xl font-bold text-amber-900 mb-2">{selectedType.name}</h2>
                  <p className="text-amber-800 text-lg">{selectedType.description}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-amber-900 mb-4">Common Symptoms:</h3>
                    <ul className="space-y-2">
                      {selectedType.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center text-amber-800">
                          <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900 mb-4">Prevalence:</h3>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">{selectedType.prevalence}</div>
                      <div className="text-blue-700 text-sm">of adults in the United States</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'treatment' && (
            <div className="grid md:grid-cols-2 gap-8">
              {treatmentOptions.map((treatment, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{treatment.icon}</div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">{treatment.type}</h3>
                  </div>
                  <p className="text-amber-800 mb-4">{treatment.description}</p>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="text-green-800 font-semibold">Effectiveness:</div>
                    <div className="text-green-700">{treatment.effectiveness}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'coping' && (
            <div className="space-y-8">
              {/* Immediate vs Long-term strategies */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">🚨 Immediate Relief</h2>
                  <p className="text-amber-800 mb-6">Use these techniques when anxiety strikes:</p>
                  <div className="space-y-4">
                    {copingStrategies.filter(s => s.immediateUse).map((strategy, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-2xl mr-4">{strategy.icon}</div>
                        <div>
                          <h3 className="font-bold text-amber-900">{strategy.strategy}</h3>
                          <p className="text-amber-800 text-sm">{strategy.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
                  <h2 className="text-2xl font-bold text-amber-900 mb-6">📅 Long-term Management</h2>
                  <p className="text-amber-800 mb-6">Build these habits for ongoing wellness:</p>
                  <div className="space-y-4">
                    {copingStrategies.filter(s => !s.immediateUse).map((strategy, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-2xl mr-4">{strategy.icon}</div>
                        <div>
                          <h3 className="font-bold text-amber-900">{strategy.strategy}</h3>
                          <p className="text-amber-800 text-sm">{strategy.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* When to Seek Help */}
              <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-red-800 mb-6">🚨 When to Seek Professional Help</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-2 text-red-700">
                    <li>• Anxiety interferes with daily activities</li>
                    <li>• Symptoms persist for more than 6 months</li>
                    <li>• You avoid situations due to anxiety</li>
                    <li>• Physical symptoms are severe</li>
                  </ul>
                  <ul className="space-y-2 text-red-700">
                    <li>• Sleep is significantly affected</li>
                    <li>• You have thoughts of self-harm</li>
                    <li>• Substance use to cope with anxiety</li>
                    <li>• Relationships are suffering</li>
                  </ul>
                </div>
                <div className="mt-6 p-4 bg-white rounded-xl">
                  <p className="text-red-800 font-semibold">Remember: Seeking help is a sign of strength, not weakness. Mental health professionals can provide effective treatments.</p>
                </div>
              </div>
            </div>
          )}

          {/* Crisis Resources */}
          <div className="mt-12 bg-red-100 border border-red-300 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">🆘 Crisis Resources</h2>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <h3 className="font-bold text-red-800 mb-2">National Suicide Prevention Lifeline</h3>
                <p className="text-2xl font-bold text-red-700">988</p>
                <p className="text-red-600 text-sm">24/7 free and confidential support</p>
              </div>
              <div>
                <h3 className="font-bold text-red-800 mb-2">Crisis Text Line</h3>
                <p className="text-2xl font-bold text-red-700">Text HOME to 741741</p>
                <p className="text-red-600 text-sm">24/7 crisis support via text</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 