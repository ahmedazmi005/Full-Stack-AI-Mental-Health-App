'use client'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import DisplayCard from '../components/displaycard'

interface ResourceCard {
  id: string
  title: string
  description: string
  category: 'disorder' | 'selfcare'
  icon: string
  readTime: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
}

// Mental health disorders will use the original DisplayCard component

const selfCareTechniques: ResourceCard[] = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Learn various breathing techniques to manage anxiety and promote relaxation.',
    category: 'selfcare',
    icon: '🫁',
    readTime: '5 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Meditation',
    description: 'Introduction to mindfulness practices and guided meditation techniques.',
    category: 'selfcare',
    icon: '🧘',
    readTime: '7 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'grounding',
    title: 'Grounding Techniques',
    description: '5-4-3-2-1 technique and other grounding methods for anxiety and panic.',
    category: 'selfcare',
    icon: '🌱',
    readTime: '4 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'progressive-relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Step-by-step guide to releasing physical tension and promoting calm.',
    category: 'selfcare',
    icon: '💪',
    readTime: '6 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'cognitive-reframing',
    title: 'Cognitive Reframing',
    description: 'Learn to identify and challenge negative thought patterns.',
    category: 'selfcare',
    icon: '🔄',
    readTime: '10 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene',
    description: 'Essential practices for better sleep and mental health recovery.',
    category: 'selfcare',
    icon: '😴',
    readTime: '8 min read',
    difficulty: 'Beginner'
  },
  {
    id: 'stress-management',
    title: 'Stress Management',
    description: 'Comprehensive strategies for managing daily stress and building resilience.',
    category: 'selfcare',
    icon: '🛡️',
    readTime: '12 min read',
    difficulty: 'Intermediate'
  },
  {
    id: 'emotional-regulation',
    title: 'Emotional Regulation',
    description: 'Advanced techniques for managing intense emotions and mood swings.',
    category: 'selfcare',
    icon: '❤️',
    readTime: '15 min read',
    difficulty: 'Advanced'
  }
]

