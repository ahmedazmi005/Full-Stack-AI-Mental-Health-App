'use client'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export default function Navigation() {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-amber-100 to-yellow-100 shadow-lg sticky top-0 z-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-800 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-amber-900 hover:text-amber-800 transition-colors">
              Mental Health Awareness
            </span>
          </Link>
          
          {/* Centered Navigation Links */}
          <div className="flex space-x-8 items-center">
            <Link 
              href="/home" 
              className="text-amber-800 hover:text-amber-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-amber-200/50"
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="text-amber-800 hover:text-amber-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-amber-200/50"
            >
              Learn
            </Link>
            <Link 
              href="/chatbot" 
              className="text-amber-800 hover:text-amber-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-amber-200/50"
            >
              AI Assistant
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <span className="text-amber-800 font-medium">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={() => signOut()}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
