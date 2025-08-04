'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'

interface ProfileData {
  dateJoined: string
  lastActive: string
  bio?: string
  preferences: {
    focusAreas: string[]
    notificationSettings: {
      dailyReminders: boolean
      weeklyCheckins: boolean
      emergencyResources: boolean
    }
    privacySettings: {
      shareProgress: boolean
      anonymousMode: boolean
    }
  }
  mentalHealthData: {
    favoriteResources: any[]
    moodTracking: {
      date: string
      mood: number
      notes?: string
      triggers?: string[]
      copingStrategies?: string[]
    }[]

    achievements: any[]
    weeklyCheckins: {
      date: string
      overallMood: number
      sleepQuality: number
      stressLevel: number
      exerciseFrequency: number
      socialConnection: number
      notes?: string
      improvements?: string[]
      challenges?: string[]
    }[]
  }
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    focusAreas: [] as string[],
    dailyReminders: true,
    weeklyCheckins: true,
    emergencyResources: true,
    shareProgress: false,
    anonymousMode: false
  })

  // Mood entry state
  const [moodEntry, setMoodEntry] = useState({
    mood: 0,
    notes: '',
    triggers: [] as string[],
    copingStrategies: [] as string[]
  })

  // Weekly check-in state
  const [weeklyCheckin, setWeeklyCheckin] = useState({
    overallMood: 0,
    sleepQuality: 0,
    stressLevel: 0,
    exerciseFrequency: 0,
    socialConnection: 0,
    notes: '',
    improvements: [] as string[],
    challenges: [] as string[]
  })
  const [isAddingCheckin, setIsAddingCheckin] = useState(false)


  // Available focus areas
  const availableFocusAreas = [
    'Anxiety', 'Depression', 'Stress Management', 'ADHD', 'OCD', 
    'PTSD', 'Eating Disorders', 'Sleep Issues', 'Social Anxiety',
    'Panic Disorders', 'Bipolar Disorder', 'Self-Esteem', 'Grief',
    'Relationship Issues', 'Work Stress', 'Academic Pressure'
  ]

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Load profile data
  useEffect(() => {
    if (user) {
      loadProfileData()
    }
  }, [user])

  const loadProfileData = async () => {
    try {
      const response = await fetch(`/api/profile/${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfileData(data.profile)
        setEditForm({
          focusAreas: data.profile.preferences.focusAreas || [],
          dailyReminders: data.profile.preferences.notificationSettings.dailyReminders,
          weeklyCheckins: data.profile.preferences.notificationSettings.weeklyCheckins,
          emergencyResources: data.profile.preferences.notificationSettings.emergencyResources,
          shareProgress: data.profile.preferences.privacySettings.shareProgress,
          anonymousMode: data.profile.preferences.privacySettings.anonymousMode
        })
      }
    } catch (error) {
      console.error('Failed to load profile data:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            ...profileData?.preferences,
            focusAreas: editForm.focusAreas,
            notificationSettings: {
              dailyReminders: editForm.dailyReminders,
              weeklyCheckins: editForm.weeklyCheckins,
              emergencyResources: editForm.emergencyResources
            },
            privacySettings: {
              shareProgress: editForm.shareProgress,
              anonymousMode: editForm.anonymousMode
            }
          }
        })
      })

      if (response.ok) {
        loadProfileData()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }



  const toggleFocusArea = (area: string) => {
    setEditForm(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }))
  }

  const getMoodAverage = () => {
    if (!profileData?.mentalHealthData?.moodTracking?.length) return 0
    const sum = profileData.mentalHealthData.moodTracking.reduce((acc, entry) => acc + entry.mood, 0)
    return (sum / profileData.mentalHealthData.moodTracking.length).toFixed(1)
  }

  const getRecentMoodTrend = () => {
    if (!profileData?.mentalHealthData?.moodTracking?.length) return 'neutral'
    const recent = profileData.mentalHealthData.moodTracking.slice(-5)
    if (recent.length < 2) return 'neutral'
    
    const first = recent[0].mood
    const last = recent[recent.length - 1].mood
    
    if (last > first + 1) return 'improving'
    if (last < first - 1) return 'declining'
    return 'stable'
  }

  const handleAddMoodEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (moodEntry.mood === 0) return

    try {
      const response = await fetch(`/api/profile/${user?.id}/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodEntry)
      })

      if (response.ok) {
        // Reset form
        setMoodEntry({
          mood: 0,
          notes: '',
          triggers: [],
          copingStrategies: []
        })
        
        // Reload data to show new entry
        loadProfileData()
      } else {
        console.error('Failed to save mood entry')
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error)
    }
  }

  const getCommonTriggers = () => {
    if (!profileData?.mentalHealthData?.moodTracking?.length) return []
    
    const allTriggers: { [key: string]: number } = {}
    profileData.mentalHealthData.moodTracking.forEach(entry => {
      entry.triggers?.forEach(trigger => {
        allTriggers[trigger] = (allTriggers[trigger] || 0) + 1
      })
    })
    
    return Object.entries(allTriggers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  const getCommonStrategies = () => {
    if (!profileData?.mentalHealthData?.moodTracking?.length) return []
    
    const allStrategies: { [key: string]: number } = {}
    profileData.mentalHealthData.moodTracking.forEach(entry => {
      entry.copingStrategies?.forEach(strategy => {
        allStrategies[strategy] = (allStrategies[strategy] || 0) + 1
      })
    })
    
    return Object.entries(allStrategies)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  const handleAddWeeklyCheckin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (weeklyCheckin.overallMood === 0) return

    try {
      const response = await fetch(`/api/profile/${user?.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weeklyCheckin)
      })

      if (response.ok) {
        // Reset form
        setWeeklyCheckin({
          overallMood: 0,
          sleepQuality: 0,
          stressLevel: 0,
          exerciseFrequency: 0,
          socialConnection: 0,
          notes: '',
          improvements: [],
          challenges: []
        })
        setIsAddingCheckin(false)
        
        // Reload data to show new check-in
        loadProfileData()
      } else {
        console.error('Failed to save weekly check-in')
      }
    } catch (error) {
      console.error('Failed to save weekly check-in:', error)
    }
  }

  const getLastCheckinDate = () => {
    if (!profileData?.mentalHealthData?.weeklyCheckins?.length) return null
    const lastCheckin = profileData.mentalHealthData.weeklyCheckins[profileData.mentalHealthData.weeklyCheckins.length - 1]
    return new Date(lastCheckin.date)
  }

  const shouldShowCheckinPrompt = () => {
    const lastCheckin = getLastCheckinDate()
    if (!lastCheckin) return true // Never done a check-in
    
    const daysSinceLastCheckin = Math.floor((Date.now() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceLastCheckin >= 7 // Show if it's been a week or more
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
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" style={{backgroundColor: '#E9C2A6'}}>
      <Navigation />
      
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-amber-900 mb-2">
                {user?.name}'s Profile
              </h1>
              <p className="text-amber-800">
                Manage your mental health journey and preferences
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: '👤' },
                  { id: 'progress', label: 'Progress', icon: '📈' },
                  { id: 'preferences', label: 'Preferences', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-800 to-yellow-700 text-white shadow-md'
                        : 'text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Focus Areas */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-amber-900">Focus Areas</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-amber-800 hover:text-amber-900 font-medium"
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <p className="text-sm text-amber-700 mb-3">Select areas you'd like to focus on:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {availableFocusAreas.map((area) => (
                          <button
                            key={area}
                            onClick={() => toggleFocusArea(area)}
                            className={`text-left p-2 rounded-lg text-sm transition-all ${
                              editForm.focusAreas.includes(area)
                                ? 'bg-amber-200 text-amber-900 border border-amber-400'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        className="w-full bg-gradient-to-r from-amber-800 to-yellow-700 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-900 hover:to-yellow-800 transition-all mt-4"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profileData?.preferences.focusAreas.length ? (
                        profileData.preferences.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                          >
                            {area}
                          </span>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-amber-600 mb-4">No focus areas selected yet</p>
                          <p className="text-sm text-amber-500">Click "Edit" above to choose areas you'd like to focus on</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">⭐</span>
                      </div>
                      <div className="text-2xl font-bold text-amber-800">
                        {profileData?.mentalHealthData?.favoriteResources?.length || 0}
                      </div>
                      <div className="text-sm text-amber-600">Saved Resources</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-700 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">📅</span>
                      </div>
                      <div className="text-2xl font-bold text-amber-800">
                        {profileData?.mentalHealthData?.weeklyCheckins?.length || 0}
                      </div>
                      <div className="text-sm text-amber-600">Weekly Check-ins</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">📊</span>
                      </div>
                      <div className="text-2xl font-bold text-amber-800">
                        {profileData?.mentalHealthData?.moodTracking?.length || 0}
                      </div>
                      <div className="text-sm text-amber-600">Mood Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">🏆</span>
                      </div>
                      <div className="text-2xl font-bold text-amber-800">
                        {profileData?.mentalHealthData?.achievements?.length || 0}
                      </div>
                      <div className="text-sm text-amber-600">Achievements</div>
                    </div>
                  </div>

                  {/* Member since info */}
                  <div className="mt-6 pt-6 border-t border-amber-200 text-center">
                    <p className="text-amber-700">
                      <span className="font-medium">Member since:</span>{' '}
                      {profileData?.dateJoined ? new Date(profileData.dateJoined).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                
                {/* Mood Tracking Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl">😊</span>
                    </div>
                    <h4 className="text-lg font-bold text-amber-900 mb-2">Average Mood</h4>
                    <div className="text-3xl font-bold text-amber-800">{getMoodAverage()}/10</div>
                    <p className="text-amber-600 text-sm mt-2">
                      {profileData?.mentalHealthData?.moodTracking?.length || 0} entries
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      getRecentMoodTrend() === 'improving' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      getRecentMoodTrend() === 'declining' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      'bg-gradient-to-br from-gray-500 to-gray-600'
                    }`}>
                      <span className="text-white text-xl">
                        {getRecentMoodTrend() === 'improving' ? '📈' : 
                         getRecentMoodTrend() === 'declining' ? '📉' : '➡️'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-amber-900 mb-2">Recent Trend</h4>
                    <div className="text-lg font-semibold text-amber-800 capitalize">{getRecentMoodTrend()}</div>
                    <p className="text-amber-600 text-sm mt-2">Last 5 entries</p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl">📅</span>
                    </div>
                    <h4 className="text-lg font-bold text-amber-900 mb-2">Check-ins</h4>
                    <div className="text-3xl font-bold text-amber-800">
                      {profileData?.mentalHealthData?.weeklyCheckins?.length || 0}
                    </div>
                    <p className="text-amber-600 text-sm mt-2">Weekly reviews</p>
                  </div>
                </div>

                {/* Weekly Check-in Prompt */}
                {shouldShowCheckinPrompt() && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg border border-purple-200 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-purple-900 mb-2">📅 Time for Your Weekly Check-in!</h3>
                        <p className="text-purple-700">
                          {getLastCheckinDate() 
                            ? `It's been ${Math.floor((Date.now() - getLastCheckinDate()!.getTime()) / (1000 * 60 * 60 * 24))} days since your last check-in.`
                            : "Start your first weekly reflection to track your overall wellness."
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddingCheckin(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      >
                        Start Check-in
                      </button>
                    </div>
                  </div>
                )}

                {/* Weekly Check-in Form */}
                {isAddingCheckin && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-amber-900">Weekly Check-in</h3>
                      <button
                        onClick={() => setIsAddingCheckin(false)}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <form onSubmit={handleAddWeeklyCheckin} className="space-y-6">
                      
                      {/* Overall Mood */}
                      <div>
                        <label className="block text-sm font-semibold text-amber-900 mb-3">
                          How was your overall mood this week? (1-10)
                        </label>
                        <div className="flex justify-between items-center mb-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                            <button
                              key={mood}
                              type="button"
                              onClick={() => setWeeklyCheckin(prev => ({ ...prev, overallMood: mood }))}
                              className={`w-10 h-10 rounded-full font-bold text-white transition-all ${
                                weeklyCheckin.overallMood === mood
                                  ? 'scale-110 shadow-lg'
                                  : 'hover:scale-105'
                              } ${
                                mood <= 3 ? 'bg-red-500 hover:bg-red-600' :
                                mood <= 5 ? 'bg-orange-500 hover:bg-orange-600' :
                                mood <= 7 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                'bg-green-500 hover:bg-green-600'
                              }`}
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Multi-dimensional ratings */}
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Sleep Quality */}
                        <div>
                          <label className="block text-sm font-semibold text-amber-900 mb-3">
                            Sleep Quality (1-10)
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setWeeklyCheckin(prev => ({ ...prev, sleepQuality: rating }))}
                                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                                  weeklyCheckin.sleepQuality === rating
                                    ? 'bg-blue-600 text-white scale-110'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Stress Level */}
                        <div>
                          <label className="block text-sm font-semibold text-amber-900 mb-3">
                            Stress Level (1=Low, 10=High)
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setWeeklyCheckin(prev => ({ ...prev, stressLevel: rating }))}
                                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                                  weeklyCheckin.stressLevel === rating
                                    ? 'bg-red-600 text-white scale-110'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Exercise Frequency */}
                        <div>
                          <label className="block text-sm font-semibold text-amber-900 mb-3">
                            Exercise/Physical Activity (1-10)
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setWeeklyCheckin(prev => ({ ...prev, exerciseFrequency: rating }))}
                                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                                  weeklyCheckin.exerciseFrequency === rating
                                    ? 'bg-green-600 text-white scale-110'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Social Connection */}
                        <div>
                          <label className="block text-sm font-semibold text-amber-900 mb-3">
                            Social Connection (1-10)
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setWeeklyCheckin(prev => ({ ...prev, socialConnection: rating }))}
                                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                                  weeklyCheckin.socialConnection === rating
                                    ? 'bg-purple-600 text-white scale-110'
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Improvements */}
                      <div>
                        <label className="block text-sm font-semibold text-amber-900 mb-2">
                          What went well this week? (Optional)
                        </label>
                        <input
                          type="text"
                          value={weeklyCheckin.improvements.join(', ')}
                          onChange={(e) => setWeeklyCheckin(prev => ({ 
                            ...prev, 
                            improvements: e.target.value.split(',').map(i => i.trim()).filter(i => i) 
                          }))}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                          placeholder="e.g., stuck to sleep schedule, had great conversation with friend (separate with commas)"
                        />
                      </div>

                      {/* Challenges */}
                      <div>
                        <label className="block text-sm font-semibold text-amber-900 mb-2">
                          What was challenging this week? (Optional)
                        </label>
                        <input
                          type="text"
                          value={weeklyCheckin.challenges.join(', ')}
                          onChange={(e) => setWeeklyCheckin(prev => ({ 
                            ...prev, 
                            challenges: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                          }))}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                          placeholder="e.g., work deadlines, family stress, sleep issues (separate with commas)"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-semibold text-amber-900 mb-2">
                          Weekly Reflection (Optional)
                        </label>
                        <textarea
                          value={weeklyCheckin.notes}
                          onChange={(e) => setWeeklyCheckin(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                          rows={3}
                          placeholder="Any thoughts about this week? What do you want to focus on next week?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={weeklyCheckin.overallMood === 0}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Complete Weekly Check-in
                      </button>
                    </form>
                  </div>
                )}

                {/* Add New Mood Entry */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Log Your Mood Today</h3>
                  <form onSubmit={handleAddMoodEntry} className="space-y-6">
                    
                    {/* Mood Scale */}
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-3">
                        How are you feeling today? (1 = Very Low, 10 = Excellent)
                      </label>
                      <div className="flex justify-between items-center mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                          <button
                            key={mood}
                            type="button"
                            onClick={() => setMoodEntry(prev => ({ ...prev, mood }))}
                            className={`w-12 h-12 rounded-full font-bold text-white transition-all ${
                              moodEntry.mood === mood
                                ? 'scale-125 shadow-lg'
                                : 'hover:scale-110'
                            } ${
                              mood <= 3 ? 'bg-red-500 hover:bg-red-600' :
                              mood <= 5 ? 'bg-orange-500 hover:bg-orange-600' :
                              mood <= 7 ? 'bg-yellow-500 hover:bg-yellow-600' :
                              'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-amber-600">
                        <span>Very Low</span>
                        <span>Neutral</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={moodEntry.notes}
                        onChange={(e) => setMoodEntry(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                        rows={3}
                        placeholder="What's influencing your mood today? Any thoughts or observations..."
                      />
                    </div>

                    {/* Triggers */}
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">
                        Triggers (Optional)
                      </label>
                      <input
                        type="text"
                        value={moodEntry.triggers.join(', ')}
                        onChange={(e) => setMoodEntry(prev => ({ 
                          ...prev, 
                          triggers: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                        }))}
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                        placeholder="e.g., work stress, lack of sleep, social anxiety (separate with commas)"
                      />
                    </div>

                    {/* Coping Strategies */}
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">
                        What Helped Today? (Optional)
                      </label>
                      <input
                        type="text"
                        value={moodEntry.copingStrategies.join(', ')}
                        onChange={(e) => setMoodEntry(prev => ({ 
                          ...prev, 
                          copingStrategies: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                        }))}
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                        placeholder="e.g., meditation, exercise, talking to friend (separate with commas)"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={moodEntry.mood === 0}
                      className="w-full bg-gradient-to-r from-amber-800 to-yellow-700 text-white py-3 rounded-xl font-medium hover:from-amber-900 hover:to-yellow-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Mood Entry
                    </button>
                  </form>
                </div>

                {/* Recent Mood Entries */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Recent Mood Entries</h3>
                  {profileData?.mentalHealthData?.moodTracking?.length ? (
                    <div className="space-y-4">
                      {profileData.mentalHealthData.moodTracking.slice(-7).reverse().map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              entry.mood >= 8 ? 'bg-green-500' :
                              entry.mood >= 6 ? 'bg-yellow-500' :
                              entry.mood >= 4 ? 'bg-orange-500' : 'bg-red-500'
                            }`}>
                              <span className="text-white font-bold">{entry.mood}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-amber-900">
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              {entry.notes && (
                                <p className="text-amber-700 text-sm mt-1">{entry.notes}</p>
                              )}
                              {entry.triggers && entry.triggers.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-amber-600">Triggers: </span>
                                  {entry.triggers.map((trigger, i) => (
                                    <span key={i} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs mr-1">
                                      {trigger}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {entry.copingStrategies && entry.copingStrategies.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-amber-600">Helped: </span>
                                  {entry.copingStrategies.map((strategy, i) => (
                                    <span key={i} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mr-1">
                                      {strategy}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-800">{entry.mood}/10</div>
                            <div className="text-xs text-amber-600">
                              {new Date(entry.date).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📝</span>
                      </div>
                      <h4 className="text-xl font-bold text-amber-900 mb-2">Start Tracking Your Mood</h4>
                      <p className="text-amber-600 mb-6">
                        Log your daily mood to identify patterns and track your mental health journey
                      </p>
                      <p className="text-sm text-amber-500">
                        Understanding your mood patterns can help you recognize triggers and effective coping strategies
                      </p>
                    </div>
                  )}
                </div>

                {/* Recent Weekly Check-ins */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Recent Weekly Check-ins</h3>
                  {profileData?.mentalHealthData?.weeklyCheckins?.length ? (
                    <div className="space-y-4">
                      {profileData.mentalHealthData.weeklyCheckins.slice(-3).reverse().map((checkin, index) => (
                        <div key={index} className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-purple-900">
                                Week of {new Date(checkin.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </h4>
                              <div className="text-2xl font-bold text-purple-800 mt-1">
                                Overall Mood: {checkin.overallMood}/10
                              </div>
                            </div>
                          </div>

                          {/* Multi-dimensional scores */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Sleep</div>
                              <div className={`text-lg font-bold ${
                                checkin.sleepQuality >= 7 ? 'text-green-600' :
                                checkin.sleepQuality >= 5 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {checkin.sleepQuality}/10
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Stress</div>
                              <div className={`text-lg font-bold ${
                                checkin.stressLevel <= 3 ? 'text-green-600' :
                                checkin.stressLevel <= 6 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {checkin.stressLevel}/10
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Exercise</div>
                              <div className={`text-lg font-bold ${
                                checkin.exerciseFrequency >= 7 ? 'text-green-600' :
                                checkin.exerciseFrequency >= 5 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {checkin.exerciseFrequency}/10
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Social</div>
                              <div className={`text-lg font-bold ${
                                checkin.socialConnection >= 7 ? 'text-green-600' :
                                checkin.socialConnection >= 5 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {checkin.socialConnection}/10
                              </div>
                            </div>
                          </div>

                          {/* Improvements and Challenges */}
                          {(checkin.improvements && checkin.improvements.length > 0) && (
                            <div className="mb-3">
                              <span className="text-xs text-green-600 font-medium">What went well: </span>
                              {checkin.improvements.map((improvement, i) => (
                                <span key={i} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mr-1">
                                  {improvement}
                                </span>
                              ))}
                            </div>
                          )}

                          {(checkin.challenges && checkin.challenges.length > 0) && (
                            <div className="mb-3">
                              <span className="text-xs text-red-600 font-medium">Challenges: </span>
                              {checkin.challenges.map((challenge, i) => (
                                <span key={i} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs mr-1">
                                  {challenge}
                                </span>
                              ))}
                            </div>
                          )}

                          {checkin.notes && (
                            <div className="mt-3 p-3 bg-white/70 rounded-lg">
                              <p className="text-purple-800 text-sm italic">"{checkin.notes}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📅</span>
                      </div>
                      <h4 className="text-xl font-bold text-purple-900 mb-2">No Weekly Check-ins Yet</h4>
                      <p className="text-purple-600 mb-6">
                        Weekly check-ins help you reflect on your overall wellness and track patterns over time
                      </p>
                      <button
                        onClick={() => setIsAddingCheckin(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      >
                        Start Your First Check-in
                      </button>
                    </div>
                  )}
                </div>

                {/* Mood Insights */}
                {(profileData?.mentalHealthData?.moodTracking?.length || 0) >= 7 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                    <h3 className="text-xl font-bold text-amber-900 mb-6">Insights & Patterns</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* Common Triggers */}
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-3">Most Common Triggers</h4>
                        <div className="space-y-2">
                          {getCommonTriggers().slice(0, 5).map((trigger, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                              <span className="text-red-800 text-sm">{trigger.name}</span>
                              <span className="text-red-600 text-xs">{trigger.count} times</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Effective Strategies */}
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-3">Effective Coping Strategies</h4>
                        <div className="space-y-2">
                          {getCommonStrategies().slice(0, 5).map((strategy, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                              <span className="text-green-800 text-sm">{strategy.name}</span>
                              <span className="text-green-600 text-xs">{strategy.count} times</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}



            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                
                {/* Notification Settings */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Notification Settings</h3>
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-amber-900">Daily Reminders</h4>
                        <p className="text-amber-700 text-sm">Get gentle daily reminders for mood check-ins and self-care</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.dailyReminders}
                          onChange={(e) => setEditForm(prev => ({ ...prev, dailyReminders: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-amber-900">Weekly Check-ins</h4>
                        <p className="text-amber-700 text-sm">Receive weekly prompts for deeper reflection and progress review</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.weeklyCheckins}
                          onChange={(e) => setEditForm(prev => ({ ...prev, weeklyCheckins: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-amber-900">Emergency Resources</h4>
                        <p className="text-amber-700 text-sm">Show crisis support information and hotline numbers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.emergencyResources}
                          onChange={(e) => setEditForm(prev => ({ ...prev, emergencyResources: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Privacy Settings</h3>
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-amber-900">Share Progress</h4>
                        <p className="text-amber-700 text-sm">Allow sharing achievements and milestones with the community</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.shareProgress}
                          onChange={(e) => setEditForm(prev => ({ ...prev, shareProgress: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-amber-900">Anonymous Mode</h4>
                        <p className="text-amber-700 text-sm">Hide your name and use anonymous identifiers in shared content</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.anonymousMode}
                          onChange={(e) => setEditForm(prev => ({ ...prev, anonymousMode: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Save Preferences Button */}
                <div className="text-center">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-amber-800 to-yellow-700 text-white px-8 py-3 rounded-xl font-medium hover:from-amber-900 hover:to-yellow-800 transition-all shadow-lg"
                  >
                    Save All Preferences
                  </button>
                </div>

                {/* Data & Account */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-6">Data & Account</h3>
                  <div className="space-y-4">
                    
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Export Your Data</h4>
                      <p className="text-blue-700 text-sm mb-3">Download a copy of all your mental health data</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                        Download Data
                      </button>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                      <p className="text-red-700 text-sm mb-3">Permanently delete your account and all associated data</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-all">
                        Delete Account
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
} 