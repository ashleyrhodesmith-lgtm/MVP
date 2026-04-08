'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building2, User } from 'lucide-react'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'brand' | 'creator' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    if (!selectedRole) return
    setLoading(true)
    setError(null)

    localStorage.setItem('creatr_role', selectedRole)

    console.log('Starting OAuth with role:', selectedRole)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })

    if (error) {
      console.error('OAuth error:', error.message)
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="max-w-[400px] w-full">

        <p
          className="text-xl font-light text-white text-center mb-10 tracking-widest"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          CREATR.UGC
        </p>

        <h1
          className="text-4xl font-light text-white text-center mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Welcome
        </h1>
        <p className="text-sm text-[#888888] text-center mb-8">
          Choose how you want to continue
        </p>

        <div className="flex gap-3">
          {/* Brand card */}
          <button
            onClick={() => setSelectedRole('brand')}
            className={
              selectedRole === 'brand'
                ? 'border border-white bg-[#111] rounded-xl p-5 cursor-pointer flex flex-col items-center gap-2 text-center flex-1'
                : 'border border-[#1F1F1F] bg-transparent rounded-xl p-5 cursor-pointer flex flex-col items-center gap-2 text-center flex-1'
            }
          >
            <Building2 size={24} color={selectedRole === 'brand' ? '#FFFFFF' : '#888888'} />
            <span className={`text-sm font-medium ${selectedRole === 'brand' ? 'text-white' : 'text-[#888888]'}`}>
              I'm a Brand
            </span>
            <span className="text-xs text-[#888888]">Find creators</span>
          </button>

          {/* Creator card */}
          <button
            onClick={() => setSelectedRole('creator')}
            className={
              selectedRole === 'creator'
                ? 'border border-white bg-[#111] rounded-xl p-5 cursor-pointer flex flex-col items-center gap-2 text-center flex-1'
                : 'border border-[#1F1F1F] bg-transparent rounded-xl p-5 cursor-pointer flex flex-col items-center gap-2 text-center flex-1'
            }
          >
            <User size={24} color={selectedRole === 'creator' ? '#FFFFFF' : '#888888'} />
            <span className={`text-sm font-medium ${selectedRole === 'creator' ? 'text-white' : 'text-[#888888]'}`}>
              I'm a Creator
            </span>
            <span className="text-xs text-[#888888]">Get discovered</span>
          </button>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={!selectedRole || loading}
          className={
            selectedRole && !loading
              ? 'w-full bg-white text-black text-sm font-medium py-3 rounded-xl mt-6 cursor-pointer hover:opacity-90 transition-opacity'
              : 'w-full bg-[#888] text-black text-sm font-medium py-3 rounded-xl mt-6 opacity-50 cursor-not-allowed'
          }
        >
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {error && (
          <p className="text-xs text-[#F87171] text-center mt-3">{error}</p>
        )}

        <p className="text-xs text-[#888888] text-center mt-3">
          By continuing you agree to our terms.
        </p>
      </div>
    </div>
  )
}
