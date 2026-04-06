'use client';

import { useState } from 'react';
import {
  House, Briefcase, User, Bell,
  ArrowLeft, CheckSquare, Clock, CheckCircle, Check,
  Wallet, Link, ArrowUpRight, Archive, HelpCircle, LogOut, ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type BottomTab = 'Home' | 'Campaigns' | 'Profile' | 'Notifications';
type HomeTab   = 'For You' | 'Active';

type Campaign = {
  brand: string;
  niche: string;
  base: number;
  bonus: number;
  spots: number;
};

type ActiveCampaign = {
  brand: string;
  status: 'Script Approved' | 'Pending Review';
  views: number;
  deadline: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const recommendedCampaigns: Campaign[] = [
  { brand: 'Minimalist',         niche: 'Skincare', base: 2000, bonus: 12, spots: 4 },
  { brand: 'Bombay Shaving Co.', niche: 'Grooming', base: 1500, bonus: 8,  spots: 7 },
  { brand: 'Mamaearth',          niche: 'Skincare', base: 2500, bonus: 15, spots: 2 },
];

const activeCampaigns: ActiveCampaign[] = [
  { brand: 'Minimalist', status: 'Script Approved', views: 4200, deadline: 'Feb 28' },
  { brand: 'Noise',      status: 'Pending Review',  views: 0,    deadline: 'Mar 5'  },
];

const trendingHooks = [
  { text: '"POV: I switched to 1 serum and deleted my 7-step routine"', format: 'POV', views: '2.1M' },
  { text: '"She has the most glowing skin I\'ve ever seen. Her secret?"', format: 'Reaction', views: '1.8M' },
  { text: '"I spent ₹200 on this and threw away my ₹3000 serum"', format: 'Problem-Solution', views: '1.4M' },
];

const briefRequirements = [
  '15–30 seconds',
  'Show product in first 3 seconds',
  'No competitor mentions',
  'Include #TheMinimalist in caption',
];

const checklistItems = [
  'Video is 15–30 seconds long',
  'Product visible in first 3 seconds',
  'No competitor brands mentioned',
  'Caption includes #TheMinimalist',
];

// ─── Shared helpers ────────────────────────────────────────────────────────────

const inter = "'Inter', system-ui, sans-serif";
const garamond = "'Cormorant Garamond', Georgia, serif";

function PrimaryBtn({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        margin: '0 1rem',
        width: 'calc(100% - 2rem)',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        fontFamily: inter,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'block',
      }}
    >
      {label}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#888888',
        padding: '1rem',
        flexShrink: 0,
      }}
    >
      <ArrowLeft size={18} color="#888888" />
    </button>
  );
}

// ─── STEP 1 — Brief ───────────────────────────────────────────────────────────

