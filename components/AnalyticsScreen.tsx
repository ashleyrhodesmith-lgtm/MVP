'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const creators = [
  {
    rank: 1,
    name: "Priya Sharma",
    niche: "Skincare",
    region: "Mumbai",
    score: 94,
    performance: 96,
    consistency: 95,
    contentQuality: 92,
    workability: 98,
    growthTrajectory: 89,
    totalViews: "284K",
    campaigns: 4,
    trend: "up"
  },
  {
    rank: 2,
    name: "Arjun Mehta",
    niche: "Fitness",
    region: "Delhi",
    score: 88,
    performance: 90,
    consistency: 88,
    contentQuality: 85,
    workability: 92,
    growthTrajectory: 86,
    totalViews: "198K",
    campaigns: 3,
    trend: "up"
  },
  {
    rank: 3,
    name: "Sneha Kapoor",
    niche: "Food",
    region: "Bangalore",
    score: 82,
    performance: 80,
    consistency: 85,
    contentQuality: 88,
    workability: 79,
    growthTrajectory: 78,
    totalViews: "142K",
    campaigns: 3,
    trend: "up"
  },
  {
    rank: 4,
    name: "Rohan Das",
    niche: "Tech",
    region: "Hyderabad",
    score: 74,
    performance: 72,
    consistency: 78,
    contentQuality: 70,
    workability: 80,
    growthTrajectory: 68,
    totalViews: "98K",
    campaigns: 2,
    trend: "down"
  },
  {
    rank: 5,
    name: "Ananya Singh",
    niche: "Fashion",
    region: "Pune",
    score: 69,
    performance: 65,
    consistency: 72,
    contentQuality: 74,
    workability: 68,
    growthTrajectory: 64,
    totalViews: "76K",
    campaigns: 2,
    trend: "down"
  },
  {
    rank: 6,
    name: "Karan Patel",
    niche: "Travel",
    region: "Jaipur",
    score: 61,
    performance: 58,
    consistency: 64,
    contentQuality: 62,
    workability: 65,
    growthTrajectory: 55,
    totalViews: "54K",
    campaigns: 1,
    trend: "down"
  }
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('');
}

function getDimensionBarColor(score: number) {
  if (score >= 90) return '#4ADE80';
  if (score >= 70) return '#FFFFFF';
  return '#FACC15';
}

