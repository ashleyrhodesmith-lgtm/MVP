'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building2, User } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'brand' | 'creator' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      // If they already have a profile, skip onboarding
      const { data: existing } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', session.user.email)
        .single()

      if (existing) {
        if (existing.role === 'brand' || existing.role === 'admin') {
          router.push('/')
        } else {
          router.push('/creator-welcome')
        }
        return
      }

      setSession(session)
    }

    checkSession()
  }, [router])

  const handleContinue = async () => {
    if (!selectedRole || !session) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('profiles').insert({
      id: session.user.id,
      role: selectedRole,
      email: session.user.email,
      name: session.user.user_metadata?.full_name || session.user.email,
      plan: 'free',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (selectedRole === 'brand') {
      router.push('/')
    } else {
      router.push('/creator-welcome')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <p
          className="text-2xl font-light text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          CREATR.UGC
        </p>
      </div>
    )
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
          One last step
        </h1>
        <p className="text-sm text-[#888888] text-center mb-8">
          How do you want to use Creatr?
        </p>

        <div className="flex gap-3">
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
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className={
            selectedRole && !loading
              ? 'w-full bg-white text-black text-sm font-medium py-3 rounded-xl mt-6 cursor-pointer hover:opacity-90 transition-opacity'
              : 'w-full bg-[#888] text-black text-sm font-medium py-3 rounded-xl mt-6 opacity-50 cursor-not-allowed'
          }
        >
          {loading ? 'Setting up…' : 'Get Started'}
        </button>

        {error && (
          <p className="text-xs text-[#F87171] text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  )
}
