'use client'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../../components/Navigation'

export default function ComingSoonPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

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
        <div className="max-w-4xl mx-auto">
          
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

          {/* Coming Soon Content */}
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 md:p-16 shadow-xl border border-amber-200">
              
              {/* Animated Heart */}
              <div className="mb-8">
                <div className="text-8xl md:text-9xl animate-pulse">
                  ❤️
                </div>
              </div>

              {/* Main Message */}
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
                Coming Soon
              </h1>
              
              <p className="text-xl md:text-2xl text-amber-800 leading-relaxed mb-8 max-w-2xl mx-auto">
                We're working hard to bring you comprehensive self-care techniques and guided exercises.
              </p>

              {/* Features Preview */}
              <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <div className="text-3xl mb-3">🧘</div>
                  <h3 className="font-bold text-amber-900 mb-2">Interactive Exercises</h3>
                  <p className="text-amber-800 text-sm">Guided meditation, breathing techniques, and mindfulness practices</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-bold text-amber-900 mb-2">Mobile Friendly</h3>
                  <p className="text-amber-800 text-sm">Access your self-care tools anywhere, anytime</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-amber-900 mb-2">Progress Tracking</h3>
                  <p className="text-amber-800 text-sm">Monitor your wellness journey with detailed insights</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold text-amber-900 mb-2">Personalized Content</h3>
                  <p className="text-amber-800 text-sm">Techniques tailored to your specific needs and goals</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-2xl border border-amber-200">
                <h3 className="text-xl font-bold text-amber-900 mb-2">Stay Tuned!</h3>
                <p className="text-amber-800">
                  In the meantime, explore our comprehensive mental health disorder information 
                  or chat with our AI assistant for personalized support.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={() => router.push('/learn')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  📚 Browse Learning Center
                </button>
                <button
                  onClick={() => router.push('/chatbot')}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  💬 Chat with AI Assistant
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 