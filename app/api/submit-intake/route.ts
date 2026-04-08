import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { user }, error: authError } = token
    ? await supabase.auth.getUser(token)
    : { data: { user: null }, error: null }

  if (!user || authError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const { data: search, error } = await supabase
    .from('brand_searches')
    .insert({
      brand_id: user.id,
      brand_name: body.brand_name,
      category: body.category,
      target_niche: body.target_niche,
      target_age: body.target_age,
      target_gender: body.target_gender,
      target_cities: body.target_cities,
      campaign_brief: body.campaign_brief,
      follower_range: body.follower_range,
      num_creators: body.num_creators,
      budget_min: body.budget_min,
      budget_max: body.budget_max,
      language: body.language,
      specific_requirements: body.specific_requirements,
      pref_niche_relevance: body.pref_niche_relevance,
      pref_engagement: body.pref_engagement,
      pref_consistency: body.pref_consistency,
      pref_growth: body.pref_growth,
      pref_workability: body.pref_workability,
      pref_content_quality: body.pref_content_quality,
      status: 'processing',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Trigger matching
  await fetch(new URL('/api/match-creators', request.url).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ search_id: search.id }),
  })

  return NextResponse.json({ success: true, search_id: search.id })
}
