
'use client'
import { useAuth } from './hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/home')
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

  if (isAuthenticated) {
    return null // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-10 py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-amber-900">Mental Health Awareness</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-6 py-2 text-amber-900 hover:text-amber-800 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2 bg-gradient-to-r from-amber-800 to-yellow-700 text-white rounded-lg font-medium hover:from-amber-900 hover:to-yellow-800 transition-all duration-200 shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-amber-900 mb-8 leading-tight">
            Mental Health
            <span className="block bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent">
              Awareness
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-amber-800 mb-12 max-w-4xl mx-auto leading-relaxed">
            A safe, supportive space to learn, understand, and find resources for mental health conditions. 
            Breaking stigma through education and awareness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-amber-800 to-yellow-700 text-white text-lg font-semibold rounded-xl hover:from-amber-900 hover:to-yellow-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Learning Today
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 bg-white text-amber-800 text-lg font-semibold rounded-xl border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200 shadow-lg"
            >
              Sign In
            </Link>
          </div>

          {/* Mission Statement Card */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-amber-200">
              <h2 className="text-3xl font-bold text-amber-900 mb-6">Our Mission</h2>
              <p className="text-lg text-amber-800 leading-relaxed">
                <strong>This website was created with the goal to destigmatize mental illness and spread awareness by providing an easy to access directory of several mental health disorders that people go through and resources to learn more. Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices. Mental health is important at every stage of life, from childhood and adolescence through adulthood - and being aware of what other people go through can help us all understand and support each other.</strong>
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <span className="text-3xl text-white">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Learn</h3>
              <p className="text-amber-700 leading-relaxed">
                Explore comprehensive, evidence-based information about various mental health conditions and treatments.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-700 to-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <span className="text-3xl text-white">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">AI Assistant</h3>
              <p className="text-amber-700 leading-relaxed">
                Get personalized guidance and support with our AI assistant for mental health resource navigation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <span className="text-3xl text-white">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Support</h3>
              <p className="text-amber-700 leading-relaxed">
                Access professional resources, support networks, and crisis intervention information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-amber-100/70 border-t border-amber-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold text-amber-900">Mental Health Awareness</span>
          </div>
          <p className="text-amber-800 mb-2">© 2024 Mental Health Awareness. All rights reserved.</p>
          <p className="text-sm text-amber-700">
            <strong>Disclaimer:</strong> This platform provides educational content only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
