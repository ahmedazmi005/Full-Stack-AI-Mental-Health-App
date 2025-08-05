'use client'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../components/Navigation'

interface CrisisResource {
  name: string
  phone: string
  text?: string
  description: string
  available: string
  icon: string
  urgent?: boolean
}

const crisisResources: CrisisResource[] = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "Free and confidential emotional support for people in suicidal crisis or emotional distress.",
    available: "24/7",
    icon: "🆘",
    urgent: true
  },
  {
    name: "Crisis Text Line",
    phone: "741741",
    text: "Text HOME to 741741",
    description: "Free, 24/7 support for those in crisis. Text with a trained crisis counselor.",
    available: "24/7",
    icon: "💬",
    urgent: true
  },
  {
    name: "National Domestic Violence Hotline",
    phone: "1-800-799-7233",
    description: "Confidential support for domestic violence survivors and their loved ones.",
    available: "24/7",
    icon: "🏠"
  },
  {
    name: "SAMHSA National Helpline",
    phone: "1-800-662-4357",
    description: "Treatment referral and information service for mental health and substance use disorders.",
    available: "24/7",
    icon: "🏥"
  },
  {
    name: "Trans Lifeline",
    phone: "877-565-8860",
    description: "Peer support hotline run by and for transgender people.",
    available: "24/7",
    icon: "🏳️‍⚧️"
  },
  {
    name: "LGBT National Hotline",
    phone: "1-888-843-4564",
    description: "Confidential peer-support, local resources, and information for LGBTQ+ individuals.",
    available: "Mon-Fri 4pm-12am, Sat 12pm-5pm EST",
    icon: "🏳️‍🌈"
  },
  {
    name: "Veterans Crisis Line",
    phone: "1-800-273-8255",
    text: "Text 838255",
    description: "Confidential help for veterans and their families, available 24/7.",
    available: "24/7",
    icon: "🇺🇸"
  }
]

const professionalResources = [
  {
    name: "Psychology Today",
    description: "Find therapists, psychiatrists, and treatment centers in your area",
    link: "https://www.psychologytoday.com/us/therapists",
    icon: "👨‍⚕️"
  },
  {
    name: "SAMHSA Treatment Locator",
    description: "Find mental health and substance abuse treatment facilities",
    link: "https://findtreatment.samhsa.gov/",
    icon: "🏥"
  },
  {
    name: "National Alliance on Mental Illness (NAMI)",
    description: "Support groups, education, and advocacy for mental health",
    link: "https://www.nami.org/",
    icon: "🤝"
  },
  {
    name: "Mental Health America",
    description: "Screening tools, resources, and advocacy for mental health",
    link: "https://www.mhanational.org/",
    icon: "🧠"
  }
]

export default function SupportPage() {
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

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      <Navigation />
      
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-amber-200 mb-8">
              <div className="text-6xl mb-4">🆘</div>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Support & Crisis Resources
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
                You are not alone. Help is available 24/7. If you're in immediate danger, call 911.
              </p>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-r-2xl mb-12">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🚨</div>
              <div>
                <h2 className="text-xl font-bold text-red-800 mb-2">In Immediate Danger?</h2>
                <p className="text-red-700 mb-3">
                  If you or someone else is in immediate physical danger, call emergency services immediately.
                </p>
                <button
                  onClick={() => handleCall('911')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  📞 Call 911
                </button>
              </div>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">
              🆘 Crisis Support Lines
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {crisisResources.map((resource, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                    resource.urgent
                      ? 'bg-red-50 border-red-200 hover:bg-red-100'
                      : 'bg-white/90 border-amber-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">{resource.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-900 mb-2">
                        {resource.name}
                      </h3>
                      <p className="text-amber-800 text-sm mb-4">
                        {resource.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <button
                          onClick={() => handleCall(resource.phone)}
                          className={`w-full text-left px-4 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                            resource.urgent
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          📞 Call {resource.phone}
                        </button>
                        
                        {resource.text && (
                          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                            <p className="text-blue-800 text-sm font-medium">
                              💬 {resource.text}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-amber-700 text-xs">
                        Available: {resource.available}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Help */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">
              👨‍⚕️ Find Professional Help
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {professionalResources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">{resource.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-900 mb-2">
                        {resource.name}
                      </h3>
                      <p className="text-amber-800 text-sm mb-4">
                        {resource.description}
                      </p>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md transition-all duration-300"
                      >
                        Visit Website
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Planning */}
          <div className="mb-16">
            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200">
              <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                🛡️ Crisis Safety Planning
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Warning Signs to Watch For:</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Talking about wanting to die or kill oneself</li>
                    <li>• Looking for ways to kill oneself</li>
                    <li>• Talking about feeling hopeless or having no purpose</li>
                    <li>• Talking about feeling trapped or in unbearable pain</li>
                    <li>• Talking about being a burden to others</li>
                    <li>• Increasing use of alcohol or drugs</li>
                    <li>• Acting anxious, agitated, or reckless</li>
                    <li>• Sleeping too little or too much</li>
                    <li>• Withdrawing or feeling isolated</li>
                    <li>• Showing rage or talking about seeking revenge</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Immediate Coping Strategies:</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Call a crisis hotline (988)</li>
                    <li>• Reach out to a trusted friend or family member</li>
                    <li>• Remove means of self-harm from your environment</li>
                    <li>• Go to a safe place with other people</li>
                    <li>• Practice deep breathing or grounding techniques</li>
                    <li>• Use the 5-4-3-2-1 grounding method</li>
                    <li>• Take a hot shower or bath</li>
                    <li>• Listen to calming music</li>
                    <li>• Write in a journal</li>
                    <li>• Remember that this feeling is temporary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-3xl p-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                💝 Remember: You Matter
              </h2>
              <p className="text-amber-800 text-lg mb-6 max-w-3xl mx-auto">
                Your life has value and meaning. Recovery is possible, and there are people who want to help. 
                Taking the step to seek support shows incredible strength and courage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/chatbot')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  💬 Talk to AI Assistant
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  📊 Track Your Wellness
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 