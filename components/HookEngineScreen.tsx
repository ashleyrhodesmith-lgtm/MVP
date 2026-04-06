'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Hook = {
  id: number;
  title: string;
  views: string;
  type: string;
  niche: string;
  hook: string;
  script: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const hooks: Hook[] = [
  {
    id: 1,
    title: 'Morning Routine Reveal',
    views: '2.1M',
    type: 'Before-After',
    niche: 'Skincare',
    hook: "POV: I stopped washing my face with soap 30 days ago. Here's what happened.",
    script: "Hook: [Show bare face] 'This was me 30 days ago'\nBody: Walk through the 3-product switch\nCTA: 'Link in bio for the exact routine'",
  },
  {
    id: 2,
    title: '60 Second Transformation',
    views: '1.8M',
    type: 'POV',
    niche: 'Skincare',
    hook: "I tried the 'lazy girl skincare' trend for a week so you don't have to.",
    script: "Hook: [Hold up 1 product] 'What if your entire routine was this?'\nBody: Show results day by day\nCTA: 'Comment ROUTINE and I'll DM you'",
  },
  {
    id: 3,
    title: 'Dermat Reacts',
    views: '1.4M',
    type: 'Reaction',
    niche: 'Skincare',
    hook: 'A dermatologist reviewed my skincare and said this one thing.',
    script: "Hook: 'She said I was doing everything wrong'\nBody: The one change that made the difference\nCTA: 'Save this before you buy anything else'",
  },
  {
    id: 4,
    title: 'Product Dupe Exposed',
    views: '980K',
    type: 'Problem-Solution',
    niche: 'Skincare',
    hook: 'I spent ₹8000 on this serum. Found the exact same thing for ₹400.',
    script: "Hook: [Show expensive product] 'Don't buy this'\nBody: Side by side comparison\nCTA: 'Which one would you try?'",
  },
  {
    id: 5,
    title: 'Night Routine ASMR',
    views: '760K',
    type: 'Lifestyle',
    niche: 'Skincare',
    hook: 'My night routine that finally cleared my skin after 3 years of trying.',
    script: "Hook: [Soft lighting, close up] 'This took me 3 years to figure out'\nBody: Each step shown slowly\nCTA: 'Follow for part 2'",
  },
];

const ACTIVE_CREATORS = ['Priya Sharma', 'Arjun Mehta'];

// ─── Script parser ─────────────────────────────────────────────────────────────
// Splits "Hook: ...\nBody: ...\nCTA: ..." into structured rows

function parseScript(script: string): { tag: string; content: string }[] {
  return script.split('\n').map((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return { tag: '', content: line };
    return {
      tag: line.slice(0, colonIdx).trim(),
      content: line.slice(colonIdx + 1).trim(),
    };
  });
}

// ─── Push Modal ───────────────────────────────────────────────────────────────

