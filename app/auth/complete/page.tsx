'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCompletePage() {
  const router = useRouter()

  useEffect(() => {
    async function finish() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: existing } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', session.user.email)
        .single()

      if (existing) {
        // Returning user — route to their dashboard
        if (existing.role === 'brand' || existing.role === 'admin') {
          router.push('/')
        } else {
          router.push('/creator-welcome')
        }
      } else {
        // New user — send to onboarding to fill in details
        router.push('/onboarding')
      }
    }

    finish()
  }, [router])

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <p
          className="text-2xl font-light text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          CREATR.UGC
        </p>
        <p className="text-sm text-[#888888] mt-2">Signing you in...</p>
      </div>
    </div>
  )
}
