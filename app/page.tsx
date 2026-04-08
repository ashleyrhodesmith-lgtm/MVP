'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BrandLayout from '@/components/BrandLayout'
import IntakeForm from '@/components/IntakeForm'
import DiscoveryScreen from '@/components/DiscoveryScreen'
import OutreachScreen from '@/components/OutreachScreen'

type Screen = 'creators' | 'outreach'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null)
  const [activeScreen, setActiveScreen] = useState<Screen>('creators')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!prof || prof.role !== 'brand') { router.push('/login'); return }

      setUser(session.user)
      setProfile(prof)
      setLoading(false)
    }
    init()
  }, [router])

  function handleIntakeSubmit(searchId: string) {
    setCurrentSearchId(searchId)
    setActiveScreen('creators')
  }

  function handleNewSearch() {
    setCurrentSearchId(null)
    setActiveScreen('creators')
  }

  function handleNavChange(id: string) {
    setActiveScreen(id as Screen)
  }

  if (loading) {
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

  function renderContent() {
    if (activeScreen === 'outreach') {
      return <OutreachScreen brandId={profile?.id as string} />
    }

    if (!currentSearchId) {
      return <IntakeForm onSubmit={handleIntakeSubmit} />
    }

    return (
      <DiscoveryScreen
        searchId={currentSearchId}
        brandPlan={(profile?.plan as 'free' | 'pro') ?? 'free'}
      />
    )
  }

  return (
    <BrandLayout
      activeScreen={activeScreen}
      onNavChange={handleNavChange}
      onNewSearch={handleNewSearch}
      profileName={profile?.name as string | undefined}
      profileEmail={profile?.email as string | undefined}
    >
      {renderContent()}
    </BrandLayout>
  )
}
