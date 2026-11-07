'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import { Compass, Bookmark, Star, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedHeroProps {
  games: Game[];
}

export function FeaturedHero({ games }: FeaturedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const featuredList = games.filter((g) => g.featured).slice(0, 5);
  const currentGame = featuredList[currentIndex] || games[0];

  useEffect(() => {
    if (!currentGame) return;
    try {
      const saved = localStorage.getItem('hxd_my_list');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsSaved(list.includes(currentGame.id));
      } else {
        setIsSaved(false);
      }
    } catch {
      // ignore
    }
  }, [currentGame]);

  // Auto rotate hero every 8 seconds
  useEffect(() => {
    if (featuredList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredList.length]);

  if (!currentGame) return null;

  const toggleSave = () => {
    try {
      const raw = localStorage.getItem('hxd_my_list') || '[]';
      let list: string[] = JSON.parse(raw);
      if (list.includes(currentGame.id)) {
        list = list.filter((id) => id !== currentGame.id);
        setIsSaved(false);
      } else {
        list.push(currentGame.id);
        setIsSaved(true);
      }
      localStorage.setItem('hxd_my_list', JSON.stringify(list));
      window.dispatchEvent(new Event('hxd_my_list_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden border border-[#242424] bg-[#121212] mb-10 shadow-2xl">
      {/* Background Cinematic Artwork with Overlays */}
      <div className="relative h-[380px] sm:h-[440px] md:h-[480px] w-full">
        <img
          src={currentGame.bannerUrl || currentGame.imageUrl}
          alt={currentGame.title}
          className="w-full h-full object-cover object-center filter brightness-90 transition-all duration-700"
        />

        {/* Gradient Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/80 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 max-w-2xl">
        {/* Spotlight Badge */}
        <div className="flex items-center gap-2 mb-3">
          {currentGame.isRwandanOrAfrican ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#3b0764]/90 text-[#e9d5ff] border border-[#a855f7]/40 backdrop-blur-md">
              <Sparkles size={12} className="text-[#c084fc]" />
              African Spotlight
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-black/60 text-neutral-300 border border-white/10 backdrop-blur-md">
              Featured Discovery
            </span>
          )}

          {currentGame.rating && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
              <Star size={12} className="fill-amber-400" />
              {currentGame.rating}/10
            </span>
          )}
        </div>

        {/* Game Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
          {currentGame.title}
        </h1>

        {/* Developer & Release Info */}
        <p className="text-sm text-neutral-400 mb-3">
          By <span className="text-neutral-200 font-medium">{currentGame.developer}</span> • {currentGame.releaseDate?.split('-')[0]}
        </p>

        {/* Short Description */}
        <p className="text-sm text-neutral-300 line-clamp-2 md:line-clamp-3 mb-6 max-w-xl leading-relaxed">
          {currentGame.shortDescription || currentGame.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3">
          <Link
            href={`/games/${currentGame.slug || currentGame.id}`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#a855f7]/25 hover:shadow-xl hover:shadow-[#a855f7]/40"
          >
            <Compass size={17} />
            Explore Game
            <ChevronRight size={15} />
          </Link>

          <button
            onClick={toggleSave}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border backdrop-blur-md transition-all duration-200',
              isSaved
                ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#d8b4fe]'
                : 'bg-black/50 border-white/15 text-neutral-200 hover:text-white hover:bg-white/10'
            )}
          >
            <Bookmark size={16} className={cn(isSaved && 'fill-current text-[#a855f7]')} />
            {isSaved ? 'In My List' : 'Save to My List'}
          </button>
        </div>

        {/* Carousel Indicators */}
        {featuredList.length > 1 && (
          <div className="flex items-center gap-1.5 mt-6">
            {featuredList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === currentIndex ? 'w-8 bg-[#a855f7]' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                )}
                aria-label={`Jump to featured slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
