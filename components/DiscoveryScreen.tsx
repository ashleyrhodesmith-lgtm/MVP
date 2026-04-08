'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ExternalLink, ArrowLeft } from 'lucide-react'

interface DiscoveryScreenProps {
  searchId: string | null
  brandPlan: 'free' | 'pro'
}

interface Creator {
  id: string
  name: string
  niche: string
  city: string
  instagram_handle: string
  follower_count: number
  avg_views_per_reel: number | null
  score_total: number
  score_reach: number
  score_niche_consistency: number
  score_engagement: number
  score_consistency: number
  score_growth: number
  score_workability: number
}

interface SearchResult {
  rank: number
  match_score: number
  source: string
  creators: Creator
}

function initials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function formatCount(n: number | null): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  const v = value ?? 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-xs text-[#888888]">{label}</span>
        <span className="text-xs text-white font-semibold">{value ?? '—'}</span>
      </div>
      <div className="h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-[#888888] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

export default function DiscoveryScreen({ searchId, brandPlan }: DiscoveryScreenProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [outreachRequested, setOutreachRequested] = useState(false)
  const [outreachLoading, setOutreachLoading] = useState(false)
  const [shortlistSaved, setShortlistSaved] = useState(false)

  // Reset per-creator states when selection changes
  useEffect(() => {
    setOutreachRequested(false)
    setShortlistSaved(false)
  }, [selectedResult])

  useEffect(() => {
    if (!searchId) return
    setLoading(true)

    const checkStatus = async () => {
      const { data } = await supabase
        .from('brand_searches')
        .select('status')
        .eq('id', searchId)
        .single()

      if (data?.status === 'complete') {
        fetchResults()
      } else {
        setTimeout(checkStatus, 2000)
      }
    }

    const fetchResults = async () => {
      const { data: res } = await supabase
        .from('search_results')
        .select('rank, match_score, source, creators(*)')
        .eq('search_id', searchId)
        .order('rank', { ascending: true })
      const typed = (res as unknown as SearchResult[]) || []
      setResults(typed)
      if (typed.length > 0) setSelectedResult(typed[0])
      setLoading(false)
    }

    checkStatus()
  }, [searchId])

  async function handleRequestOutreach() {
    if (!selectedResult || !searchId) return
    setOutreachLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setOutreachLoading(false); return }
    const { error } = await supabase.from('outreach_requests').insert({
      search_id: searchId,
      brand_id: session.user.id,
      creator_id: selectedResult.creators.id,
      status: 'pending',
    })
    if (!error) setOutreachRequested(true)
    setOutreachLoading(false)
  }

  async function handleShortlist() {
    if (!selectedResult || !searchId) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('shortlists').insert({
      brand_id: session.user.id,
      creator_id: selectedResult.creators.id,
      search_id: searchId,
    })
    setShortlistSaved(true)
  }

  // Empty state — no search submitted yet
  if (!searchId) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3 text-center px-4">
        <ArrowLeft size={20} color="#1F1F1F" />
        <p className="text-sm text-[#888888]">Fill in your requirements to find matched creators</p>
      </div>
    )
  }

  // Loading / polling state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
        <p className="text-sm text-[#888888] flex items-center gap-2">
          Finding your best creator matches <LoadingDots />
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-2">
        <p className="text-sm text-[#888888]">No creators matched your search criteria.</p>
        <p className="text-xs text-[#444]">Try broadening your filters.</p>
      </div>
    )
  }

  const isFree = brandPlan === 'free'

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)]">
      {/* Left panel — full ranked list (all plans) */}
      <div className="w-72 border-r border-[#1F1F1F] flex flex-col overflow-y-auto shrink-0">
        {results.map(result => {
          const c = result.creators
          const isSelected = selectedResult?.creators.id === c.id
          return (
            <button
              key={c.id}
              onClick={() => setSelectedResult(result)}
              className={[
                'w-full flex items-center gap-3 px-4 py-3 border-b border-[#1F1F1F] text-left transition-colors',
                isSelected ? 'bg-[#111111]' : 'hover:bg-[#0a0a0a]',
              ].join(' ')}
            >
              <span className="text-xs text-[#888888] w-4 shrink-0">{result.rank}</span>
              <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs text-white shrink-0">
                {initials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{c.name}</p>
                <p className="text-xs text-[#888888] truncate">{c.niche} · {c.city}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-semibold text-white">{result.match_score}</span>
                {result.source === 'creatr_db' && (
                  <span className="text-[10px] text-[#888888] bg-[#1F1F1F] px-1.5 py-0.5 rounded">
                    DB
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Right panel — creator detail */}
      <div className="flex-1 overflow-y-auto p-8">
        {selectedResult ? (
          <div className="max-w-[520px] flex flex-col gap-6">
            {/* Free plan banner */}
            {isFree && (
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-3 flex items-center justify-between">
                <p className="text-xs text-[#888888]">You're on the free plan. Outreach is a Pro feature.</p>
                <button className="text-xs text-white underline cursor-pointer">Upgrade to Pro</button>
              </div>
            )}
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xl text-white shrink-0">
                {initials(selectedResult.creators.name)}
              </div>
              <div>
                <h2
                  className="text-2xl font-light text-white"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {selectedResult.creators.name}
                </h2>
                <p className="text-sm text-[#888888]">
                  {selectedResult.creators.niche} · {selectedResult.creators.city}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">Followers</p>
                <p className="text-xl font-semibold text-white">{formatCount(selectedResult.creators.follower_count)}</p>
              </div>
              <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">Avg Views / Reel</p>
                <p className="text-xl font-semibold text-white">{formatCount(selectedResult.creators.avg_views_per_reel)}</p>
              </div>
            </div>

            {/* CREATR Score */}
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 flex flex-col gap-1">
              <span className="text-xs text-[#888888] uppercase tracking-wider">CREATR Score</span>
              <span
                className="text-5xl font-light text-white leading-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {selectedResult.creators.score_total ?? '—'}
              </span>
            </div>

            {/* Dimension bars */}
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-5 flex flex-col gap-4">
              <ScoreBar label="Reach"             value={selectedResult.creators.score_reach} />
              <ScoreBar label="Engagement"        value={selectedResult.creators.score_engagement} />
              <ScoreBar label="Niche Consistency" value={selectedResult.creators.score_niche_consistency} />
              <ScoreBar label="Consistency"       value={selectedResult.creators.score_consistency} />
              <ScoreBar label="Growth"            value={selectedResult.creators.score_growth} />
              <ScoreBar label="Workability"       value={selectedResult.creators.score_workability} />
            </div>

            {/* Instagram link */}
            {selectedResult.creators.instagram_handle && (
              <a
                href={`https://instagram.com/${selectedResult.creators.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#888888] hover:text-white transition-colors w-fit"
              >
                @{selectedResult.creators.instagram_handle}
                <ExternalLink size={12} />
              </a>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isFree ? (
                <button
                  disabled
                  className="w-full border border-[#FACC15] text-[#FACC15] text-xs px-4 py-2 rounded-lg cursor-not-allowed opacity-80"
                  title="Upgrade to CREATR Pro to send outreach"
                >
                  Pro Feature — Upgrade
                </button>
              ) : outreachRequested ? (
                <p className="text-sm text-[#4ADE80] text-center py-3">Outreach Requested ✓</p>
              ) : (
                <button
                  disabled={outreachLoading}
                  onClick={handleRequestOutreach}
                  className="w-full bg-white text-black text-sm font-medium rounded-xl py-3 transition-opacity disabled:opacity-60 hover:opacity-90"
                >
                  {outreachLoading ? 'Requesting…' : 'Request Outreach'}
                </button>
              )}
              <button
                disabled={shortlistSaved}
                onClick={handleShortlist}
                className="w-full border border-[#1F1F1F] text-[#888888] text-sm rounded-xl py-3 hover:border-[#333] transition-colors disabled:opacity-60"
              >
                {shortlistSaved ? 'Saved ✓' : 'Save to Shortlist'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#888888]">Select a creator to view their profile.</p>
          </div>
        )}
      </div>
    </div>
  )
}
