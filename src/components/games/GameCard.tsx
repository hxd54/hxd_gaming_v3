'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Star, Sparkles, Monitor, Gamepad2 } from 'lucide-react';
import { Game } from '@/types';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  variant?: 'portrait' | 'landscape';
}

export function GameCard({ game, variant = 'portrait' }: GameCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hxd_my_list');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsSaved(list.includes(game.id));
      }
    } catch (e) {
      // ignore
    }
  }, [game.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = localStorage.getItem('hxd_my_list') || '[]';
      let list: string[] = JSON.parse(raw);
      if (list.includes(game.id)) {
        list = list.filter((id) => id !== game.id);
        setIsSaved(false);
      } else {
        list.push(game.id);
        setIsSaved(true);
      }
      localStorage.setItem('hxd_my_list', JSON.stringify(list));
      window.dispatchEvent(new Event('hxd_my_list_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Link
      href={`/games/${game.slug || game.id}`}
      className="group block relative bg-[#141414] rounded-2xl overflow-hidden border border-[#242424] hover:border-[#a855f7]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#a855f7]/10"
    >
      {/* Artwork Container */}
      <div
        className={cn(
          'relative w-full overflow-hidden bg-[#1a1a1a]',
          variant === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/9]'
        )}
      >
        <img
          src={game.imageUrl || '/images/gaming.jpg'}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {game.isRwandanOrAfrican ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wide bg-[#2e1065]/90 text-[#d8b4fe] border border-[#a855f7]/40 px-2 py-0.5 rounded-full backdrop-blur-md">
              <Sparkles size={11} className="text-[#c084fc]" /> Africa
            </span>
          ) : game.rating ? (
            <span className="flex items-center gap-1 text-[11px] font-bold bg-black/70 text-amber-400 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
              <Star size={11} className="fill-amber-400" /> {game.rating}/10
            </span>
          ) : (
            <span />
          )}

          {/* Quick Save Bookmark Button */}
          <button
            onClick={toggleSave}
            title={isSaved ? 'Remove from My List' : 'Save to My List'}
            className={cn(
              'pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all duration-200 border',
              isSaved
                ? 'bg-[#a855f7] text-white border-[#c084fc]'
                : 'bg-black/60 text-neutral-300 border-white/10 hover:text-white hover:bg-[#a855f7]/50'
            )}
          >
            <Bookmark size={14} className={cn(isSaved && 'fill-white')} />
          </button>
        </div>

        {/* Platforms Badges at Bottom of Image */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1">
          {game.platforms?.map((p) => (
            <span
              key={p}
              className="text-[10px] font-medium bg-black/75 text-neutral-300 px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-sm"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3.5 space-y-1.5">
        <h3 className="font-semibold text-sm text-neutral-100 group-hover:text-[#c084fc] transition-colors truncate">
          {game.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="truncate max-w-[150px]">{game.developer}</span>
          <span className="text-[11px] text-neutral-500">
            {game.releaseDate ? game.releaseDate.split('-')[0] : 'TBA'}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1 pt-1">
          {game.categories?.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-medium bg-[#1f1f1f] text-neutral-400 px-1.5 py-0.5 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
