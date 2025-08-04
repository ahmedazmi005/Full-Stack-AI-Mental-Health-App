'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        router.push('/login?message=Account created successfully')
      } else {
        const data = await response.json()
        setError(data.error || 'An error occurred')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center px-6 py-12" style={{backgroundColor: '#E9C2A6'}}>
      <div className="w-full max-w-md">
        
        {/* Logo Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-amber-900">Mental Health Awareness</span>
          </Link>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Join our community</h1>
          <p className="text-amber-800">Create an account to access mental health resources</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-amber-900 mb-3">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 border border-amber-300 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-amber-900 mb-3">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-amber-300 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-amber-900 mb-3">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border border-amber-300 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Create a password (min 6 characters)"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-amber-900 mb-3">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-4 border border-amber-300 rounded-xl text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-800 to-yellow-700 hover:from-amber-900 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-4 text-center">
            <Link 
              href="/login" 
              className="block text-amber-800 hover:text-amber-900 font-semibold transition-colors"
            >
              Already have an account? Sign in
            </Link>
            
            <Link 
              href="/" 
              className="block text-amber-700 hover:text-amber-800 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 