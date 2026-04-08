import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { search_id } = await request.json()

  // Get the brand search
  const { data: search } = await supabase
    .from('brand_searches')
    .select('*')
    .eq('id', search_id)
    .single()

  if (!search) return NextResponse.json({ error: 'Search not found' }, { status: 404 })

  // Get all active creators
  let query = supabase
    .from('creators')
    .select('*')
    .eq('status', 'active')
    .gte('score_total', 50)

  // Hard filters
  if (search.target_niche) query = query.eq('niche', search.target_niche)
  if (search.follower_range) {
    const ranges: Record<string, [number, number]> = {
      '1K-10K': [1000, 10000],
      '10K-50K': [10000, 50000],
      '50K-100K': [50000, 100000],
      '100K+': [100000, 999999999],
    }
    const range = ranges[search.follower_range]
    if (range) query = query.gte('follower_count', range[0]).lte('follower_count', range[1])
  }
  if (search.language && search.language !== 'Any') {
    query = query.eq('audience_language', search.language)
  }

  const { data: creators } = await query

  if (!creators || creators.length === 0) {
    await supabase.from('brand_searches').update({ status: 'complete' }).eq('id', search_id)
    return NextResponse.json({ success: true, count: 0 })
  }

  // Get brand plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', search.brand_id)
    .single()

  const isPro = profile?.plan === 'pro'

  // Compute match scores
  const results = creators.map((creator: Record<string, unknown>, i: number) => {
    let baseScore = (creator.score_total as number) || 50
    let bonus = 0

    // Niche exact match
    if (creator.niche === search.target_niche) bonus += 10

    // City match
    if (search.target_cities && creator.city) {
      const cities = search.target_cities as string[]
      if (cities.includes(creator.city as string)) bonus += 5
    }

    // Language exact match
    if (creator.audience_language === search.language) bonus += 5

    // Pro weighted scoring
    if (isPro && search.pref_niche_relevance) {
      const prefs = {
        score_niche_consistency: (search.pref_niche_relevance as number) || 3,
        score_engagement: (search.pref_engagement as number) || 3,
        score_consistency: (search.pref_consistency as number) || 3,
        score_growth: (search.pref_growth as number) || 3,
        score_workability: (search.pref_workability as number) || 3,
      }
      const total = Object.values(prefs).reduce((a, b) => a + b, 0)
      baseScore = Math.round(
        (((creator.score_niche_consistency as number) || 50) * prefs.score_niche_consistency +
          ((creator.score_engagement as number) || 50) * prefs.score_engagement +
          ((creator.score_consistency as number) || 50) * prefs.score_consistency +
          ((creator.score_growth as number) || 50) * prefs.score_growth +
          ((creator.score_workability as number) || 50) * prefs.score_workability) /
          total
      )
    }

    const matchScore = Math.min(100, baseScore + bonus)
    return { creator_id: creator.id, match_score: matchScore, source: 'creatr_db', _rank: i }
  })

  // Sort by match score
  results.sort((a, b) => b.match_score - a.match_score)

  // Save results
  const resultRows = results.map((r, i) => ({
    search_id,
    creator_id: r.creator_id,
    match_score: r.match_score,
    rank: i + 1,
    source: r.source,
  }))

  await supabase.from('search_results').insert(resultRows)
  await supabase.from('brand_searches').update({ status: 'complete' }).eq('id', search_id)

  return NextResponse.json({ success: true, count: results.length })
}
