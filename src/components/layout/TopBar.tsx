'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles, Shield, Heart, Bell } from 'lucide-react';

export function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090909]/85 backdrop-blur-md border-b border-[#1f1f1f] px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-neutral-400 size-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games, creators, genres, hardware tags..."
            className="w-full bg-[#141414] border border-[#262626] focus:border-[#a855f7] rounded-xl pl-10 pr-12 py-2 text-sm text-neutral-200 placeholder-neutral-500 outline-none transition-colors"
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#202020] text-neutral-400 border border-[#2e2e2e]">
              Enter
            </kbd>
          </div>
        </div>
      </form>

      {/* Top Utility Actions */}
      <div className="flex items-center gap-3">
        {/* African & Rwandan Games Spotlight Pill */}
        <Link
          href="/discover?african=true"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#1a1424] text-[#c084fc] border border-[#a855f7]/30 hover:bg-[#a855f7]/20 transition-colors"
        >
          <Sparkles size={13} className="text-[#a855f7]" />
          <span>African Creators</span>
        </Link>

        {/* My List Shortcut */}
        <Link
          href="/my-list"
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors relative"
          title="Saved Games"
          aria-label="Saved Games"
        >
          <Heart size={18} />
        </Link>

        {/* Submit a game CTA */}
        <Link
          href="/submit"
          className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[#a855f7] text-white hover:bg-[#9333ea] transition-all duration-200 shadow-sm shadow-[#a855f7]/20"
        >
          Submit Game
        </Link>

        {/* Admin Access Indicator */}
        <Link
          href="/admin"
          className="p-2 rounded-xl text-neutral-400 hover:text-[#a855f7] hover:bg-[#1a1a1a] transition-colors"
          title="Admin Dashboard"
          aria-label="Admin Dashboard"
        >
          <Shield size={18} />
        </Link>
      </div>
    </header>
  );
}
