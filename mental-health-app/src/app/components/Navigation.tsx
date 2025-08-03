'use client'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export default function Navigation() {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Mental Health Awareness
          </Link>
          
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Welcome, {user?.name}</span>
                <Link 
                  href="/chatbot" 
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Chatbot
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-red-600 hover:text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-[#E9C2A6] text-black px-4 py-2 rounded hover:bg-[#d4a574]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```
