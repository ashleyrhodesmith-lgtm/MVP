'use client'

import { useRouter } from 'next/navigation'
import { Users, Send, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type NavItem = { label: string; id: string; icon: React.ElementType }

const navItems: NavItem[] = [
  { id: 'creators', label: 'Creators', icon: Users },
  { id: 'outreach', label: 'Outreach', icon: Send },
]

interface BrandLayoutProps {
  children: React.ReactNode
  activeScreen: string
  onNavChange: (id: string) => void
  onNewSearch: () => void
  profileName?: string
  profileEmail?: string
}

export default function BrandLayout({
  children,
  activeScreen,
  onNavChange,
  onNewSearch,
  profileName,
  profileEmail,
}: BrandLayoutProps) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const avatarInitials = profileName
    ? profileName.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="flex flex-col min-h-screen bg-[#000000]">

      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-[#1F1F1F] flex items-center justify-between px-6 z-20">
        <span
          className="text-xl font-light text-white tracking-widest"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          CREATR.UGC
        </span>
        <button
          onClick={onNewSearch}
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          New Search
        </button>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside className="fixed top-14 left-0 w-60 h-[calc(100vh-3.5rem)] bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col justify-between z-10">
          <nav className="pt-6">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeScreen === id
              return (
                <button
                  key={id}
                  onClick={() => onNavChange(id)}
                  className={[
                    'flex items-center gap-3 w-full px-6 py-3 text-sm transition-colors text-left',
                    isActive
                      ? 'text-white border-l-2 border-white pl-[calc(1.5rem-2px)]'
                      : 'text-[#888888] border-l-2 border-transparent hover:text-white',
                  ].join(' ')}
                >
                  <Icon size={16} color={isActive ? '#FFFFFF' : '#888888'} />
                  {label}
                </button>
              )
            })}
          </nav>

          {/* User row */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-[#1F1F1F]">
            <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs text-white shrink-0">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{profileName || 'Brand'}</p>
              <p className="text-xs text-[#888888] truncate">{profileEmail || ''}</p>
            </div>
            <button onClick={handleLogout} className="shrink-0 hover:opacity-70 transition-opacity">
              <LogOut size={14} color="#888888" />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-60 flex-1 overflow-y-auto bg-[#000000] min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
