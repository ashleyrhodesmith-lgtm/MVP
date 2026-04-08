'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
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
          Sign in to continue
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={
            loading
              ? 'w-full bg-[#888] text-black text-sm font-medium py-3 rounded-xl cursor-not-allowed opacity-50'
              : 'w-full bg-white text-black text-sm font-medium py-3 rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
          }
        >
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {error && (
          <p className="text-xs text-[#F87171] text-center mt-3">{error}</p>
        )}

        <p className="text-xs text-[#888888] text-center mt-4">
          By continuing you agree to our terms.
        </p>
      </div>
    </div>
  )
}
