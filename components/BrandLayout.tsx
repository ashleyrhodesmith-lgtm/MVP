'use client';

import { Users, LayoutDashboard, BarChart2, Zap, LogOut, ChevronDown } from 'lucide-react';

type NavItem = {
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { label: 'Creators', icon: Users },
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Leaderboard', icon: BarChart2 },
  { label: 'Hook Engine', icon: Zap },
];

interface BrandLayoutProps {
  children: React.ReactNode;
  onNewCampaign: () => void;
  activeNav: string;
  onNavChange: (label: string) => void;
}

export default function BrandLayout({ children, onNewCampaign, activeNav, onNavChange }: BrandLayoutProps) {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#000000' }}>

      {/* ── Top Nav Bar ────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '3.5rem',
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #1F1F1F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        zIndex: 20,
      }}>
        {/* Left: Logo + Campaigns dropdown */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 300,
            color: '#FFFFFF',
            letterSpacing: '0.05em',
          }}>
            CREATR.UGC
          </span>

          <button style={{
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            marginLeft: '1.5rem',
            background: 'none', border: 'none',
            fontSize: '0.875rem', color: '#888888',
            fontFamily: "'Inter', system-ui, sans-serif",
            cursor: 'pointer',
          }}>
            My Campaigns
            <ChevronDown size={14} color="#888888" />
          </button>
        </div>

        {/* Right: New Campaign */}
        <button
          onClick={onNewCampaign}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#000000',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
            transition: 'opacity 0.15s ease',
          }}
        >
          New Campaign
        </button>
      </header>

      {/* ── Body (sidebar + content) ────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, paddingTop: '3.5rem' }}>

        {/* Sidebar */}
        <aside style={{
          position: 'fixed',
          top: '3.5rem',
          left: 0,
          width: '240px',
          height: 'calc(100vh - 3.5rem)',
          backgroundColor: '#0A0A0A',
          borderRight: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10,
        }}>
          {/* Nav items */}
          <nav style={{ paddingTop: '1.5rem' }}>
            {navItems.map(({ label, icon: Icon }) => {
              const isActive = activeNav === label;
              return (
                <button
                  key={label}
                  onClick={() => onNavChange(label)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    paddingLeft: isActive ? 'calc(1.5rem - 2px)' : '1.5rem',
                    paddingRight: '1.5rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    fontSize: '0.875rem',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    color: isActive ? '#FFFFFF' : '#888888',
                    borderLeft: isActive ? '2px solid #FFFFFF' : '2px solid transparent',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'color 0.15s ease',
                  }}
                >
                  <Icon size={16} color={isActive ? '#FFFFFF' : '#888888'} style={{ flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Bottom user row */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.75rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderTop: '1px solid #1F1F1F',
          }}>
            <div style={{
              width: '1.75rem', height: '1.75rem',
              backgroundColor: '#1F1F1F',
              borderRadius: '9999px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', color: '#FFFFFF',
              flexShrink: 0,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              SG
            </div>
            <span style={{
              fontSize: '0.75rem', color: '#888888',
              fontFamily: "'Inter', system-ui, sans-serif",
              flex: 1,
            }}>
              Sa Gandhi
            </span>
            <LogOut size={14} color="#888888" style={{ flexShrink: 0 }} />
          </div>
        </aside>

        {/* Main content */}
        <main style={{
          marginLeft: '240px',
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          backgroundColor: '#000000',
          minHeight: 'calc(100vh - 3.5rem)',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
