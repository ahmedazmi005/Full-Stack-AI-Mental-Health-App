'use client'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import DisplayCard from '../components/displaycard'

export default function DashboardPage() {
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
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-amber-200 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Mental Health Learning Center 📚
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-3xl mx-auto">
                Explore comprehensive information about various mental health conditions and treatments.
              </p>
            </div>
            
            <div className="bg-amber-100/80 rounded-2xl p-6 max-w-4xl mx-auto border border-amber-200">
              <p className="text-amber-900 font-medium">
                <strong>Important Note:</strong> This list is not exhaustive and although these descriptions were written to be as accurate as possible, mental illnesses are nuanced. It is encouraged to use the links provided to learn more.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
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