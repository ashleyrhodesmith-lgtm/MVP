'use client';

import { useState } from 'react';
import BrandLayout from '@/components/BrandLayout';
import CreatorsScreen from '@/components/CreatorsScreen';
import OverviewScreen from '@/components/OverviewScreen';
import AnalyticsScreen from '@/components/AnalyticsScreen';
import HookEngineScreen from '@/components/HookEngineScreen';
import NewCampaign from '@/components/NewCampaign';

type NavLabel = 'Creators' | 'Overview' | 'Leaderboard' | 'Hook Engine';

function ActiveScreen({ nav }: { nav: NavLabel }) {
  switch (nav) {
    case 'Overview':      return <OverviewScreen />;
    case 'Leaderboard':   return <AnalyticsScreen />;
    case 'Hook Engine':  return <HookEngineScreen />;
    case 'Creators':
    default:             return <CreatorsScreen />;
  }
}

export default function Home() {
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [activeNav, setActiveNav] = useState<NavLabel>('Creators');

  if (showNewCampaign) {
    return <NewCampaign onBack={() => setShowNewCampaign(false)} />;
  }

  return (
    <BrandLayout
      onNewCampaign={() => setShowNewCampaign(true)}
      activeNav={activeNav}
      onNavChange={(label) => setActiveNav(label as NavLabel)}
    >
      <ActiveScreen nav={activeNav} />
    </BrandLayout>
  );
}
