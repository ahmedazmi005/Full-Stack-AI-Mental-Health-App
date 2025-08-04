'use client'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function HomePage() {
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
      
      <div className="pt-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-amber-200 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
                What would you like to do today? Choose from the options below to continue your mental health journey.
              </p>
            </div>
          </div>

                                {/* Action Cards */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        
                        {/* Learn Card */}
                        <Link href="/dashboard">
                          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-700 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-4xl text-white">📚</span>
                            </div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">Learn</h3>
                            <p className="text-amber-700 leading-relaxed text-center">
                              Explore comprehensive information about various mental health conditions and treatments.
                            </p>
                            <div className="mt-6 text-center">
                              <span className="inline-flex items-center text-amber-800 font-semibold group-hover:text-amber-900 transition-colors">
                                Explore Resources
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Chat Card */}
                        <Link href="/chatbot">
                          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-700 to-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-4xl text-white">💬</span>
                            </div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">AI Assistant</h3>
                            <p className="text-amber-700 leading-relaxed text-center">
                              Get personalized guidance and support with our AI assistant for mental health resource navigation.
                            </p>
                            <div className="mt-6 text-center">
                              <span className="inline-flex items-center text-amber-800 font-semibold group-hover:text-amber-900 transition-colors">
                                Start Chatting
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Profile Card */}
                        <Link href="/profile">
                          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-amber-700 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-4xl text-white">👤</span>
                            </div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">Profile</h3>
                            <p className="text-amber-700 leading-relaxed text-center">
                              Track your progress, manage goals, and customize your mental health journey preferences.
                            </p>
                            <div className="mt-6 text-center">
                              <span className="inline-flex items-center text-amber-800 font-semibold group-hover:text-amber-900 transition-colors">
                                View Profile
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Support Card */}
                        <Link href="/support">
                          <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <span className="text-4xl text-white">🤝</span>
                            </div>
                            <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">Support</h3>
                            <p className="text-amber-700 leading-relaxed text-center">
                              Access professional resources, crisis intervention information, and support networks.
                            </p>
                            <div className="mt-6 text-center">
                              <span className="inline-flex items-center text-amber-800 font-semibold group-hover:text-amber-900 transition-colors">
                                Get Support
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>

                      </div>

          {/* Quick Stats or Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Remember</h3>
              <p className="text-amber-800">
                You're not alone in this journey. Our platform provides educational content and resources, 
                but always consult with healthcare professionals for personalized medical advice.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 