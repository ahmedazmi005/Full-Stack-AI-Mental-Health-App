'use client'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'

interface BreathingTechnique {
  id: string
  name: string
  description: string
  steps: string[]
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  benefits: string[]
  icon: string
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'A calming technique that helps reduce anxiety and promote sleep.',
    steps: [
      'Exhale completely through your mouth',
      'Close your mouth and inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat for 3-4 cycles'
    ],
    duration: '2-5 minutes',
    difficulty: 'Beginner',
    benefits: ['Reduces anxiety', 'Promotes sleep', 'Lowers stress'],
    icon: '😌'
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to maintain calm under pressure.',
    steps: [
      'Inhale for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale for 4 counts',
      'Hold empty for 4 counts',
      'Repeat for 5-10 cycles'
    ],
    duration: '3-10 minutes',
    difficulty: 'Beginner',
    benefits: ['Improves focus', 'Reduces stress', 'Enhances performance'],
    icon: '📦'
  },
  {
    id: 'belly-breathing',
    name: 'Diaphragmatic Breathing',
    description: 'Deep breathing that engages the diaphragm for maximum relaxation.',
    steps: [
      'Lie down or sit comfortably',
      'Place one hand on chest, one on belly',
      'Breathe in slowly through nose, expanding belly',
      'Exhale slowly through mouth, belly falls',
      'Continue for 5-10 minutes'
    ],
    duration: '5-15 minutes',
    difficulty: 'Beginner',
    benefits: ['Activates relaxation response', 'Improves oxygen flow', 'Reduces muscle tension'],
    icon: '🫁'
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril Breathing',
    description: 'A yogic breathing technique that balances the nervous system.',
    steps: [
      'Sit comfortably with spine straight',
      'Use right thumb to close right nostril',
      'Inhale through left nostril for 4 counts',
      'Close left nostril with ring finger, release right',
      'Exhale through right nostril for 4 counts',
      'Inhale right, switch, exhale left - continue alternating'
    ],
    duration: '5-10 minutes',
    difficulty: 'Intermediate',
    benefits: ['Balances nervous system', 'Improves concentration', 'Reduces stress'],
    icon: '🧘‍♀️'
  }
]

export default function BreathingPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(breathingTechniques[0])
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerCount, setTimerCount] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Timer effect for guided breathing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerCount(count => count + 1)
      }, 1000)
    } else if (!isTimerActive && timerCount !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timerCount])

  const startGuidedSession = () => {
    setIsTimerActive(true)
    setTimerCount(0)
    setCurrentStep(0)
  }

  const stopGuidedSession = () => {
    setIsTimerActive(false)
    setTimerCount(0)
    setCurrentStep(0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
              <div className="text-6xl mb-4">🫁</div>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Breathing Exercises
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
                Learn powerful breathing techniques to manage anxiety, reduce stress, and promote relaxation. 
                These evidence-based methods can be used anywhere, anytime.
              </p>
            </div>
          </div>

          {/* Technique Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Choose a Technique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {breathingTechniques.map((technique) => (
                <div
                  key={technique.id}
                  onClick={() => setSelectedTechnique(technique)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedTechnique.id === technique.id
                      ? 'bg-amber-100 border-amber-500 shadow-lg'
                      : 'bg-white/90 border-amber-200 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{technique.icon}</div>
                    <h3 className="font-bold text-amber-900 mb-2">{technique.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(technique.difficulty)}`}>
                      {technique.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Technique Details */}
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Technique Information */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{selectedTechnique.icon}</div>
                <h2 className="text-3xl font-bold text-amber-900 mb-2">{selectedTechnique.name}</h2>
                <p className="text-amber-800">{selectedTechnique.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">How to Practice:</h3>
                <ol className="space-y-3">
                  {selectedTechnique.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-amber-800">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">{selectedTechnique.duration}</div>
                  <div className="text-amber-700 text-sm">Duration</div>
                </div>
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(selectedTechnique.difficulty)}`}>
                    {selectedTechnique.difficulty}
                  </span>
                  <div className="text-amber-700 text-sm mt-1">Level</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">Benefits:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTechnique.benefits.map((benefit, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Guided Practice */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
              <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Guided Practice</h2>
              
              {!isTimerActive ? (
                <div className="text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <div className="text-6xl text-white">🫁</div>
                  </div>
                  <p className="text-amber-800 mb-8">
                    Ready to practice {selectedTechnique.name}? Click the button below to start a guided session.
                  </p>
                  <button
                    onClick={startGuidedSession}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Start Guided Session
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
                    <div className="text-4xl text-white font-bold">
                      {Math.floor(timerCount / 60)}:{(timerCount % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <p className="text-amber-800 mb-4 text-lg">
                    Follow the rhythm and breathe mindfully
                  </p>
                  <p className="text-amber-700 mb-8">
                    Focus on your breath and let your body relax with each cycle.
                  </p>
                  <button
                    onClick={stopGuidedSession}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300"
                  >
                    End Session
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Quick Tips for Success</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🌅</div>
                <h3 className="font-bold text-amber-900 mb-2">Best Times</h3>
                <p className="text-amber-800 text-sm">Morning, before bed, or during stressful moments</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-bold text-amber-900 mb-2">Find Your Space</h3>
                <p className="text-amber-800 text-sm">Quiet, comfortable area where you won't be disturbed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-amber-900 mb-2">Start Small</h3>
                <p className="text-amber-800 text-sm">Begin with 2-3 minutes and gradually increase duration</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 