function PushModal({ hookTitle, onClose }: { hookTitle: string; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(ACTIVE_CREATORS);

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#888888', display: 'flex', padding: 0,
          }}
        >
          <X size={16} color="#888888" />
        </button>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.25rem', fontWeight: 300,
          color: '#FFFFFF', margin: '0 0 1rem 0',
        }}>
          Push Script To
        </h2>

        {/* Creator list */}
        <div>
          {ACTIVE_CREATORS.map((name) => (
            <label
              key={name}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid #1F1F1F',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(name)}
                onChange={() => toggle(name)}
                style={{ accentColor: '#FFFFFF', width: '14px', height: '14px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
                {name}
              </span>
            </label>
          ))}
        </div>

        {/* Confirm */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF', color: '#000000',
            padding: '0.625rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem', fontWeight: 500,
            fontFamily: "'Inter', system-ui, sans-serif",
            border: 'none', cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Confirm &amp; Push
        </button>
      </div>
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function HookDetail({ hook, onPush }: { hook: Hook; onPush: () => void }) {
  const scriptRows = parseScript(hook.script);

  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #1F1F1F',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      flex: 1,
    }}>
      {/* Title */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.5rem', fontWeight: 300,
        color: '#FFFFFF', margin: '0 0 0.375rem 0',
      }}>
        {hook.title}
      </h2>

      {/* Meta */}
      <div style={{
        display: 'flex', gap: '0.75rem',
        fontSize: '0.875rem', color: '#888888',
        fontFamily: "'Inter', system-ui, sans-serif",
        marginBottom: '1.5rem',
      }}>
        <span>{hook.views} views</span>
        <span>·</span>
        <span>{hook.type}</span>
      </div>

      {/* Hook line */}
      <p style={{
        fontSize: '0.75rem', color: '#888888',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        margin: '0 0 0.5rem 0',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Hook
      </p>
      <div style={{
        backgroundColor: '#0A0A0A',
        border: '1px solid #1F1F1F',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontSize: '0.875rem',
        color: '#FFFFFF',
        fontFamily: "''Courier New', Courier, monospace'",
        lineHeight: 1.6,
      }}>
        {hook.hook}
      </div>

      {/* Script breakdown */}
      <p style={{
        fontSize: '0.75rem', color: '#888888',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        margin: '1.5rem 0 0.75rem 0',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Script Structure
      </p>
      <div>
        {scriptRows.map(({ tag, content }, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{
              fontSize: '0.75rem', color: '#888888',
              width: '2rem', paddingTop: '0.125rem',
              textTransform: 'uppercase',
              fontFamily: "'Inter', system-ui, sans-serif",
              flexShrink: 0,
            }}>
              {tag}
            </span>
            <span style={{
              fontSize: '0.875rem', color: '#FFFFFF',
              lineHeight: 1.6,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              {content}
            </span>
          </div>
        ))}
      </div>

      {/* Divider + CTA */}
      <div style={{ borderTop: '1px solid #1F1F1F', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
        <button
          onClick={onPush}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF', color: '#000000',
            padding: '0.625rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem', fontWeight: 500,
            fontFamily: "'Inter', system-ui, sans-serif",
            border: 'none', cursor: 'pointer',
          }}
        >
          Push This Script to Creators
        </button>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function HookEngineScreen() {
  const [selectedId, setSelectedId] = useState(hooks[0].id);
  const [showModal, setShowModal] = useState(false);

  const selected = hooks.find((h) => h.id === selectedId)!;

  return (
    <>
      {/* Page header */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.875rem', fontWeight: 300,
        color: '#FFFFFF', margin: '0 0 0.375rem 0',
      }}>
        Hook Engine
      </h1>
      <p style={{
        fontSize: '0.875rem', color: '#888888',
        margin: '0 0 2rem 0',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        Top performing hooks, scripts and formats from your niche
      </p>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Left panel — hook list */}
        <div style={{ width: '288px', flexShrink: 0 }}>
          {hooks.map((h, idx) => {
            const isActive = selectedId === h.id;
            return (
              <div
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                style={{
                  display: 'flex', gap: '0.75rem',
                  alignItems: 'flex-start',
                  padding: '0.75rem 0.75rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #1F1F1F',
                  backgroundColor: isActive ? '#111111' : 'transparent',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {/* Rank */}
                <span style={{
                  fontSize: '0.875rem', color: '#888888',
                  width: '1.25rem', flexShrink: 0,
                  paddingTop: '0.125rem',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>
                  {idx + 1}
                </span>

                {/* Thumbnail */}
                <div style={{
                  width: '2.5rem', height: '3.5rem',
                  backgroundColor: '#1F1F1F',
                  borderRadius: '0.25rem',
                  flexShrink: 0,
                }} />

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.875rem', color: '#FFFFFF',
                    margin: 0,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {h.title}
                  </p>
                  <p style={{
                    fontSize: '0.75rem', color: '#888888',
                    margin: '0.25rem 0 0 0',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}>
                    {h.views}
                  </p>
                  <p style={{
                    fontSize: '0.75rem', color: '#888888',
                    margin: '0.125rem 0 0 0',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}>
                    {h.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel — detail */}
        <HookDetail hook={selected} onPush={() => setShowModal(true)} />
      </div>

      {/* Push modal */}
      {showModal && (
        <PushModal hookTitle={selected.title} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
