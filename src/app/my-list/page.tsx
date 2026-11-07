'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import { GameCard } from '@/components/games/GameCard';
import { Bookmark, Compass, Trash2 } from 'lucide-react';

export default function MyListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem('hxd_my_list') || '[]';
      const ids: string[] = JSON.parse(raw);
      setSavedIds(ids);
    } catch {
      setSavedIds([]);
    }
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener('hxd_my_list_updated', loadSaved);
    return () => window.removeEventListener('hxd_my_list_updated', loadSaved);
  }, []);

  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        if (data.games) {
          setGames(data.games);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const savedGames = games.filter((g) => savedIds.includes(g.id));

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your saved games list?')) {
      localStorage.removeItem('hxd_my_list');
      setSavedIds([]);
      window.dispatchEvent(new Event('hxd_my_list_updated'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1f1f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c084fc] mb-1">
            <Bookmark size={14} />
            Personal Collection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Game List
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Games you've saved for future playthroughs and compatibility evaluations.
          </p>
        </div>

        {savedGames.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-rose-400 hover:bg-rose-950/20 border border-[#242424] transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-[#141414] animate-pulse border border-[#222]" />
          ))}
        </div>
      ) : savedGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {savedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#121212] border border-[#222] p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] text-neutral-400 flex items-center justify-center mx-auto">
            <Bookmark size={22} />
          </div>
          <h3 className="text-lg font-bold text-white">Your list is currently empty</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Click the bookmark icon on any game card to bookmark games you want to check out or evaluate later.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold transition-colors"
          >
            <Compass size={15} />
            Explore Discover Library
          </Link>
        </div>
      )}
    </div>
  );
}
