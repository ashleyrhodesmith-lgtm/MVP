'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ExternalLink } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Creator {
  id: string
  name: string
  instagram_handle: string
  niche: string
  city: string
  follower_count: number
  created_at: string
  status: string
  score_total: number | null
  bio_text?: string
  rejected_reason?: string
}

interface OutreachRequest {
  id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  creator_contact_unlocked?: boolean
  creators: { name: string; instagram_handle: string; niche: string }
  profiles: { name: string; email: string }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const [authLoading, setAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'creators' | 'outreach'>('creators')

  // Creators tab
  const [pendingCreators, setPendingCreators] = useState<Creator[]>([])
  const [activeCreators, setActiveCreators] = useState<Creator[]>([])
  const [creatorsLoading, setCreatorsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Outreach tab
  const [outreachRequests, setOutreachRequests] = useState<OutreachRequest[]>([])
  const [outreachLoading, setOutreachLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Auth guard
  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin') { router.push('/'); return }
      setAuthLoading(false)
    }
    checkAdmin()
  }, [router])

  // Load creators
  useEffect(() => {
    if (authLoading) return
    async function loadCreators() {
      const [{ data: pending }, { data: active }] = await Promise.all([
        supabase.from('creators').select('*').eq('status', 'pending_review').order('created_at', { ascending: false }),
        supabase.from('creators').select('id, name, niche, city, score_total, instagram_handle').eq('status', 'active').order('score_total', { ascending: false }),
      ])
      setPendingCreators((pending as Creator[]) || [])
      setActiveCreators((active as Creator[]) || [])
      setCreatorsLoading(false)
    }
    loadCreators()
  }, [authLoading])

  // Load outreach when tab switches
  useEffect(() => {
    if (activeTab !== 'outreach' || authLoading) return
    async function loadOutreach() {
      setOutreachLoading(true)
      const { data } = await supabase
        .from('outreach_requests')
        .select('*, creators(name, instagram_handle, niche), profiles(name, email)')
        .order('created_at', { ascending: false })
      setOutreachRequests((data as OutreachRequest[]) || [])
      setOutreachLoading(false)
    }
    loadOutreach()
  }, [activeTab, authLoading])

  async function handleApprove(creatorId: string) {
    setActionLoading(creatorId)
    await supabase.from('creators').update({ status: 'active' }).eq('id', creatorId)
    const approved = pendingCreators.find(c => c.id === creatorId)
    if (approved) setActiveCreators(prev => [{ ...approved, status: 'active' }, ...prev])
    setPendingCreators(prev => prev.filter(c => c.id !== creatorId))
    setActionLoading(null)
  }

  async function handleReject(creatorId: string) {
    const reason = window.prompt('Reason for rejection (optional):') ?? ''
    setActionLoading(creatorId)
    await supabase
      .from('creators')
      .update({ status: 'inactive', rejected_reason: reason || null })
      .eq('id', creatorId)
    setPendingCreators(prev => prev.filter(c => c.id !== creatorId))
    setActionLoading(null)
  }

  async function handleMarkAccepted(req: OutreachRequest) {
    setUpdatingId(req.id)
    await supabase
      .from('outreach_requests')
      .update({
        status: 'accepted',
        creator_contact_unlocked: true,
        responded_at: new Date().toISOString(),
      })
      .eq('id', req.id)
    setOutreachRequests(prev =>
      prev.map(r => r.id === req.id ? { ...r, status: 'accepted', creator_contact_unlocked: true } : r)
    )
    setUpdatingId(null)
  }