export default function AnalyticsScreen() {
  const [selectedRank, setSelectedRank] = useState(1);
  const selected = creators.find(c => c.rank === selectedRank) ?? creators[0];

  const dimensions = [
    { label: 'Performance', value: selected.performance },
    { label: 'Consistency', value: selected.consistency },
    { label: 'Content Quality', value: selected.contentQuality },
    { label: 'Workability', value: selected.workability },
    { label: 'Growth', value: selected.growthTrajectory },
  ];

  const stats = [
    { label: 'Total Views', value: selected.totalViews },
    { label: 'Campaigns', value: selected.campaigns },
    { label: 'Avg Score', value: `${selected.score}/100` },
    { label: 'Region', value: selected.region },
  ];

  return (
    <div>
      {/* Page header */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.875rem',
        fontWeight: 300,
        color: '#FFFFFF',
        margin: '0 0 0.25rem 0',
      }}>
        Creator Leaderboard
      </h1>
      <p style={{
        fontSize: '0.875rem',
        color: '#888888',
        margin: '0 0 2rem 0',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        CREATR Score ranks creators across performance, consistency, and workability
      </p>

      {/* Two column layout */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* LEFT PANEL — Leaderboard table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Table header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            borderBottom: '1px solid #1F1F1F',
          }}>
            <span style={{ width: '2rem', fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter', system-ui, sans-serif" }}>Rank</span>
            <span style={{ flex: 1, fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter', system-ui, sans-serif" }}>Creator</span>
            <span style={{ width: '6rem', fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter', system-ui, sans-serif" }}>CREATR Score</span>
            <span style={{ width: '5rem', fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter', system-ui, sans-serif" }}>Views</span>
            <span style={{ width: '6rem', textAlign: 'center', fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter', system-ui, sans-serif" }}>Campaigns</span>
            <span style={{ width: '3rem', textAlign: 'center', fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Inter', system-ui, sans-serif" }}>Trend</span>
          </div>

          {/* Creator rows */}
          {creators.map((creator) => {
            const isSelected = creator.rank === selectedRank;
            return (
              <div
                key={creator.rank}
                onClick={() => setSelectedRank(creator.rank)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #1F1F1F',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#111111' : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = '#111'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
              >
                {/* Rank */}
                <span style={{ width: '2rem', fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  {creator.rank}
                </span>

                {/* Creator */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <div style={{
                    width: '2rem', height: '2rem',
                    backgroundColor: '#1F1F1F',
                    borderRadius: '9999px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', color: '#FFFFFF',
                    flexShrink: 0,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}>
                    {getInitials(creator.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>{creator.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>{creator.niche} · {creator.region}</div>
                  </div>
                </div>

                {/* CREATR Score */}
                <div style={{ width: '6rem' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>{creator.score}</div>
                  <div style={{ height: '2px', backgroundColor: '#1F1F1F', borderRadius: '9999px', marginTop: '4px' }}>
                    <div style={{ height: '2px', backgroundColor: '#FFFFFF', borderRadius: '9999px', width: `${creator.score}%` }} />
                  </div>
                </div>

                {/* Views */}
                <span style={{ width: '5rem', fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>{creator.totalViews}</span>

                {/* Campaigns */}
                <span style={{ width: '6rem', textAlign: 'center', fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>{creator.campaigns}</span>

                {/* Trend */}
                <div style={{ width: '3rem', display: 'flex', justifyContent: 'center' }}>
                  {creator.trend === 'up'
                    ? <TrendingUp size={14} color="#4ADE80" />
                    : <TrendingDown size={14} color="#F87171" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANEL — Creator detail */}
        <div style={{
          width: '20rem',
          flexShrink: 0,
          backgroundColor: '#111111',
          border: '1px solid #1F1F1F',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          position: 'sticky',
          top: 0,
        }}>
          {/* Avatar + name */}
          <div style={{
            width: '3rem', height: '3rem',
            backgroundColor: '#1F1F1F',
            borderRadius: '9999px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', color: '#FFFFFF',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {getInitials(selected.name)}
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 300,
            color: '#FFFFFF',
            marginTop: '0.75rem',
          }}>
            {selected.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>
            {selected.niche} · {selected.region}
          </div>

          {/* CREATR Score hero */}
          <div style={{ borderTop: '1px solid #1F1F1F', marginTop: '1rem', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontFamily: "'Inter', system-ui, sans-serif" }}>
              CREATR SCORE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '3rem',
                fontWeight: 300,
                color: '#FFFFFF',
                lineHeight: 1,
              }}>
                {selected.score}
              </span>
              <span style={{ fontSize: '1.125rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>/100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
              {selected.trend === 'up' ? (
                <>
                  <TrendingUp size={12} color="#4ADE80" />
                  <span style={{ fontSize: '0.75rem', color: '#4ADE80', fontFamily: "'Inter', system-ui, sans-serif" }}>Trending up</span>
                </>
              ) : (
                <>
                  <TrendingDown size={12} color="#F87171" />
                  <span style={{ fontSize: '0.75rem', color: '#F87171', fontFamily: "'Inter', system-ui, sans-serif" }}>Needs attention</span>
                </>
              )}
            </div>
          </div>

          {/* Score Breakdown */}
          <div style={{ borderTop: '1px solid #1F1F1F', marginTop: '1rem', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontFamily: "'Inter', system-ui, sans-serif" }}>
              Score Breakdown
            </div>
            {dimensions.map(({ label, value }) => (
              <div key={label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>{label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 500, fontFamily: "'Inter', system-ui, sans-serif" }}>{value}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#1F1F1F', borderRadius: '9999px' }}>
                  <div style={{
                    height: '4px',
                    backgroundColor: getDimensionBarColor(value),
                    borderRadius: '9999px',
                    width: `${value}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Campaign Stats */}
          <div style={{ borderTop: '1px solid #1F1F1F', marginTop: '1rem', paddingTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {stats.map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>{label}</div>
                  <div style={{ fontSize: '0.875rem', color: '#FFFFFF', fontWeight: 500, marginTop: '0.125rem', fontFamily: "'Inter', system-ui, sans-serif" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <button style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '0.625rem 0',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            marginTop: '1.5rem',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            Send Outreach
          </button>
          <button style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#888888',
            fontSize: '0.875rem',
            padding: '0.625rem 0',
            borderRadius: '0.5rem',
            border: '1px solid #1F1F1F',
            cursor: 'pointer',
            marginTop: '0.5rem',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            View Reels
          </button>
        </div>

      </div>
    </div>
  );
}
