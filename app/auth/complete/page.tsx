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
        .eq('id', session.user.id)
        .single()

      if (existing) {
        // Profile exists — use stored role, ignore localStorage
        localStorage.removeItem('creatr_role')
        if (existing.role === 'brand' || existing.role === 'admin') {
          router.push('/')
        } else {
          router.push('/creator-welcome')
        }
      } else {
        // New user — create profile from localStorage role
        const role = localStorage.getItem('creatr_role') || 'brand'
        await supabase.from('profiles').insert({
          id: session.user.id,
          role,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          plan: 'free',
        })
        localStorage.removeItem('creatr_role')
        if (role === 'brand' || role === 'admin') {
          router.push('/')
        } else {
          router.push('/creator-welcome')
        }
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
        <p className="text-sm text-[#888888] mt-2">Setting up your account...</p>
      </div>
    </div>
  )
}
