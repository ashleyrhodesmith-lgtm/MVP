'use client'

import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Creator {
  id: string
  name: string
  niche: string
  city: string
  instagram_handle: string
  follower_count: number
  score_total: number
  score_niche_consistency: number
  score_engagement: number
  score_consistency: number
  score_growth: number
  score_workability: number
  score_content_quality: number
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatFollowers(n: number): string {
  if (!n) return '—'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return String(n)
}

function getDimensionBarColor(score: number) {
  if (score >= 90) return '#4ADE80'
  if (score >= 70) return '#FFFFFF'
  return '#FACC15'
}

export default function AnalyticsScreen() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('status', 'active')
        .gte('score_total', 50)
        .order('score_total', { ascending: false })
      setCreators((data as Creator[]) || [])
      if (data && data.length > 0) setSelectedId(data[0].id)
      setLoading(false)
    }
    fetch()
  }, [])

  const selected = creators.find(c => c.id === selectedId) ?? creators[0]

  const dimensions = selected ? [
    { label: 'Engagement',         value: selected.score_engagement },
    { label: 'Niche Consistency',  value: selected.score_niche_consistency },
    { label: 'Consistency',        value: selected.score_consistency },
    { label: 'Growth',             value: selected.score_growth },
    { label: 'Workability',        value: selected.score_workability },
    { label: 'Content Quality',    value: selected.score_content_quality },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border border-[#333] border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (creators.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#888888]">No creators in database yet.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1
        className="text-3xl font-light text-white mb-1"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Creator Leaderboard
      </h1>
      <p className="text-sm text-[#888888] mb-8">
        CREATR Score ranks creators across performance, consistency, and workability
      </p>

      <div className="flex gap-6 items-start">
        {/* Left — table */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center px-4 py-2 border-b border-[#1F1F1F]">
            <span className="w-8 text-xs text-[#888888] uppercase tracking-wider">Rank</span>
            <span className="flex-1 text-xs text-[#888888] uppercase tracking-wider">Creator</span>
            <span className="w-24 text-xs text-[#888888] uppercase tracking-wider">Score</span>
            <span className="w-20 text-xs text-[#888888] uppercase tracking-wider">Followers</span>
            <span className="w-24 text-xs text-[#888888] uppercase tracking-wider">City</span>
          </div>

          {creators.map((creator, i) => {
            const isSelected = creator.id === selectedId
            return (
              <div
                key={creator.id}
                onClick={() => setSelectedId(creator.id)}
                className={[
                  'flex items-center px-4 py-4 border-b border-[#1F1F1F] cursor-pointer transition-colors',
                  isSelected ? 'bg-[#111111]' : 'hover:bg-[#0a0a0a]',
                ].join(' ')}
              >
                <span className="w-8 text-sm text-[#888888]">{i + 1}</span>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs text-white shrink-0">
                    {getInitials(creator.name)}
                  </div>
                  <div>
                    <p className="text-sm text-white">{creator.name}</p>
                    <p className="text-xs text-[#888888]">{creator.niche}</p>
                  </div>
                </div>
                <div className="w-24">
                  <p className="text-sm font-semibold text-white">{creator.score_total ?? '—'}</p>
                  <div className="h-0.5 bg-[#1F1F1F] rounded-full mt-1">
                    <div
                      className="h-0.5 bg-white rounded-full"
                      style={{ width: `${creator.score_total ?? 0}%` }}
                    />
                  </div>
                </div>
                <span className="w-20 text-sm text-white">{formatFollowers(creator.follower_count)}</span>
                <span className="w-24 text-sm text-[#888888]">{creator.city || '—'}</span>
              </div>
            )
          })}
        </div>

        {/* Right — detail panel */}
        {selected && (
          <div className="w-80 shrink-0 bg-[#111111] border border-[#1F1F1F] rounded-xl p-6 sticky top-0">
            <div className="w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center text-base text-white mb-3">
              {getInitials(selected.name)}
            </div>
            <h2
              className="text-xl font-light text-white"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {selected.name}
            </h2>
            <p className="text-sm text-[#888888]">{selected.niche} · {selected.city}</p>

            {/* Score hero */}
            <div className="border-t border-[#1F1F1F] mt-4 pt-4">
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">CREATR Score</p>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-5xl font-light text-white leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {selected.score_total ?? '—'}
                </span>
                <span className="text-lg text-[#888888]">/100</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} color="#4ADE80" />
                <span className="text-xs text-[#4ADE80]">Active creator</span>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="border-t border-[#1F1F1F] mt-4 pt-4">
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-4">Score Breakdown</p>
              {dimensions.map(({ label, value }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white">{label}</span>
                    <span className="text-xs text-white font-medium">{value ?? '—'}</span>
                  </div>
                  <div className="h-1 bg-[#1F1F1F] rounded-full">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${value ?? 0}%`,
                        backgroundColor: getDimensionBarColor(value ?? 0),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="border-t border-[#1F1F1F] mt-4 pt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[#888888]">Followers</p>
                <p className="text-sm text-white font-medium mt-0.5">{formatFollowers(selected.follower_count)}</p>
              </div>
              <div>
                <p className="text-xs text-[#888888]">City</p>
                <p className="text-sm text-white font-medium mt-0.5">{selected.city || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
