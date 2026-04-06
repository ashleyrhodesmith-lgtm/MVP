'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignType = 'full' | 'discovery' | null;

interface StepData {
  campaignType: CampaignType;
  niche: string;
  region: string;
  followerRange: string;
  numCreators: string;
  productBrief: string;
  ageRange: string;
  gender: string;
  targetCities: string;
  language: string;
  baseFee: string;
  perViewBonus: string;
  budgetCap: string;
}

const INITIAL_DATA: StepData = {
  campaignType: null,
  niche: 'Skincare',
  region: 'Pan India',
  followerRange: '10K–50K',
  numCreators: '',
  productBrief: '',
  ageRange: '18–24',
  gender: 'All',
  targetCities: '',
  language: 'Hindi + English',
  baseFee: '',
  perViewBonus: '',
  budgetCap: '',
};

// ─── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#888888',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.375rem',
  fontFamily: "'Inter', system-ui, sans-serif",
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#111111',
  border: '1px solid #1F1F1F',
  borderRadius: '0.5rem',
  padding: '0.625rem 0.75rem',
  fontSize: '0.875rem',
  color: '#FFFFFF',
  fontFamily: "'Inter', system-ui, sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
};

const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column' };

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
      {Array.from({ length: total }, (_, i) => {
        const num = i + 1;
        const done = num <= current;
        return (
          <div
            key={num}
            style={{
              width: '1.5rem', height: '1.5rem',
              borderRadius: '9999px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem',
              backgroundColor: done ? '#FFFFFF' : '#1F1F1F',
              color: done ? '#000000' : '#888888',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: done ? 500 : 400,
              transition: 'background-color 0.2s ease',
            }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

// ─── Heading ─────────────────────────────────────────────────────────────────

function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: sub ? '2rem' : '2rem' }}>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '1.875rem', fontWeight: 300,
        color: '#FFFFFF', margin: '0 0 0.5rem 0',
      }}>
        {title}
      </h1>
      {sub && (
        <p style={{ fontSize: '0.875rem', color: '#888888', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Continue / CTA button ────────────────────────────────────────────────────

function ContinueButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        fontFamily: "'Inter', system-ui, sans-serif",
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        marginTop: '2rem',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

// ─── Step 1: Campaign Type ─────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: StepData;
  onChange: (k: keyof StepData, v: string) => void;
  onNext: () => void;
}) {
  const options: { key: CampaignType; title: string; desc: string }[] = [
    {
      key: 'full',
      title: 'Full Campaign',
      desc: 'Discovery, outreach, content approval and tracking',
    },
    {
      key: 'discovery',
      title: 'Creator Discovery Only',
      desc: 'Find and connect with the right creators',
    },
  ];

  return (
    <>
      <Heading
        title="What type of campaign?"
        sub="Choose how you want to work with creators"
      />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0' }}>
        {options.map(({ key, title, desc }) => {
          const selected = data.campaignType === key;
          return (
            <div
              key={key!}
              onClick={() => onChange('campaignType', key!)}
              style={{
                flex: 1,
                border: `1px solid ${selected ? '#FFFFFF' : '#1F1F1F'}`,
                borderRadius: '0.75rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <p style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 500, margin: '0 0 0.375rem 0', fontFamily: "'Inter', system-ui, sans-serif" }}>
                {title}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#888888', margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
                {desc}
              </p>
            </div>
          );
        })}
      </div>

      <ContinueButton label="Continue" onClick={onNext} disabled={!data.campaignType} />
    </>
  );
}

// ─── Step 2: Requirements ──────────────────────────────────────────────────────

function SelectField({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, appearance: 'none' }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function Step2({ data, onChange, onNext }: { data: StepData; onChange: (k: keyof StepData, v: string) => void; onNext: () => void }) {
  return (
    <>
      <Heading title="Campaign Requirements" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SelectField label="Niche" value={data.niche} onChange={(v) => onChange('niche', v)}
          options={['Skincare', 'Fitness', 'Food', 'Fashion', 'Tech', 'Travel', 'Home', 'Finance']} />
        <SelectField label="Region" value={data.region} onChange={(v) => onChange('region', v)}
          options={['Pan India', 'North India', 'South India', 'Metro Cities', 'Tier 2 Cities']} />
        <SelectField label="Follower Range" value={data.followerRange} onChange={(v) => onChange('followerRange', v)}
          options={['1K–10K', '10K–50K', '50K–100K', '100K+']} />
        <TextField label="Number of Creators" value={data.numCreators} onChange={(v) => onChange('numCreators', v)} placeholder="10" type="number" />
        <div style={fieldWrap}>
          <label style={labelStyle}>Product Brief</label>
          <textarea
            value={data.productBrief}
            onChange={(e) => onChange('productBrief', e.target.value)}
            rows={4}
            placeholder="Describe your product and campaign goals..."
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <SelectField label="Target Age Range" value={data.ageRange} onChange={(v) => onChange('ageRange', v)}
          options={['18–24', '25–34', '35–44', '44+']} />
        <SelectField label="Gender" value={data.gender} onChange={(v) => onChange('gender', v)}
          options={['All', 'Primarily Female', 'Primarily Male']} />
        <TextField label="Target Cities" value={data.targetCities} onChange={(v) => onChange('targetCities', v)} placeholder="Mumbai, Delhi, Bangalore" />
        <SelectField label="Language" value={data.language} onChange={(v) => onChange('language', v)}
          options={['Hindi', 'English', 'Hindi + English', 'Regional']} />
      </div>
      <ContinueButton label="Continue" onClick={onNext} />
    </>
  );
}

// ─── Step 3: Budget ────────────────────────────────────────────────────────────

function RupeeInput({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
          fontSize: '0.875rem', color: '#888888',
          fontFamily: "'Inter', system-ui, sans-serif",
          pointerEvents: 'none',
        }}>₹</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: '1.75rem' }}
        />
      </div>
    </div>
  );
}

function Step3({ data, onChange, onNext }: { data: StepData; onChange: (k: keyof StepData, v: string) => void; onNext: () => void }) {
  const numCreators = parseInt(data.numCreators) || 0;
  const baseFee = parseInt(data.baseFee) || 0;
  const minRec = numCreators * baseFee;

  return (
    <>
      <Heading title="Set Your Budget" sub="You only pay when creators generate views" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RupeeInput label="Base Fee per Creator" value={data.baseFee} onChange={(v) => onChange('baseFee', v)} placeholder="2000" />
        <RupeeInput label="Per-view Bonus (per 1000 views)" value={data.perViewBonus} onChange={(v) => onChange('perViewBonus', v)} placeholder="10" />
        <div>
          <RupeeInput label="Total Budget Cap" value={data.budgetCap} onChange={(v) => onChange('budgetCap', v)} placeholder="50000" />
          {minRec > 0 && (
            <p style={{ fontSize: '0.75rem', color: '#888888', margin: '0.5rem 0 0 0', fontFamily: "'Inter', system-ui, sans-serif" }}>
              Minimum recommended: ₹{minRec.toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>
      <ContinueButton label="Continue" onClick={onNext} />
    </>
  );
}

// ─── Step 4: Review ────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      borderBottom: '1px solid #1F1F1F', paddingBottom: '0.75rem',
    }}>
      <span style={{ fontSize: '0.875rem', color: '#888888', fontFamily: "'Inter', system-ui, sans-serif" }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>{value || '—'}</span>
    </div>
  );
}

function Step4({ data, onBack, onLaunch }: { data: StepData; onBack: () => void; onLaunch: () => void }) {
  const typeLabel = data.campaignType === 'full' ? 'Full Campaign' : 'Creator Discovery Only';

  return (
    <>
      <Heading title="Review Campaign" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <ReviewRow label="Campaign Type" value={typeLabel} />
        <ReviewRow label="Niche" value={data.niche} />
        <ReviewRow label="Region" value={data.region} />
        <ReviewRow label="Follower Range" value={data.followerRange} />
        <ReviewRow label="Number of Creators" value={data.numCreators} />
        <ReviewRow label="Target Age Range" value={data.ageRange} />
        <ReviewRow label="Gender" value={data.gender} />
        <ReviewRow label="Target Cities" value={data.targetCities || 'All'} />
        <ReviewRow label="Language" value={data.language} />
        <ReviewRow label="Base Fee per Creator" value={data.baseFee ? `₹${data.baseFee}` : ''} />
        <ReviewRow label="Per-view Bonus" value={data.perViewBonus ? `₹${data.perViewBonus} per 1K views` : ''} />
        <ReviewRow label="Total Budget Cap" value={data.budgetCap ? `₹${parseInt(data.budgetCap).toLocaleString('en-IN')}` : ''} />
        {data.productBrief && (
          <ReviewRow label="Product Brief" value={data.productBrief.length > 60 ? data.productBrief.slice(0, 60) + '…' : data.productBrief} />
        )}
      </div>

      <button
        onClick={onLaunch}
        style={{
          width: '100%', backgroundColor: '#FFFFFF', color: '#000000',
          padding: '0.75rem', borderRadius: '0.5rem',
          fontSize: '0.875rem', fontWeight: 500,
          fontFamily: "'Inter', system-ui, sans-serif",
          border: 'none', cursor: 'pointer', marginTop: '1.5rem',
        }}
      >
        Launch Campaign
      </button>

      <button
        onClick={onBack}
        style={{
          width: '100%', backgroundColor: 'transparent',
          border: '1px solid #1F1F1F', color: '#888888',
          padding: '0.75rem', borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontFamily: "'Inter', system-ui, sans-serif",
          cursor: 'pointer', marginTop: '0.75rem',
        }}
      >
        Back
      </button>
    </>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function NewCampaign({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(INITIAL_DATA);
  const TOTAL = 4;

  function update(key: keyof StepData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function next() { setStep((s) => Math.min(s + 1, TOTAL)); }
  function prev() {
    if (step === 1) onBack();
    else setStep((s) => s - 1);
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '4rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      paddingBottom: '4rem',
      position: 'relative',
    }}>
      {/* Back arrow */}
      <button
        onClick={prev}
        style={{
          position: 'fixed',
          top: '4.5rem',
          left: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#888888',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
        }}
      >
        <ArrowLeft size={18} color="#888888" />
      </button>

      <div style={{ maxWidth: '680px', width: '100%' }}>
        <StepIndicator current={step} total={TOTAL} />

        {step === 1 && <Step1 data={data} onChange={update} onNext={next} />}
        {step === 2 && <Step2 data={data} onChange={update} onNext={next} />}
        {step === 3 && <Step3 data={data} onChange={update} onNext={next} />}
        {step === 4 && <Step4 data={data} onBack={prev} onLaunch={onBack} />}
      </div>
    </div>
  );
}
