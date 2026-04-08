'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

const NICHES = ['Skincare', 'Fitness', 'Food', 'Fashion', 'Tech', 'Travel', 'Finance', 'Parenting', 'Gaming', 'Other']
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Other']
const AUDIENCE_AGES = ['18-24', '25-34', '35-44', '44+']
const AUDIENCE_GENDERS = ['Mostly Female', 'Mostly Male', 'Mixed']
const LANGUAGES = ['Hindi', 'English', 'Hindi + English', 'Regional']

export default function JoinPage() {
  const [name, setName] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [niche, setNiche] = useState('')
  const [city, setCity] = useState('')
  const [followerCount, setFollowerCount] = useState('')
  const [avgViews, setAvgViews] = useState('')
  const [audienceAge, setAudienceAge] = useState('')
  const [audienceGender, setAudienceGender] = useState('')
  const [language, setLanguage] = useState('')
  const [previousBrandWork, setPreviousBrandWork] = useState<'yes' | 'no' | ''>('')
  const [brandsWorkedWith, setBrandsWorkedWith] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !instagramHandle || !niche || !followerCount) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('creators').insert({
      name,
      instagram_handle: instagramHandle,
      niche,
      city,
      follower_count: parseInt(followerCount),
      avg_views_per_reel: parseInt(avgViews) || null,
      audience_age_range: audienceAge || null,
      audience_gender: audienceGender || null,
      audience_language: language || null,
      previous_brand_work: previousBrandWork === 'yes',
      brand_history_notes: previousBrandWork === 'yes' ? brandsWorkedWith : null,
      status: 'pending_review',
      source: 'self_signup',
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center gap-4">
          <CheckCircle size={48} color="#4ADE80" />
          <h1
            className="text-3xl font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            You're on CREATR.UGC
          </h1>
          <p className="text-sm text-[#888888]">
            We'll review your profile and reach out soon.
          </p>
          <a
            href="https://creatrugc.com"
            className="text-xs text-[#888888] underline underline-offset-2 mt-2"
          >
            Back to creatrugc.com
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-start px-4 py-16">
      <h1
        className="text-xl font-light text-white tracking-widest mb-10"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        CREATR.UGC
      </h1>

      <div className="w-full max-w-sm bg-[#111111] border border-[#1F1F1F] rounded-xl p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2
            className="text-2xl font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Apply as a creator
          </h2>
          <p className="text-sm text-[#888888]">
            Get discovered by Indian D2C brands.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Full name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Priya Sharma"
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
            />
          </div>

          {/* Instagram handle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Instagram handle *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#888888]">@</span>
              <input
                type="text"
                required
                value={instagramHandle}
                onChange={e => setInstagramHandle(e.target.value)}
                placeholder="yourhandle"
                className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl pl-8 pr-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
              />
            </div>
          </div>

          {/* Niche */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Primary niche *</label>
            <select
              required
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none cursor-pointer"
              style={{ color: niche ? '#FFFFFF' : '#444444' }}
            >
              <option value="" disabled style={{ color: '#444' }}>Select niche</option>
              {NICHES.map(n => (
                <option key={n} value={n} style={{ color: '#fff', backgroundColor: '#111' }}>{n}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">City</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none cursor-pointer"
              style={{ color: city ? '#FFFFFF' : '#444444' }}
            >
              <option value="" style={{ color: '#444' }}>Select city</option>
              {CITIES.map(c => (
                <option key={c} value={c} style={{ color: '#fff', backgroundColor: '#111' }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Follower count */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Instagram followers *</label>
            <input
              type="number"
              required
              min="0"
              value={followerCount}
              onChange={e => setFollowerCount(e.target.value)}
              placeholder="e.g. 45000"
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
            />
          </div>

          {/* Avg views */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Avg views per reel</label>
            <input
              type="number"
              min="0"
              value={avgViews}
              onChange={e => setAvgViews(e.target.value)}
              placeholder="e.g. 12000"
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
            />
          </div>

          {/* Audience age */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Audience age range</label>
            <select
              value={audienceAge}
              onChange={e => setAudienceAge(e.target.value)}
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none cursor-pointer"
              style={{ color: audienceAge ? '#FFFFFF' : '#444444' }}
            >
              <option value="" style={{ color: '#444' }}>Select age range</option>
              {AUDIENCE_AGES.map(a => (
                <option key={a} value={a} style={{ color: '#fff', backgroundColor: '#111' }}>{a}</option>
              ))}
            </select>
          </div>

          {/* Audience gender */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Audience gender</label>
            <select
              value={audienceGender}
              onChange={e => setAudienceGender(e.target.value)}
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none cursor-pointer"
              style={{ color: audienceGender ? '#FFFFFF' : '#444444' }}
            >
              <option value="" style={{ color: '#444' }}>Select gender split</option>
              {AUDIENCE_GENDERS.map(g => (
                <option key={g} value={g} style={{ color: '#fff', backgroundColor: '#111' }}>{g}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Content language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none cursor-pointer"
              style={{ color: language ? '#FFFFFF' : '#444444' }}
            >
              <option value="" style={{ color: '#444' }}>Select language</option>
              {LANGUAGES.map(l => (
                <option key={l} value={l} style={{ color: '#fff', backgroundColor: '#111' }}>{l}</option>
              ))}
            </select>
          </div>

          {/* Previous brand work */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Previous brand work?</label>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPreviousBrandWork(val)}
                  className={[
                    'flex-1 rounded-xl border px-4 py-3 text-sm transition-colors capitalize',
                    previousBrandWork === val
                      ? 'border-white text-white'
                      : 'border-[#1F1F1F] text-[#888888] hover:border-[#333]',
                  ].join(' ')}
                >
                  {val === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>

          {/* Brands worked with — conditional */}
          {previousBrandWork === 'yes' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Brands worked with</label>
              <textarea
                rows={3}
                value={brandsWorkedWith}
                onChange={e => setBrandsWorkedWith(e.target.value)}
                placeholder="Minimalist, Bombay Shaving Co., Mamaearth..."
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors resize-none"
              />
            </div>
          )}

          {error && <p className="text-xs text-[#F87171]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black text-sm font-medium rounded-xl px-4 py-3 transition-opacity disabled:opacity-40 hover:opacity-90"
          >
            {loading ? 'Submitting…' : 'Apply to join'}
          </button>
        </form>

        <p className="text-xs text-[#888888] text-center">
          Already have an account?{' '}
          <a href="/login" className="text-white underline underline-offset-2">Log in</a>
        </p>
      </div>
    </div>
  )
}