export default function LearnPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'disorders' | 'selfcare'>('disorders')

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

  const handleResourceClick = (resourceId: string) => {
    // Route all self-care techniques to coming soon page
    router.push('/learn/coming-soon')
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      <Navigation />
      
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-amber-200 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Mental Health Learning Center 📚
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
                Explore comprehensive information about mental health conditions and learn practical self-care techniques.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-amber-200">
              <button
                onClick={() => setActiveTab('disorders')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'disorders'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                🧠 Mental Health Disorders
              </button>
              <button
                onClick={() => setActiveTab('selfcare')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'selfcare'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                🌟 Self-Care Techniques
              </button>
            </div>
          </div>

          {/* Content Section */}
          {activeTab === 'disorders' && (
            <div>
              {/* Important Note */}
              <div className="bg-amber-100/80 rounded-2xl p-6 max-w-4xl mx-auto border border-amber-200 mb-12">
                <p className="text-amber-900 font-medium text-center">
                  <strong>Important Note:</strong> This list is not exhaustive and although these descriptions were written to be as accurate as possible, mental illnesses are nuanced. It is encouraged to use the links provided to learn more.
                </p>
              </div>

              {/* Mental Health Disorders Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <DisplayCard 
                  image='/images/depression.jpg' 
                  alt='photographic representation of depression' 
                  name="Depression" 
                  desc="Depression is a common mental health condition characterized by persistent low mood, low energy and a loss of interest in daily activities. Depression can significantly interfere with a persons ability to engage in daily life." 
                  link='https://www.who.int/news-room/fact-sheets/detail/depression'
                />
                <DisplayCard 
                  image='/images/anxiety.jpg' 
                  alt='photographic representation of anxiety' 
                  name="Anxiety" 
                  desc="Anxiety is a condition in which the individual experiences persistent and intense episodes of fear and nervousness, which can be triggered by specific situations." 
                  link='https://my.clevelandclinic.org/health/diseases/9536-anxiety-disorders'
                />
                <DisplayCard 
                  image='/images/bipolar-disorder.png' 
                  alt='photographic representation of bipolar disorder' 
                  name="Bipolar Disorder" 
                  desc="Bipolar disorder is a mental health condition characterized by extreme mood swings that include emotional highs (mania or hypomania) and lows (depression)." 
                  link='https://my.clevelandclinic.org/health/diseases/9294-bipolar-disorder'
                />
                <DisplayCard 
                  image='/images/schizophrenia.webp' 
                  alt='photographic representation of schizophrenia' 
                  name='Schizophrenia' 
                  desc='Schizophrenia is a chronic mental illness characterized by disruptions in a persons thought processes, perceptions, emotions and social interactions' 
                  link='https://www.mayoclinic.org/diseases-conditions/schizophrenia/symptoms-causes/syc-20354443'
                />
                <DisplayCard 
                  image='/images/schizoaffective.png' 
                  alt='photographic representation of schizoaffective disorder' 
                  name='Schizoaffective Disorder' 
                  desc='Schizoaffective disorder is a mental health condition that includes symptoms of both schizophrenia and a mood disorder such as bipolar disorder or depression.' 
                  link='https://www.mayoclinic.org/diseases-conditions/schizoaffective-disorder/symptoms-causes/syc-20354504'
                />
                <DisplayCard 
                  image='/images/ocd.jpg' 
                  alt='photographic representation of OCD' 
                  name='Obsessive-Compulsive Disorder' 
                  desc='Obsessive-compulsive disorder (OCD) is a mental health condition characterized by persistent, unwanted thoughts (obsessions) and repetitive behaviors (compulsions).' 
                  link='https://iocdf.org/about-ocd/'
                />
                <DisplayCard 
                  image='/images/adhd.jpg' 
                  alt='photographic representation of ADHD' 
                  name='Attention-Deficit/Hyperactivity Disorder' 
                  desc='Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder that affects a persons ability to pay attention, control impulsive behaviors and manage energy levels.' 
                  link='https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/what-is-adhd'
                />
                <DisplayCard 
                  image='/images/autism.jpg' 
                  alt='photographic representation of autism' 
                  name='Autism Spectrum Disorder' 
                  desc='Autism spectrum disorder (ASD) is a developmental disorder that affects communication and behavior. Although autism can be diagnosed at any age, it is said to be a "developmental disorder" because symptoms generally appear in the first two years of life.' 
                  link='https://www.mayoclinic.org/diseases-conditions/autism-spectrum-disorder/symptoms-causes/syc-20352928'
                />
                <DisplayCard 
                  image='/images/bpd.jpg' 
                  alt='photographic representation of borderline personality disorder' 
                  name='Borderline Personality Disorder' 
                  desc='Borderline personality disorder (BPD) is a mental health condition characterized by intense, unstable emotions, impulsive behaviors, and difficulty maintaining relationships.' 
                  link='https://www.mayoclinic.org/diseases-conditions/borderline-personality-disorder/symptoms-causes/syc-20370237'
                />
                <DisplayCard 
                  image='/images/eating-disorder.jpg' 
                  alt='photographic representation of eating disorder' 
                  name='Eating Disorders' 
                  desc='Eating disorders are a range of psychological conditions that cause unhealthy eating habits to develop. They might start with an obsession with food, body weight, or body shape.' 
                  link='https://www.mayoclinic.org/diseases-conditions/eating-disorders/symptoms-causes/syc-20353603'
                />
                <DisplayCard 
                  image='/images/ptsd.jpg' 
                  alt='photographic representation of PTSD' 
                  name='Post-Traumatic Stress Disorder' 
                  desc='Post-traumatic stress disorder (PTSD) is a mental health condition that is triggered by a terrifying event — either experiencing it or witnessing it.' 
                  link='https://www.mayoclinic.org/diseases-conditions/post-traumatic-stress-disorder/symptoms-causes/syc-20355967'
                />
              </div>
            </div>
          )}

          {activeTab === 'selfcare' && (
            <div>
              {/* Self-Care Techniques Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selfCareTechniques.map((resource) => (
                  <div
                    key={resource.id}
                    onClick={() => handleResourceClick(resource.id)}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {resource.icon}
                      </div>
                      <h3 className="text-xl font-bold text-amber-900 mb-2">
                        {resource.title}
                      </h3>
                    </div>
                    
                    <p className="text-amber-800 text-sm leading-relaxed mb-4">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                        {resource.readTime}
                      </span>
                      {resource.difficulty && (
                        <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <span className="text-amber-600 text-sm font-medium group-hover:text-amber-700">
                        Click to learn more →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  11
                </div>
                <div className="text-amber-800">Mental Health Topics</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {selfCareTechniques.length}
                </div>
                <div className="text-amber-800">Self-Care Techniques</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-900 mb-2">
                  {selfCareTechniques.reduce((acc, r) => acc + parseInt(r.readTime), 0)}
                </div>
                <div className="text-amber-800">Minutes of Content</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Need Support?</h3>
              <p className="text-amber-800">
                If you or someone you know is struggling with mental health, remember that help is available. 
                These resources are educational - always consult with healthcare professionals for personalized advice.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
} 