import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Game } from '@/types';
import { GameCard } from './GameCard';

interface CuratedSectionProps {
  title: string;
  subtitle?: string;
  exploreHref?: string;
  games: Game[];
  variant?: 'portrait' | 'landscape';
}

export function CuratedSection({
  title,
  subtitle,
  exploreHref,
  games,
  variant = 'portrait',
}: CuratedSectionProps) {
  if (!games || games.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h2>
          {subtitle && <p className="text-xs md:text-sm text-neutral-400 mt-1">{subtitle}</p>}
        </div>

        {exploreHref && (
          <Link
            href={exploreHref}
            className="flex items-center gap-1 text-xs md:text-sm font-medium text-[#c084fc] hover:text-[#e9d5ff] transition-colors group shrink-0"
          >
            <span>Explore All</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Responsive Grid */}
      <div
        className={
          variant === 'portrait'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        }
      >
        {games.map((game) => (
          <GameCard key={game.id} game={game} variant={variant} />
        ))}
      </div>
    </section>
  );
}
