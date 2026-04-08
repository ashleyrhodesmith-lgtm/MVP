'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['D2C Skincare', 'D2C Fitness', 'D2C Food', 'D2C Fashion', 'D2C Home', 'Consumer App', 'Agency', 'Other']
const NICHES = ['Skincare', 'Fitness', 'Food', 'Fashion', 'Tech', 'Travel', 'Finance', 'Parenting', 'Gaming', 'Other']
const TARGET_AGES = ['18-24', '25-34', '35-44', '44+']
const TARGET_GENDERS = ['All', 'Primarily Female', 'Primarily Male']
const CITY_OPTIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Tier 2 Cities', 'Pan India']
const FOLLOWER_RANGES = ['1K-10K', '10K-50K', '50K-100K', '100K+']
const LANGUAGES = ['Hindi', 'English', 'Hindi + English', 'Regional', 'Any']
const PREF_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const
type PrefLevel = typeof PREF_LEVELS[number]
const PREF_MAP: Record<PrefLevel, number> = { Low: 1, Medium: 2, High: 3, Critical: 4 }

interface IntakeFormProps {
  onSubmit: (searchId: string) => void
}

function PrefToggle({ label, value, onChange }: { label: string; value: PrefLevel; onChange: (v: PrefLevel) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[#888888] uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        {PREF_LEVELS.map(level => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={[
              'flex-1 rounded-xl border py-2 text-xs transition-colors',
              value === level
                ? 'border-white text-white'
                : 'border-[#1F1F1F] text-[#888888] hover:border-[#333]',
            ].join(' ')}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Section 1
  const [brandName, setBrandName] = useState('')
  const [category, setCategory] = useState('')
  const [targetNiche, setTargetNiche] = useState('')
  const [targetAge, setTargetAge] = useState('')
  const [targetGender, setTargetGender] = useState('')
  const [targetCities, setTargetCities] = useState<string[]>([])
  const [campaignBrief, setCampaignBrief] = useState('')

  // Section 2
  const [followerRange, setFollowerRange] = useState('')
  const [numCreators, setNumCreators] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [language, setLanguage] = useState('')
  const [specificRequirements, setSpecificRequirements] = useState('')

  // Section 3
  const [prefNicheRelevance, setPrefNicheRelevance] = useState<PrefLevel>('Medium')
  const [prefEngagement, setPrefEngagement] = useState<PrefLevel>('Medium')
  const [prefConsistency, setPrefConsistency] = useState<PrefLevel>('Medium')
  const [prefGrowth, setPrefGrowth] = useState<PrefLevel>('Medium')
  const [prefWorkability, setPrefWorkability] = useState<PrefLevel>('Medium')
  const [prefContentQuality, setPrefContentQuality] = useState<PrefLevel>('Medium')

  function toggleCity(city: string) {
    setTargetCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    )
  }

  async function handleFinalSubmit() {
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/submit-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          brand_name: brandName,
          category,
          target_niche: targetNiche,
          target_age: targetAge,
          target_gender: targetGender,
          target_cities: targetCities,
          campaign_brief: campaignBrief,
          follower_range: followerRange,
          num_creators: parseInt(numCreators),
          budget_min: parseInt(budgetMin),
          budget_max: parseInt(budgetMax),
          language,
          specific_requirements: specificRequirements,
          pref_niche_relevance: PREF_MAP[prefNicheRelevance],
          pref_engagement: PREF_MAP[prefEngagement],
          pref_consistency: PREF_MAP[prefConsistency],
          pref_growth: PREF_MAP[prefGrowth],
          pref_workability: PREF_MAP[prefWorkability],
          pref_content_quality: PREF_MAP[prefContentQuality],
        }),
      })
      const data = await response.json()
      if (data.search_id) {
        onSubmit(data.search_id)
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const stepLabels = ['Brand & Campaign', 'Creator Requirements', 'Scoring Preferences']

  return (
    <div className="max-w-[680px] mx-auto px-4 pt-12 pb-16">

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {stepLabels.map((label, i) => {
          const step = i + 1
          const isDone = currentStep > step
          const isCurrent = currentStep === step
          return (
            <div key={step} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0',
                  isDone || isCurrent ? 'bg-white text-black' : 'bg-[#1F1F1F] text-[#888888]',
                ].join(' ')}>
                  {step}
                </div>
                <span className={`text-xs hidden sm:block ${isCurrent ? 'text-white' : 'text-[#888888]'}`}>
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px ${isDone ? 'bg-white' : 'bg-[#1F1F1F]'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          <h2
            className="text-2xl font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Brand & Campaign Info
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Brand name *</label>
            <input
              type="text"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              placeholder="Your brand"
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none"
                style={{ color: category ? '#fff' : '#444' }}
              >
                <option value="" style={{ color: '#444' }}>Select</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} style={{ color: '#fff', backgroundColor: '#111' }}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Target niche *</label>
              <select
                value={targetNiche}
                onChange={e => setTargetNiche(e.target.value)}
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none"
                style={{ color: targetNiche ? '#fff' : '#444' }}
              >
                <option value="" style={{ color: '#444' }}>Select</option>
                {NICHES.map(n => (
                  <option key={n} value={n} style={{ color: '#fff', backgroundColor: '#111' }}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Target age</label>
              <select
                value={targetAge}
                onChange={e => setTargetAge(e.target.value)}
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none"
                style={{ color: targetAge ? '#fff' : '#444' }}
              >
                <option value="" style={{ color: '#444' }}>Any</option>
                {TARGET_AGES.map(a => (
                  <option key={a} value={a} style={{ color: '#fff', backgroundColor: '#111' }}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Target gender</label>
              <select
                value={targetGender}
                onChange={e => setTargetGender(e.target.value)}
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none"
                style={{ color: targetGender ? '#fff' : '#444' }}
              >
                <option value="" style={{ color: '#444' }}>Any</option>
                {TARGET_GENDERS.map(g => (
                  <option key={g} value={g} style={{ color: '#fff', backgroundColor: '#111' }}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Target cities</label>
            <div className="flex flex-wrap gap-2">
              {CITY_OPTIONS.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => toggleCity(city)}
                  className={[
                    'rounded-xl border px-3 py-2 text-xs transition-colors',
                    targetCities.includes(city)
                      ? 'border-white text-white'
                      : 'border-[#1F1F1F] text-[#888888] hover:border-[#333]',
                  ].join(' ')}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Campaign brief</label>
            <textarea
              rows={3}
              value={campaignBrief}
              onChange={e => setCampaignBrief(e.target.value)}
              placeholder="Describe your product, campaign goals, and what kind of content you're looking for..."
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            disabled={!brandName || !category || !targetNiche}
            onClick={() => setCurrentStep(2)}
            className="w-full bg-white text-black text-sm font-medium rounded-xl py-3 transition-opacity disabled:opacity-40 hover:opacity-90"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          <h2
            className="text-2xl font-light text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Creator Requirements
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Follower range *</label>
              <select
                value={followerRange}
                onChange={e => setFollowerRange(e.target.value)}
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none"
                style={{ color: followerRange ? '#fff' : '#444' }}
              >
                <option value="" style={{ color: '#444' }}>Select</option>
                {FOLLOWER_RANGES.map(r => (
                  <option key={r} value={r} style={{ color: '#fff', backgroundColor: '#111' }}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">No. of creators *</label>
              <input
                type="number"
                min="1"
                value={numCreators}
                onChange={e => setNumCreators(e.target.value)}
                placeholder="e.g. 5"
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Budget min (₹)</label>
              <input
                type="number"
                min="0"
                value={budgetMin}
                onChange={e => setBudgetMin(e.target.value)}
                placeholder="e.g. 5000"
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#888888] uppercase tracking-wider">Budget max (₹)</label>
              <input
                type="number"
                min="0"
                value={budgetMax}
                onChange={e => setBudgetMax(e.target.value)}
                placeholder="e.g. 20000"
                className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Content language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#333] transition-colors appearance-none"
              style={{ color: language ? '#fff' : '#444' }}
            >
              <option value="" style={{ color: '#444' }}>Any</option>
              {LANGUAGES.map(l => (
                <option key={l} value={l} style={{ color: '#fff', backgroundColor: '#111' }}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#888888] uppercase tracking-wider">Specific requirements</label>
            <textarea
              rows={3}
              value={specificRequirements}
              onChange={e => setSpecificRequirements(e.target.value)}
              placeholder="Any specific requirements, restrictions, or notes for creators..."
              className="bg-[#111111] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-[#444] focus:border-[#333] transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 border border-[#1F1F1F] text-[#888888] text-sm rounded-xl py-3 hover:border-[#333] transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!followerRange || !numCreators}
              onClick={() => setCurrentStep(3)}
              className="flex-1 bg-white text-black text-sm font-medium rounded-xl py-3 transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <h2
              className="text-2xl font-light text-white"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Scoring Preferences
            </h2>
            <span className="text-xs text-[#FACC15] uppercase tracking-wider">Premium Feature</span>
          </div>

          <p className="text-sm text-[#888888] -mt-3">
            Set how much each dimension matters when ranking creators for your campaign.
          </p>

          <PrefToggle label="Niche Relevance" value={prefNicheRelevance} onChange={setPrefNicheRelevance} />
          <PrefToggle label="Engagement Rate" value={prefEngagement} onChange={setPrefEngagement} />
          <PrefToggle label="Posting Consistency" value={prefConsistency} onChange={setPrefConsistency} />
          <PrefToggle label="Growth Trajectory" value={prefGrowth} onChange={setPrefGrowth} />
          <PrefToggle label="Brand Workability" value={prefWorkability} onChange={setPrefWorkability} />
          <PrefToggle label="Content Quality" value={prefContentQuality} onChange={setPrefContentQuality} />

          {error && <p className="text-xs text-[#F87171]">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 border border-[#1F1F1F] text-[#888888] text-sm rounded-xl py-3 hover:border-[#333] transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleFinalSubmit}
              className="flex-1 bg-white text-black text-sm font-medium rounded-xl py-3 transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {loading ? 'Finding creators…' : 'Find Creators'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
