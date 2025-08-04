'use client'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/home')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center px-6" style={{backgroundColor: '#E9C2A6'}}>
      <div className="w-full max-w-md">
        
        {/* Logo Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-amber-900">Mental Health Awareness</span>
          </Link>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome back</h1>
          <p className="text-amber-800">Sign in to access your mental health resources</p>
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
                placeholder="Enter your password"
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
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-4 text-center">
            <Link 
              href="/signup" 
              className="block text-amber-800 hover:text-amber-900 font-semibold transition-colors"
            >
              Don't have an account? Sign up
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