import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Cpu, Users, Heart, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'About HXD Gaming 2.0 — Vision, Principles & Creator Support',
  description: 'Learn about HXD Gaming, our ad-free commitment, transparent hardware compatibility, and support for Rwandan and African game developers.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c084fc]">
          <Sparkles size={14} />
          Product Vision & Manifesto
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          HXD GAMING 2.0
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
          "Discover games. Find your next experience. Support independent creators."
        </p>
      </div>

      {/* Core Principles */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Our 6 Core Principles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-lg bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center text-xs font-mono">1</span>
              Discovery Should Be Effortless
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Explore games by genre, platform, hardware tier, or curated editorial collections with zero friction and intuitive multi-filters.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-lg bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center text-xs font-mono">2</span>
              Game Information Must Be Trustworthy
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No fabricated reviews, artificial ratings, or synthetic benchmarks. Published requirements and official links reflect genuine developer data.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-lg bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center text-xs font-mono">3</span>
              Hardware Compatibility Before Downloading
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Transparent PC hardware matching so you understand whether your machine can run a game before spending time or money.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-lg bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center text-xs font-mono">4</span>
              Meaningful Visibility for African Creators
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dedicated spotlights for Rwandan and African studios, connecting regional talent with global players and publishing ecosystems.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-lg bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center text-xs font-mono">5</span>
              Completely Ad-Free Experience
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No pop-ups, intrusive banners, third-party tracking scripts, or spam. HXD Gaming is built purely for players and creators.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="w-6 h-6 rounded-lg bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center text-xs font-mono">6</span>
              Accessible, Responsive, & Secure
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fast, dark-mode native, responsive across desktop, tablet, and mobile, with robust cryptographic security for administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Not a Store Statement */}
      <section className="p-6 rounded-3xl bg-[#141414] border border-[#262626] space-y-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Shield size={17} className="text-[#a855f7]" />
          Platform Positioning: Not a Conventional Store
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          HXD Gaming is a discovery, library, and creator connection platform. We do not operate shopping carts, payment gateways, or fictional subscriptions. Game access is routed directly to legitimate official websites and verified distribution platforms (Steam, Epic Games, itch.io, GOG). Game downloads are provided only when explicitly authorized by the developer.
        </p>
      </section>

      {/* Creator Actions */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#241538] to-[#141414] border border-[#a855f7]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Get in Touch with HXD Gaming</h3>
          <p className="text-xs text-neutral-300 mt-1">
            Developed by Haxdev / HXD in Kigali, Rwanda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/submit"
            className="px-5 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold transition-colors"
          >
            Submit Game
          </Link>
          <a
            href="https://github.com/hxd54"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors"
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}

