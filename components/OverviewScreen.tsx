'use client';

import {
  LineChart, Line, XAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from 'recharts';

// ─── Data ─────────────────────────────────────────────────────────────────────

const viewsData = [
  { day: 'Jan 15', views: 2000 },
  { day: 'Jan 18', views: 5400 },
  { day: 'Jan 21', views: 8900 },
  { day: 'Jan 24', views: 12000 },
  { day: 'Jan 27', views: 18400 },
  { day: 'Jan 30', views: 24100 },
  { day: 'Feb 2',  views: 31000 },
  { day: 'Feb 5',  views: 42000 },
  { day: 'Feb 8',  views: 58000 },
  { day: 'Feb 11', views: 71000 },
  { day: 'Feb 15', views: 84000 },
];

const ageBars  = [
  { label: '18–24', pct: 38 },
  { label: '25–34', pct: 44 },
  { label: '35–44', pct: 14 },
  { label: '44+',   pct: 4  },
];

const genderBars = [
  { label: 'Female', pct: 68 },
  { label: 'Male',   pct: 32 },
];

// ─── Shared styles ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  backgroundColor: '#111111',
  border: '1px solid #1F1F1F',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

const sectionLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#888888',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontFamily: "'Inter', system-ui, sans-serif",
  margin: 0,
};

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  primary,
  sublabel,
}: {
  label: string;
  value: string;
  primary?: boolean;
  sublabel?: string;
}) {
  return (
    <div style={card}>
      <p style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: primary ? '1.875rem' : '1.5rem',
        fontWeight: 600,
        color: '#FFFFFF',
        margin: '0 0 0.375rem 0',
      }}>
        {value}
      </p>
      <p style={{ ...sectionLabel, marginTop: '0.25rem' }}>{label}</p>
      {sublabel && (
        <p style={{
          fontSize: '0.75rem',
          color: '#888888',
          margin: '0.25rem 0 0 0',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

// ─── Bar Row ──────────────────────────────────────────────────────────────────

function BarRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <span style={{
        fontSize: '0.75rem', color: '#888888',
        width: '2.75rem', flexShrink: 0,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '4px', backgroundColor: '#1F1F1F', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{
        fontSize: '0.75rem', color: '#FFFFFF',
        width: '2rem', textAlign: 'right', flexShrink: 0,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #1F1F1F',
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
    }}>
      <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0 0 2px 0', fontFamily: "'Inter', system-ui, sans-serif" }}>{label}</p>
      <p style={{ fontSize: '0.75rem', color: '#FFFFFF', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
        {(payload[0].value / 1000).toFixed(1)}K views
      </p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function OverviewScreen() {
  return (
    <div>
      {/* Heading */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.875rem',
        fontWeight: 300,
        color: '#FFFFFF',
        margin: '0 0 0.375rem 0',
      }}>
        Campaign Overview
      </h1>
      <p style={{
        fontSize: '0.875rem',
        color: '#888888',
        margin: '0 0 2rem 0',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Skincare Launch Q1 · Jan 15 – Feb 15, 2025
      </p>

      {/* Top metrics — 4 cols */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <MetricCard label="Total Views" value="284K" primary />
        <MetricCard label="Likes"       value="18.4K" />
        <MetricCard label="Comments"    value="3.2K" />
        <MetricCard label="Shares"      value="1.8K" />
      </div>

      {/* Second row — 3 cols */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <MetricCard label="Avg Watch Time"      value="18s" />
        <MetricCard label="Follows Generated"   value="420" />
        <MetricCard
          label="Non-follower Reach"
          value="65.1%"
          sublabel="of views from non-followers"
        />
      </div>

      {/* Line chart */}
      <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ ...sectionLabel, marginBottom: '1rem' }}>Views Over Time</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={viewsData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#888888', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#1F1F1F', strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: '#FFFFFF', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Audience — 3 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {/* Age */}
        <div style={card}>
          <p style={{ ...sectionLabel, marginBottom: '1rem' }}>Age Breakdown</p>
          {ageBars.map((b) => <BarRow key={b.label} {...b} />)}
        </div>

        {/* Gender */}
        <div style={card}>
          <p style={{ ...sectionLabel, marginBottom: '1rem' }}>Gender Split</p>
          {genderBars.map((b) => <BarRow key={b.label} {...b} />)}
        </div>

        {/* Region */}
        <div style={card}>
          <p style={{ ...sectionLabel, marginBottom: '1rem' }}>Audience Region</p>
          <div style={{
            display: 'flex', alignItems: 'center',
            borderBottom: '1px solid #1F1F1F',
            paddingBottom: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
              India
            </span>
            <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif", marginLeft: 'auto' }}>
              94%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>
              Other
            </span>
            <span style={{ fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif", marginLeft: 'auto' }}>
              6%
            </span>
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#888888',
            margin: '1rem 0 0 0',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            Detailed breakdown available in V2 via Instagram API
          </p>
        </div>
      </div>

      {/* Attribution note */}
      <p style={{
        fontSize: '0.75rem',
        color: '#888888',
        textAlign: 'center',
        marginTop: '1rem',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Metrics are creator self-reported. API verification coming in V2.
      </p>
    </div>
  );
}