function Step1({ campaign, onNext }: { campaign: Campaign; onNext: () => void }) {
  return (
    <div style={{ paddingBottom: '1.5rem' }}>
      <p style={{ fontFamily: garamond, fontSize: '1.5rem', fontWeight: 300, color: '#FFFFFF', padding: '0 1rem', margin: '0 0 0.25rem' }}>
        {campaign.brand}
      </p>
      <p style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: inter, padding: '0 1rem', margin: '0 0 1rem' }}>
        Campaign Brief
      </p>

      {/* Brief card */}
      <div style={{ margin: '0 1rem 1rem', backgroundColor: '#111111', border: '1px solid #1F1F1F', borderRadius: '0.75rem', padding: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#FFFFFF', lineHeight: 1.6, margin: '0 0 0.75rem', fontFamily: inter }}>
          Create an authentic skincare routine reel featuring our Vitamin C serum. Show real results, your genuine reaction, and why it fits your routine.
        </p>
        {briefRequirements.map((req) => (
          <div key={req} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
            <CheckSquare size={14} color="#4ADE80" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '0.875rem', color: '#888888', fontFamily: inter }}>{req}</span>
          </div>
        ))}
      </div>

      {/* Trending hooks */}
      <p style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: inter, padding: '0 1rem', margin: '0 0 0.75rem' }}>
        Trending in your niche
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0 1rem 0.5rem', scrollbarWidth: 'none' }}>
        {trendingHooks.map((h, i) => (
          <div
            key={i}
            style={{
              minWidth: '220px',
              backgroundColor: '#111111',
              border: '1px solid #1F1F1F',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              flexShrink: 0,
            }}
          >
            <p style={{
              fontSize: '0.875rem', color: '#FFFFFF', lineHeight: 1.4,
              margin: 0, fontFamily: inter,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {h.text}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.5rem 0 0', fontFamily: inter }}>
              {h.format} · {h.views} views
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <PrimaryBtn label="Write My Script" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── STEP 2 — Script ──────────────────────────────────────────────────────────

function Step2({ onNext }: { onNext: () => void }) {
  const [script, setScript] = useState('');
  const MAX = 500;

  return (
    <div>
      <p style={{ fontFamily: garamond, fontSize: '1.5rem', fontWeight: 300, color: '#FFFFFF', padding: '0 1rem', margin: '0 0 1rem' }}>
        Write Your Script
      </p>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value.slice(0, MAX))}
        placeholder="Start with your hook — what's the first thing your viewer will see or hear?"
        rows={7}
        style={{
          display: 'block',
          margin: '0 1rem',
          width: 'calc(100% - 2rem)',
          backgroundColor: '#111111',
          border: '1px solid #1F1F1F',
          borderRadius: '0.75rem',
          padding: '1rem',
          fontSize: '0.875rem',
          color: '#FFFFFF',
          fontFamily: inter,
          outline: 'none',
          resize: 'none',
          boxSizing: 'border-box',
        }}
      />
      <p style={{ fontSize: '0.75rem', color: '#888888', textAlign: 'right', margin: '0.25rem 1rem 0', fontFamily: inter }}>
        {script.length}/{MAX}
      </p>

      <div style={{ marginTop: '1rem' }}>
        <PrimaryBtn label="Submit for Review" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── STEP 3 — Waiting ─────────────────────────────────────────────────────────

function Step3({ onSimulate, onHome }: { onSimulate: () => void; onHome: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '16rem', padding: '0 1rem', textAlign: 'center' }}>
      <Clock size={32} color="#888888" style={{ marginBottom: '1rem' }} />
      <p style={{ fontFamily: garamond, fontSize: '1.5rem', fontWeight: 300, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
        Script Under Review
      </p>
      <p style={{ fontSize: '0.875rem', color: '#888888', margin: 0, fontFamily: inter, lineHeight: 1.6 }}>
        We'll notify you once it's been reviewed — usually within 24 hours
      </p>
      <button
        onClick={onHome}
        style={{
          marginTop: '2rem',
          border: '1px solid #1F1F1F',
          color: '#888888',
          fontSize: '0.875rem',
          padding: '0.5rem 1.5rem',
          borderRadius: '0.5rem',
          background: 'none',
          cursor: 'pointer',
          fontFamily: inter,
        }}
      >
        Back to Home
      </button>
      <button
        onClick={onSimulate}
        style={{ marginTop: '0.75rem', background: 'none', border: 'none', fontSize: '0.75rem', color: '#888888', cursor: 'pointer', fontFamily: inter }}
      >
        Simulate Approval →
      </button>
    </div>
  );
}

// ─── STEP 4 — Approved + Checklist ───────────────────────────────────────────

function Step4({ campaign, onNext }: { campaign: Campaign; onNext: () => void }) {
  const [checked, setChecked] = useState<boolean[]>(checklistItems.map(() => false));
  const allChecked = checked.every(Boolean);

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => idx === i ? !v : v));
  }

  return (
    <div style={{ paddingBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 1rem 0' }}>
        <CheckCircle size={32} color="#4ADE80" />
        <p style={{ fontFamily: garamond, fontSize: '1.5rem', fontWeight: 300, color: '#FFFFFF', margin: '0.75rem 0 0.25rem', textAlign: 'center' }}>
          Script Approved
        </p>
        <p style={{ fontSize: '0.875rem', color: '#888888', margin: '0 0 1.5rem', fontFamily: inter, textAlign: 'center' }}>
          {campaign.brand}
        </p>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: inter, padding: '0 1rem', margin: '0 0 0.75rem' }}>
        Before you post
      </p>

      <div style={{ margin: '0 1rem', backgroundColor: '#111111', border: '1px solid #1F1F1F', borderRadius: '0.75rem', overflow: 'hidden' }}>
        {checklistItems.map((item, i) => (
          <div
            key={item}
            onClick={() => toggle(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem',
              borderBottom: i < checklistItems.length - 1 ? '1px solid #1F1F1F' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '1.25rem', height: '1.25rem',
              borderRadius: '0.25rem',
              border: '1px solid #1F1F1F',
              backgroundColor: checked[i] ? '#FFFFFF' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s ease',
            }}>
              {checked[i] && <Check size={12} color="#000000" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: inter }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <PrimaryBtn label="I'm Ready to Post" onClick={onNext} disabled={!allChecked} />
      </div>
    </div>
  );
}

// ─── STEP 5 — Submit Proof ────────────────────────────────────────────────────

function Step5({ onNext }: { onNext: () => void }) {
  const [url, setUrl] = useState('');

  return (
    <div>
      <p style={{ fontFamily: garamond, fontSize: '1.5rem', fontWeight: 300, color: '#FFFFFF', padding: '0 1rem', margin: '1.5rem 0 0.25rem' }}>
        Submit Your Reel
      </p>
      <p style={{ fontSize: '0.875rem', color: '#888888', padding: '0 1rem', margin: '0 0 1.5rem', fontFamily: inter }}>
        Paste the link to your posted Instagram Reel
      </p>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.instagram.com/reel/..."
        style={{
          display: 'block',
          margin: '0 1rem',
          width: 'calc(100% - 2rem)',
          backgroundColor: '#111111',
          border: '1px solid #1F1F1F',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          color: '#FFFFFF',
          fontFamily: inter,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ marginTop: '1rem' }}>
        <PrimaryBtn label="Submit" onClick={onNext} />
      </div>

      <p style={{ fontSize: '0.75rem', color: '#888888', textAlign: 'center', margin: '0.75rem 1rem 0', fontFamily: inter }}>
        Payout processed within 48 hours of verification
      </p>
    </div>
  );
}

// ─── STEP 6 — Payout Pending ──────────────────────────────────────────────────

function Step6({ campaign, onHome }: { campaign: Campaign; onHome: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem 1rem', textAlign: 'center' }}>
      <p style={{ fontFamily: garamond, fontSize: '3rem', fontWeight: 300, color: '#FFFFFF', margin: '0 0 0.25rem' }}>
        ₹{campaign.base.toLocaleString('en-IN')}
      </p>
      <p style={{ fontSize: '0.875rem', color: '#888888', margin: '0 0 0.25rem', fontFamily: inter }}>
        on its way to your UPI
      </p>
      <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0 0 2rem', fontFamily: inter }}>
        + per-view bonus calculated at 30 days
      </p>

      <div style={{ width: '4rem', borderTop: '1px solid #1F1F1F', marginBottom: '2rem' }} />

      <button
        style={{
          border: '1px solid #1F1F1F',
          color: '#888888',
          fontSize: '0.875rem',
          padding: '0.5rem 1.5rem',
          borderRadius: '0.5rem',
          background: 'none',
          cursor: 'pointer',
          fontFamily: inter,
          marginBottom: '0.75rem',
        }}
      >
        View in Wallet
      </button>

      <button
        onClick={onHome}
        style={{ background: 'none', border: 'none', color: '#888888', fontSize: '0.875rem', cursor: 'pointer', fontFamily: inter }}
      >
        Back to Home
      </button>
    </div>
  );
}

// ─── Campaign Flow wrapper ─────────────────────────────────────────────────────

function CampaignFlow({
  campaign,
  onExit,
}: {
  campaign: Campaign;
  onExit: () => void;
}) {
  const [step, setStep] = useState(1);

  function next() { setStep((s) => s + 1); }
  function back() {
    if (step === 1) onExit();
    else setStep((s) => s - 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Back arrow — hide on step 6 */}
      {step < 6 && <BackBtn onClick={back} />}

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '1.5rem' }}>
        {step === 1 && <Step1 campaign={campaign} onNext={next} />}
        {step === 2 && <Step2 onNext={next} />}
        {step === 3 && <Step3 onSimulate={next} onHome={onExit} />}
        {step === 4 && <Step4 campaign={campaign} onNext={next} />}
        {step === 5 && <Step5 onNext={next} />}
        {step === 6 && <Step6 campaign={campaign} onHome={onExit} />}
      </div>
    </div>
  );
}

// ─── Home tabs ────────────────────────────────────────────────────────────────

function HomeTabs({ active, onChange }: { active: HomeTab; onChange: (t: HomeTab) => void }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem 1rem 0', borderBottom: '1px solid #1F1F1F' }}>
      {(['For You', 'Active'] as HomeTab[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            fontSize: '0.875rem',
            paddingBottom: '0.75rem',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            borderBottom: active === t ? '2px solid #FFFFFF' : '2px solid transparent',
            color: active === t ? '#FFFFFF' : '#888888',
            fontFamily: inter,
            marginBottom: '-1px',
            transition: 'color 0.15s ease',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ─── Home screen ──────────────────────────────────────────────────────────────

function HomeScreen({ onApply }: { onApply: (c: Campaign) => void }) {
  const [homeTab, setHomeTab] = useState<HomeTab>('For You');

  return (
    <>
      <HomeTabs active={homeTab} onChange={setHomeTab} />

      {homeTab === 'For You' && (
        <>
          <p style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: inter, padding: '1rem 1rem 0.75rem', margin: 0 }}>
            Recommended for you
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 1rem' }}>
            {recommendedCampaigns.map((c) => (
              <div key={c.brand} style={{ backgroundColor: '#111111', border: '1px solid #1F1F1F', borderRadius: '0.75rem', padding: '1rem' }}>
                <p style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 500, margin: 0, fontFamily: inter }}>
                  {c.brand}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.125rem 0 0.75rem', fontFamily: inter }}>
                  {c.niche}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: inter }}>
                    ₹{c.base.toLocaleString('en-IN')} base + ₹{c.bonus}/1K views
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontFamily: inter }}>
                    {c.spots} spots left
                  </span>
                </div>
                <button
                  onClick={() => onApply(c)}
                  style={{
                    width: '100%', marginTop: '0.75rem',
                    backgroundColor: '#FFFFFF', color: '#000000',
                    fontSize: '0.875rem', fontWeight: 500,
                    padding: '0.5rem', borderRadius: '0.5rem',
                    border: 'none', cursor: 'pointer', fontFamily: inter,
                  }}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {homeTab === 'Active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
          {activeCampaigns.map((c) => {
            const approved = c.status === 'Script Approved';
            return (
              <div key={c.brand} style={{ backgroundColor: '#111111', border: '1px solid #1F1F1F', borderRadius: '0.75rem', padding: '1rem' }}>
                <p style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 500, margin: 0, fontFamily: inter }}>{c.brand}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.375rem 0 0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: approved ? '#4ADE80' : '#FACC15' }} />
                  <span style={{ fontSize: '0.75rem', color: '#888888', fontFamily: inter }}>{c.status}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, fontFamily: inter }}>
                  {c.views.toLocaleString('en-IN')} views so far
                </p>
                <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.25rem 0 0', fontFamily: inter }}>
                  Due {c.deadline}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Profile screen ───────────────────────────────────────────────────────────

type MenuItem = {
  label: string;
  sub?: string | null;
  icon: React.ElementType;
  destructive?: boolean;
};

const menuItems: MenuItem[] = [
  { label: 'Wallet',       sub: '₹4,800 available', icon: Wallet },
  { label: 'IG Account',   sub: 'Not connected',    icon: Link },
  { label: 'UPI Withdraw', sub: null,               icon: ArrowUpRight },
  { label: 'Archive',      sub: null,               icon: Archive },
  { label: 'Support',      sub: null,               icon: HelpCircle },
  { label: 'Log Out',      sub: null,               icon: LogOut, destructive: true },
];

function ProfileScreen() {
  const [igExpanded, setIgExpanded] = useState(false);

  return (
    <div>
      {/* Top section */}
      <div style={{
        padding: '1.5rem 1rem 1rem',
        borderBottom: '1px solid #1F1F1F',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          width: '4rem', height: '4rem',
          backgroundColor: '#1F1F1F', borderRadius: '9999px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', color: '#FFFFFF',
          fontFamily: inter, marginBottom: '0.75rem',
        }}>
          PS
        </div>
        <p style={{ fontFamily: garamond, fontSize: '1.5rem', fontWeight: 300, color: '#FFFFFF', margin: 0, textAlign: 'center' }}>
          Priya Sharma
        </p>
        <p style={{ fontSize: '0.875rem', color: '#888888', margin: '0.25rem 0 0', fontFamily: inter, textAlign: 'center' }}>
          Skincare · Mumbai
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem', padding: '1rem',
        borderBottom: '1px solid #1F1F1F',
      }}>
        {[
          { label: 'Total Views', value: '284K' },
          { label: 'Revenue',     value: '₹18,400' },
          { label: 'Posts',       value: '12' },
        ].map((s) => (
          <div key={s.label} style={{
            backgroundColor: '#111111', border: '1px solid #1F1F1F',
            borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center',
          }}>
            <p style={{ fontFamily: garamond, fontSize: '1.125rem', fontWeight: 300, color: '#FFFFFF', margin: 0 }}>
              {s.value}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.25rem 0 0', fontFamily: inter }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Menu list */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item, i) => {
          const isIg = item.label === 'IG Account';
          const isLogout = item.label === 'Log Out';
          const color = item.destructive ? '#F87171' : '#FFFFFF';

          return (
            <div key={item.label}>
              <div
                onClick={() => isIg && setIgExpanded((v) => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '1rem',
                  borderBottom: i < menuItems.length - 1 ? '1px solid #1F1F1F' : 'none',
                  cursor: 'pointer',
                }}
              >
                <item.icon size={18} color={item.destructive ? '#F87171' : '#888888'} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color, margin: 0, fontFamily: inter }}>
                    {item.label}
                  </p>
                  {item.sub && (
                    <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.125rem 0 0', fontFamily: inter }}>
                      {item.sub}
                    </p>
                  )}
                </div>
                {!isLogout && <ChevronRight size={14} color="#888888" style={{ flexShrink: 0 }} />}
              </div>

              {/* IG inline expand */}
              {isIg && igExpanded && (
                <div style={{
                  margin: '0 1rem 0.75rem',
                  backgroundColor: '#111111',
                  border: '1px solid #1F1F1F',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                }}>
                  <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0 0 0.75rem', fontFamily: inter, lineHeight: 1.6 }}>
                    Connect your Instagram to get a Verified Audience badge and rank higher in brand matches
                  </p>
                  <button style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF', color: '#000000',
                    fontSize: '0.875rem', fontWeight: 500,
                    padding: '0.5rem', borderRadius: '0.5rem',
                    border: 'none', cursor: 'pointer', fontFamily: inter,
                  }}>
                    Connect Instagram
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Notifications screen ─────────────────────────────────────────────────────

const notifications = [
  { type: 'success', title: 'Application Accepted',  sub: 'Minimalist · Skincare Campaign',                    time: '2m ago'    },
  { type: 'success', title: 'Script Approved',        sub: 'Your script for Minimalist is ready to shoot',      time: '1h ago'    },
  { type: 'success', title: 'Payout Sent',            sub: '₹2,000 sent to your UPI',                          time: '3h ago'    },
  { type: 'warning', title: 'Script Needs Revision',  sub: 'Bombay Shaving Co. left a note on your script',    time: 'Yesterday' },
  { type: 'success', title: 'New Campaign Match',     sub: "You've been matched with Mamaearth",               time: '2 days ago'},
  { type: 'success', title: 'Application Accepted',   sub: 'Noise · Tech Campaign',                            time: '3 days ago'},
];

function NotificationsScreen() {
  return (
    <div>
      <p style={{
        fontSize: '1.125rem', color: '#FFFFFF',
        padding: '1.25rem 1rem 1rem',
        margin: 0,
        fontFamily: inter,
        borderBottom: '1px solid #1F1F1F',
      }}>
        Notifications
      </p>
      {notifications.map((n, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            padding: '1rem',
            borderBottom: '1px solid #1F1F1F',
          }}
        >
          <div style={{
            width: '0.5rem', height: '0.5rem',
            borderRadius: '9999px',
            backgroundColor: n.type === 'success' ? '#4ADE80' : '#FACC15',
            flexShrink: 0,
            marginTop: '0.375rem',
          }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, fontFamily: inter }}>
              {n.title}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.25rem 0 0', fontFamily: inter }}>
              {n.sub}
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#888888', fontFamily: inter, flexShrink: 0 }}>
            {n.time}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: BottomTab; Icon: React.ElementType }[] = [
  { label: 'Home',          Icon: House     },
  { label: 'Campaigns',     Icon: Briefcase },
  { label: 'Profile',       Icon: User      },
  { label: 'Notifications', Icon: Bell      },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatorDashboard() {
  const [activeTab, setActiveTab]           = useState<BottomTab>('Home');
  const [showCampaignFlow, setShowCampaignFlow] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  function handleApply(c: Campaign) {
    setSelectedCampaign(c);
    setShowCampaignFlow(true);
  }

  function exitFlow() {
    setShowCampaignFlow(false);
    setSelectedCampaign(null);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '390px', minHeight: '100vh', backgroundColor: '#000000', position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1F1F1F', flexShrink: 0 }}>
          <span style={{ fontFamily: garamond, fontSize: '1.125rem', fontWeight: 300, color: '#FFFFFF', letterSpacing: '0.05em' }}>
            CREATR.UGC
          </span>
        </div>

        {/* Main content */}
        {showCampaignFlow && selectedCampaign ? (
          // Campaign flow — no bottom nav, fills remaining height
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <CampaignFlow campaign={selectedCampaign} onExit={exitFlow} />
          </div>
        ) : (
          <>
            {/* Normal home content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '5rem' }}>
              {activeTab === 'Home' && <HomeScreen onApply={handleApply} />}
              {activeTab === 'Campaigns' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12rem', color: '#888888', fontSize: '0.875rem', fontFamily: inter }}>Campaigns</div>
              )}
              {activeTab === 'Profile' && <ProfileScreen />}
              {activeTab === 'Notifications' && <NotificationsScreen />}
            </div>

            {/* Bottom nav */}
            <div style={{
              position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: '390px', height: '4rem',
              backgroundColor: '#0A0A0A', borderTop: '1px solid #1F1F1F',
              display: 'flex', justifyContent: 'space-around', alignItems: 'center',
              padding: '0 1rem', zIndex: 20,
            }}>
              {NAV_ITEMS.map(({ label, Icon }) => {
                const isActive = activeTab === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', background: 'none', border: 'none', padding: '0.25rem 0.5rem' }}
                  >
                    <Icon size={20} color={isActive ? '#FFFFFF' : '#888888'} />
                    <span style={{ fontSize: '0.75rem', color: isActive ? '#FFFFFF' : '#888888', fontFamily: inter, transition: 'color 0.15s ease' }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
