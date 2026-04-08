'use client'

import { CheckCircle } from 'lucide-react'

export default function CreatorWelcomePage() {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4">
      <div className="max-w-[480px] w-full flex flex-col items-center text-center">

        <CheckCircle size={48} color="#4ADE80" className="mb-6" />

        <h1
          className="text-4xl font-light text-white mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          You're in.
        </h1>
        <p className="text-sm text-[#888888] mb-8">
          Your profile is under review. We'll reach out when a brand wants to work with you.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4 text-left">
            <p className="text-xs text-[#888888] uppercase tracking-wider mb-2">What happens next</p>
            <p className="text-sm text-white">We review your profile and match you with relevant brands.</p>
          </div>
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-xl p-4 text-left">
            <p className="text-xs text-[#888888] uppercase tracking-wider mb-2">Getting paid</p>
            <p className="text-sm text-white">Base fee guaranteed. Paid directly to your UPI after content goes live.</p>
          </div>
        </div>

        <a
          href="https://creatrugc.com"
          className="border border-[#1F1F1F] text-[#888888] text-sm px-6 py-2 rounded-xl mt-2 hover:border-[#333] transition-colors"
        >
          Back to creatrugc.com
        </a>
      </div>
    </div>
  )
}
