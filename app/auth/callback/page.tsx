'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Code exchange failed:', error.message)
          router.push('/login')
          return
        }
      }

      router.push('/auth/complete')
    }

    handleCallback()
  }, [router, searchParams])

  return null
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <p
        className="text-2xl font-light text-white"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        CREATR.UGC
      </p>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  )
}