  async function handleMarkDeclined(req: OutreachRequest) {
    setUpdatingId(req.id)
    await supabase
      .from('outreach_requests')
      .update({ status: 'declined' })
      .eq('id', req.id)
    setOutreachRequests(prev =>
      prev.map(r => r.id === req.id ? { ...r, status: 'declined' } : r)
    )
    setUpdatingId(null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <p className="text-2xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          CREATR.UGC
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-[#1F1F1F] flex items-center justify-between px-6 z-20">
        <span
          className="text-xl font-light text-white tracking-widest"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          CREATR.UGC
        </span>
        <span className="text-xs text-[#888888] uppercase tracking-wider border border-[#1F1F1F] px-2 py-1 rounded-lg">
          Admin
        </span>
      </header>

      <div className="pt-14 max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1F1F1F] mb-8">
          {(['creators', 'outreach'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'pb-3 text-sm capitalize transition-colors',
                activeTab === tab
                  ? 'text-white border-b-2 border-white -mb-px'
                  : 'text-[#888888] hover:text-white',
              ].join(' ')}
            >
              {tab === 'creators' ? 'Creators' : 'Outreach'}
            </button>
          ))}
        </div>

        {/* ── CREATORS TAB ──────────────────────────────────────────── */}
        {activeTab === 'creators' && (
          <div>
            {creatorsLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-5 h-5 border border-[#333] border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Pending section */}
                <div className="flex items-center gap-3 mb-4">
                  <h2
                    className="text-2xl font-light text-white"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Admin — Creator Review
                  </h2>
                  <span className="text-xs text-[#888888]">{pendingCreators.length} pending review</span>
                </div>

                {pendingCreators.length === 0 ? (
                  <p className="text-sm text-[#888888] mb-10">No creators pending review.</p>
                ) : (
                  <div className="flex flex-col gap-3 mb-10">
                    {pendingCreators.map(creator => (
                      <div key={creator.id} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4">
                        {/* Row 1 */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-9 h-9 rounded-full bg-[#1F1F1F] flex items-center justify-center text-sm text-white shrink-0">
                            {getInitials(creator.name)}
                          </div>
                          {creator.instagram_handle ? (
                            <a
                              href={`https://instagram.com/${creator.instagram_handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-white font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              @{creator.instagram_handle}
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-sm text-white font-medium">{creator.name}</span>
                          )}
                          <span className="text-xs text-[#888888] bg-[#1F1F1F] px-2 py-0.5 rounded-full">
                            {creator.niche}
                          </span>
                          {creator.city && (
                            <span className="text-xs text-[#888888]">{creator.city}</span>
                          )}
                          {creator.follower_count && (
                            <span className="text-xs text-[#888888]">
                              {creator.follower_count.toLocaleString()} followers
                            </span>
                          )}
                          <span className="text-xs text-[#444]">{formatDate(creator.created_at)}</span>
                        </div>

                        {/* Row 2 — bio */}
                        {creator.bio_text && (
                          <p className="text-xs text-[#888888] mt-2 ml-12 line-clamp-1">
                            {creator.bio_text.slice(0, 80)}
                          </p>
                        )}

                        {/* Row 3 — actions */}
                        <div className="flex items-center gap-2 mt-3 ml-12">
                          <button
                            disabled={actionLoading === creator.id}
                            onClick={() => handleApprove(creator.id)}
                            className="bg-white text-black text-xs font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={actionLoading === creator.id}
                            onClick={() => handleReject(creator.id)}
                            className="border border-[#F87171] text-[#F87171] text-xs px-4 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Active creators section */}
                <div className="flex items-center gap-3 mb-4">
                  <h3
                    className="text-xl font-light text-white"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Active Creators
                  </h3>
                  <span className="text-xs text-[#888888]">{activeCreators.length} total</span>
                </div>

                {activeCreators.length === 0 ? (
                  <p className="text-sm text-[#888888]">No active creators yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {activeCreators.map((creator, i) => (
                      <div
                        key={creator.id}
                        className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#1F1F1F] rounded-xl"
                      >
                        <span className="text-xs text-[#888888] w-5">{i + 1}</span>
                        <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs text-white shrink-0">
                          {getInitials(creator.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{creator.name}</p>
                          <p className="text-xs text-[#888888]">{creator.niche} · {creator.city}</p>
                        </div>
                        {creator.score_total != null && (
                          <span className="text-sm font-semibold text-white shrink-0">
                            {creator.score_total}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── OUTREACH TAB ──────────────────────────────────────────── */}
        {activeTab === 'outreach' && (
          <div>
            {outreachLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-5 h-5 border border-[#333] border-t-white rounded-full animate-spin" />
              </div>
            ) : outreachRequests.length === 0 ? (
              <p className="text-sm text-[#888888]">No outreach requests yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {outreachRequests.map(req => {
                  const creator = req.creators
                  const brand = req.profiles
                  const isBusy = updatingId === req.id
                  return (
                    <div key={req.id} className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4 flex items-start gap-4">
                      {/* Brand */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#888888] uppercase tracking-wider mb-0.5">Brand</p>
                        <p className="text-sm text-white">{brand?.name || '—'}</p>
                        <p className="text-xs text-[#888888]">{brand?.email}</p>
                      </div>

                      {/* Creator */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#888888] uppercase tracking-wider mb-0.5">Creator</p>
                        {creator?.instagram_handle ? (
                          <a
                            href={`https://instagram.com/${creator.instagram_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white flex items-center gap-1 hover:opacity-80 transition-opacity w-fit"
                          >
                            @{creator.instagram_handle}
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <p className="text-sm text-white">{creator?.name || '—'}</p>
                        )}
                        <p className="text-xs text-[#888888]">{creator?.niche}</p>
                      </div>

                      {/* Date */}
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-[#888888]">{formatDate(req.created_at)}</p>
                      </div>

                      {/* Status + actions */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              disabled={isBusy}
                              onClick={() => handleMarkAccepted(req)}
                              className="bg-white text-black text-xs font-medium px-3 py-1 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                              Mark Accepted
                            </button>
                            <button
                              disabled={isBusy}
                              onClick={() => handleMarkDeclined(req)}
                              className="border border-[#F87171] text-[#F87171] text-xs px-3 py-1 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                            >
                              Mark Declined
                            </button>
                          </div>
                        )}
                        {req.status === 'accepted' && (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-[#4ADE80] font-medium">Accepted</span>
                            {creator?.instagram_handle && (
                              <a
                                href={`https://instagram.com/${creator.instagram_handle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#888888] flex items-center gap-1 hover:text-white transition-colors"
                              >
                                @{creator.instagram_handle}
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        )}
                        {req.status === 'declined' && (
                          <span className="text-xs text-[#F87171]">Declined</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
