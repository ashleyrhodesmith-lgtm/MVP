'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Creator = {
  id: number;
  name: string;
  niche: string;
  region: string;
  followers: string;
  score: number;
};

type OutreachEntry = Creator & { status: 'Pending' | 'Accepted' };

type ActiveCreator = {
  name: string;
  niche: string;
  views: number;
  target: number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CREATORS: Creator[] = [
  { id: 1, name: 'Priya Sharma',  niche: 'Skincare', region: 'Mumbai',    followers: '28K', score: 92 },
  { id: 2, name: 'Arjun Mehta',   niche: 'Fitness',  region: 'Delhi',     followers: '45K', score: 88 },
  { id: 3, name: 'Sneha Kapoor',  niche: 'Food',     region: 'Bangalore', followers: '19K', score: 85 },
  { id: 4, name: 'Rohan Das',     niche: 'Tech',     region: 'Hyderabad', followers: '62K', score: 79 },
  { id: 5, name: 'Ananya Singh',  niche: 'Fashion',  region: 'Pune',      followers: '33K', score: 76 },
  { id: 6, name: 'Karan Patel',   niche: 'Travel',   region: 'Jaipur',    followers: '22K', score: 71 },
];

const ACTIVE_CREATORS: ActiveCreator[] = [
  { name: 'Priya Sharma', niche: 'Skincare', views: 12400, target: 50000 },
  { name: 'Arjun Mehta',  niche: 'Fitness',  views: 8900,  target: 50000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase();
}

function formatViews(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      backgroundColor: '#1F1F1F',
      borderRadius: '9999px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 40 ? '0.75rem' : '1.125rem',
      color: '#FFFFFF',
      flexShrink: 0,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {initials(name)}
    </div>
  );
}

function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ fontSize: '0.75rem', color: '#888888', marginBottom: '0.375rem', margin: '0 0 6px 0' }}>
        {label}
      </p>
      <div style={{ height: '4px', backgroundColor: '#1F1F1F', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'Find' | 'Outreach' | 'Active';

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: Tab[] = ['Find', 'Outreach', 'Active'];
  return (
    <div style={{
      display: 'flex', gap: '1.5rem',
      borderBottom: '1px solid #1F1F1F',
      marginBottom: '1.5rem',
    }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            fontSize: '0.875rem',
            paddingBottom: '0.5rem',
            cursor: 'pointer',
            background: 'none', border: 'none',
            borderBottom: active === t ? '2px solid #FFFFFF' : '2px solid transparent',
            color: active === t ? '#FFFFFF' : '#888888',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'color 0.15s ease',
            marginBottom: '-1px',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ─── Score My List data ───────────────────────────────────────────────────────

type ScoreRow = {
  handle: string;
  status: 'on' | 'off';
  score: number | null;
  niche: string;
  followers: string;
};

const SCORE_RESULTS: ScoreRow[] = [
  { handle: '@priya.skincare',   status: 'on',  score: 91, niche: 'Skincare', followers: '28K' },
  { handle: '@arjunfitlife',     status: 'on',  score: 84, niche: 'Fitness',  followers: '45K' },
  { handle: '@sneha.eats',       status: 'off', score: null, niche: '-',      followers: '-'   },
  { handle: '@rohantech99',      status: 'on',  score: 76, niche: 'Tech',     followers: '62K' },
  { handle: '@fashionbyananya',  status: 'off', score: null, niche: '-',      followers: '-'   },
  { handle: '@karanontour',      status: 'on',  score: 69, niche: 'Travel',   followers: '22K' },
];

// ─── Find Tab ─────────────────────────────────────────────────────────────────

function FindTab({ onSendOutreach }: { onSendOutreach: (c: Creator) => void }) {
  const [findMode, setFindMode] = useState<'Find Creators' | 'Score My List'>('Find Creators');
  const [scoreState, setScoreState] = useState<'upload' | 'paste' | 'results'>('upload');
  const [pasteValue, setPasteValue] = useState('');
  const [selectedId, setSelectedId] = useState(CREATORS[0].id);
  const selected = CREATORS.find((c) => c.id === selectedId)!;

  const inter = "'Inter', system-ui, sans-serif";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Mode toggle */}
      <div style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        backgroundColor: '#111111',
        border: '1px solid #1F1F1F',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        marginBottom: '1.25rem',
      }}>
        {(['Find Creators', 'Score My List'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFindMode(mode)}
            style={{
              fontSize: '0.875rem',
              padding: '0.375rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: findMode === mode ? '#FFFFFF' : 'transparent',
              color: findMode === mode ? '#000000' : '#888888',
              fontFamily: inter,
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* ── Find Creators ── */}
      {findMode === 'Find Creators' && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flex: 1, minHeight: 0 }}>
          {/* Left panel */}
          <div style={{ width: '320px', flexShrink: 0, overflowY: 'auto' }}>
            {CREATORS.map((creator) => (
              <div
                key={creator.id}
                onClick={() => setSelectedId(creator.id)}
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #1F1F1F',
                  backgroundColor: selectedId === creator.id ? '#111111' : 'transparent',
                  transition: 'background-color 0.1s ease',
                }}
              >
                <Avatar name={creator.name} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, fontFamily: inter }}>
                    {creator.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0, fontFamily: inter }}>
                    {creator.niche}
                  </p>
                </div>
                <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontWeight: 500, fontFamily: inter, flexShrink: 0 }}>
                  {creator.score}
                </span>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <Avatar name={selected.name} size={64} />
              <div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.5rem', fontWeight: 300,
                  color: '#FFFFFF', margin: '0 0 4px 0',
                }}>
                  {selected.name}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#888888', fontFamily: inter, marginBottom: '4px' }}>
                  <span>{selected.niche}</span>
                  <span>·</span>
                  <span>{selected.region}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, fontFamily: inter }}>
                  {selected.followers} followers
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #1F1F1F', marginTop: '1rem', marginBottom: '1rem' }} />

            <p style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem 0', fontFamily: inter }}>
              Match Score
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.25rem', fontWeight: 300, color: '#FFFFFF', margin: '0 0 1rem 0' }}>
              {selected.score}<span style={{ fontSize: '1rem', color: '#888888' }}>/100</span>
            </p>

            <ProgressBar label="Niche Fit" pct={selected.score} />
            <ProgressBar label="Audience Fit" pct={Math.max(selected.score - 8, 40)} />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={() => onSendOutreach(selected)}
                style={{
                  backgroundColor: '#FFFFFF', color: '#000000',
                  fontSize: '0.875rem', fontWeight: 500,
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  border: 'none', cursor: 'pointer',
                  fontFamily: inter,
                  transition: 'opacity 0.15s ease',
                }}
              >
                Send Outreach
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #1F1F1F',
                  color: '#888888',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontFamily: inter,
                }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Score My List ── */}
      {findMode === 'Score My List' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>

          {/* Upload state */}
          {scoreState === 'upload' && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '4rem 1rem',
              border: '1px dashed #1F1F1F',
              borderRadius: '0.75rem',
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              <Upload size={32} color="#888888" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: '0 0 0.25rem 0', fontFamily: inter }}>
                Upload a CSV or paste Instagram handles
              </p>
              <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0 0 1.5rem 0', fontFamily: inter, textAlign: 'center' }}>
                We'll score each creator against your campaign requirements
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setScoreState('results')}
                  style={{
                    border: '1px solid #1F1F1F', color: '#888888',
                    fontSize: '0.875rem', padding: '0.5rem 1rem',
                    borderRadius: '0.5rem', backgroundColor: 'transparent',
                    cursor: 'pointer', fontFamily: inter,
                  }}
                >
                  Upload CSV
                </button>
                <button
                  onClick={() => setScoreState('paste')}
                  style={{
                    backgroundColor: '#FFFFFF', color: '#000000',
                    fontSize: '0.875rem', padding: '0.5rem 1rem',
                    borderRadius: '0.5rem', border: 'none',
                    cursor: 'pointer', fontFamily: inter,
                  }}
                >
                  Paste Handles
                </button>
              </div>
            </div>
          )}

          {/* Paste state */}
          {scoreState === 'paste' && (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
              <textarea
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                placeholder="@handle1, @handle2, @handle3..."
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #1F1F1F',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: '#FFFFFF',
                  height: '8rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: inter,
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => setScoreState('results')}
                style={{
                  backgroundColor: '#FFFFFF', color: '#000000',
                  fontSize: '0.875rem', padding: '0.5rem 1rem',
                  borderRadius: '0.5rem', border: 'none',
                  cursor: 'pointer', fontFamily: inter,
                  marginTop: '0.75rem',
                }}
              >
                Score These Creators
              </button>
            </div>
          )}

          {/* Results state */}
          {scoreState === 'results' && (
            <div>
              {/* Header row with Start Over */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <span
                  onClick={() => { setScoreState('upload'); setPasteValue(''); }}
                  style={{ fontSize: '0.75rem', color: '#888888', cursor: 'pointer', fontFamily: inter }}
                >
                  Start Over
                </span>
              </div>

              {/* Table header */}
              <div style={{
                display: 'flex', padding: '0.5rem 1rem',
                borderBottom: '1px solid #1F1F1F',
                fontSize: '0.75rem', color: '#888888',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontFamily: inter,
              }}>
                <span style={{ flex: 1 }}>Handle</span>
                <span style={{ width: '112px' }}>Status</span>
                <span style={{ width: '4rem' }}>Score</span>
                <span style={{ width: '5rem' }}>Niche</span>
                <span style={{ width: '4rem' }}>Followers</span>
                <span style={{ width: '6rem' }}>Action</span>
              </div>

              {/* Rows */}
              {SCORE_RESULTS.map((row) => (
                <div
                  key={row.handle}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #1F1F1F',
                    fontFamily: inter,
                  }}
                >
                  <span style={{ fontSize: '0.875rem', color: '#FFFFFF', flex: 1 }}>{row.handle}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', width: '112px' }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '9999px', flexShrink: 0,
                      backgroundColor: row.status === 'on' ? '#4ADE80' : '#1F1F1F',
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#888888' }}>
                      {row.status === 'on' ? 'On CREATR' : 'Not on CREATR'}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.875rem', color: '#FFFFFF', width: '4rem' }}>
                    {row.score !== null ? row.score : '—'}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: '#888888', width: '5rem' }}>{row.niche}</span>
                  <span style={{ fontSize: '0.75rem', color: '#888888', width: '4rem' }}>{row.followers}</span>

                  <div style={{ width: '6rem' }}>
                    {row.status === 'on' ? (
                      <button style={{
                        fontSize: '0.75rem', backgroundColor: '#FFFFFF', color: '#000000',
                        padding: '0.25rem 0.75rem', borderRadius: '0.25rem',
                        border: 'none', cursor: 'pointer', fontFamily: inter,
                      }}>
                        Outreach
                      </button>
                    ) : (
                      <button style={{
                        fontSize: '0.75rem', backgroundColor: 'transparent',
                        border: '1px solid #1F1F1F', color: '#888888',
                        padding: '0.25rem 0.75rem', borderRadius: '0.25rem',
                        cursor: 'pointer', fontFamily: inter,
                      }}>
                        Invite
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Outreach Tab ─────────────────────────────────────────────────────────────

function OutreachTab({ entries, onMarkAccepted }: { entries: OutreachEntry[]; onMarkAccepted: (id: number) => void }) {
  if (entries.length === 0) {
    return (
      <p style={{ fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>
        No outreach sent yet. Go to Find and click "Send Outreach".
      </p>
    );
  }
  return (
    <div>
      {entries.map((entry) => (
        <div
          key={entry.id}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #1F1F1F',
          }}
        >
          <Avatar name={entry.name} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
              {entry.name}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
              {entry.niche}
            </p>
          </div>

          {/* Mark Accepted */}
          {entry.status === 'Pending' && (
            <button
              onClick={() => onMarkAccepted(entry.id)}
              style={{
                fontSize: '0.75rem', color: '#888888',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
                padding: '0 0.5rem',
              }}
            >
              Mark Accepted
            </button>
          )}

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '9999px',
              backgroundColor: entry.status === 'Accepted' ? '#4ADE80' : '#FACC15',
            }} />
            <span style={{ fontSize: '0.75rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>
              {entry.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Active Tab ────────────────────────────────────────────────────────────────

function ActiveTab() {
  const [modalCreator, setModalCreator] = useState<ActiveCreator | null>(null);

  return (
    <>
      <div>
        {ACTIVE_CREATORS.map((creator) => (
          <div
            key={creator.name}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #1F1F1F',
            }}
          >
            <Avatar name={creator.name} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', color: '#FFFFFF', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
                {creator.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
                {creator.niche}
              </p>
            </div>

            {/* Views + progress */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', marginLeft: 'auto', marginRight: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
                {formatViews(creator.views)} views
              </span>
              <div style={{ width: '96px', height: '4px', backgroundColor: '#1F1F1F', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(creator.views / creator.target) * 100}%`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                }} />
              </div>
            </div>

            <button
              onClick={() => setModalCreator(creator)}
              style={{
                fontSize: '0.75rem',
                border: '1px solid #1F1F1F',
                color: '#888888',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Quick View
            </button>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {modalCreator && (
        <div
          onClick={() => setModalCreator(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1F1F1F',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '384px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setModalCreator(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#888888', display: 'flex',
              }}
            >
              <X size={16} />
            </button>

            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1rem', fontWeight: 400, color: '#FFFFFF',
              margin: 0,
            }}>
              {modalCreator.name}
            </p>

            <p style={{
              fontSize: '0.75rem', color: '#888888',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              margin: '1rem 0 0.25rem 0',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              Reel Link
            </p>
            <a
              href="https://www.instagram.com/reel/example"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.875rem',
                color: '#FFFFFF',
                fontFamily: "'Inter', system-ui, sans-serif",
                textDecoration: 'underline',
              }}
            >
              https://www.instagram.com/reel/example
            </a>

            <div style={{ borderTop: '1px solid #1F1F1F', margin: '1rem 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Views',    value: '12.4K' },
                { label: 'Likes',    value: '892'   },
                { label: 'Comments', value: '134'   },
                { label: 'Shares',   value: '67'    },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0 0 0.25rem 0', fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <p style={{
              fontSize: '0.75rem',
              color: '#888888',
              textAlign: 'center',
              marginTop: '1rem',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              Creator self-reported · Last updated 2h ago
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CreatorsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Find');
  const [outreachList, setOutreachList] = useState<OutreachEntry[]>([]);

  function handleSendOutreach(creator: Creator) {
    setOutreachList((prev) => {
      if (prev.find((e) => e.id === creator.id)) return prev;
      return [...prev, { ...creator, status: 'Pending' }];
    });
    setActiveTab('Outreach');
  }

  function handleMarkAccepted(id: number) {
    setOutreachList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Accepted' } : e))
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Find' && (
        <FindTab onSendOutreach={handleSendOutreach} />
      )}
      {activeTab === 'Outreach' && (
        <OutreachTab entries={outreachList} onMarkAccepted={handleMarkAccepted} />
      )}
      {activeTab === 'Active' && (
        <ActiveTab />
      )}
    </div>
  );
}
