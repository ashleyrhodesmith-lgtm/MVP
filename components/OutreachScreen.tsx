'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send } from 'lucide-react'

interface OutreachScreenProps {
  brandId: string
}

interface Creator {
  name: string
  instagram_handle: string
  niche: string
  city: string
  follower_count: number
}

interface OutreachRequest {
  id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  creators: Creator
}

function initials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function formatFollowers(n: number): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const STATUS_CONFIG = {
  pending:  { color: '#FACC15', label: 'Pending' },
  accepted: { color: '#4ADE80', label: 'Accepted' },
  declined: { color: '#F87171', label: 'Declined' },
}

export default function OutreachScreen({ brandId }: OutreachScreenProps) {
  const [requests, setRequests] = useState<OutreachRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('outreach_requests')
        .select('*, creators(name, instagram_handle, niche, city, follower_count)')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
      setRequests((data as OutreachRequest[]) || [])
      setLoading(false)
    }
    fetch()
  }, [brandId])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-5 h-5 border border-[#333] border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1
        className="text-3xl font-light text-white mb-1"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Outreach
      </h1>
      <p className="text-sm text-[#888888] mb-8">Creators you've requested to work with</p>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Send size={32} color="#1F1F1F" />
          <p className="text-sm text-[#888888]">No outreach requests yet</p>
          <p className="text-xs text-[#888888] mt-1">Find creators to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(req => {
            const c = req.creators
            const s = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending
            return (
              <div
                key={req.id}
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4 flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-sm text-white shrink-0">
                  {initials(c?.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{c?.name}</p>
                  <p className="text-xs text-[#888888]">
                    {c?.niche}{c?.city ? ` · ${c.city}` : ''}
                  </p>
                </div>

                {/* Followers */}
                <span className="text-xs text-[#888888] ml-auto shrink-0">
                  {formatFollowers(c?.follower_count)}
                </span>

                {/* Status badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs" style={{ color: s.color }}>{s.label}</span>
                </div>

                {/* Contact button if accepted */}
                {req.status === 'accepted' && c?.instagram_handle && (
                  <a
                    href={`https://instagram.com/${c.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs border border-[#1F1F1F] text-[#888888] px-3 py-1 rounded-lg ml-2 hover:border-[#333] hover:text-white transition-colors shrink-0"
                  >
                    Contact on Instagram
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
