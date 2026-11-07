'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Game } from '@/types';
import { GameCard } from '@/components/games/GameCard';
import { Search, Shuffle, Filter, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All',
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Fighting',
  'Shooter',
  'Indie',
  'Casual',
];

const PLATFORMS = ['All', 'PC', 'PlayStation', 'Xbox', 'Mobile'];

const COLLECTIONS = [
  { id: 'All', label: 'All Collections' },
  { id: 'best-indie', label: 'Best Indie' },
  { id: 'story-driven', label: 'Story-Driven' },
  { id: 'low-spec', label: 'Low-Spec PC' },
  { id: 'free-to-play', label: 'Free-to-Play' },
  { id: 'multiplayer', label: 'Multiplayer' },
  { id: 'hidden-gems', label: 'Hidden Gems' },
];

export function DiscoverView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'All');
  const [collection, setCollection] = useState(searchParams.get('collection') || 'All');
  const [africanOnly, setAfricanOnly] = useState(searchParams.get('african') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Load games from API
  useEffect(() => {
    setLoading(true);
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

  // Sync state to URL params for shareability
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (platform !== 'All') params.set('platform', platform);
    if (collection !== 'All') params.set('collection', collection);
    if (africanOnly) params.set('african', 'true');
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const queryStr = params.toString();
    const newPath = queryStr ? `/discover?${queryStr}` : '/discover';
    router.replace(newPath, { scroll: false });
  }, [search, category, platform, collection, africanOnly, sortBy, router]);

  // Client-side filtering and sorting for instant reactivity
  const filteredGames = useMemo(() => {
    let result = [...games];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.developer.toLowerCase().includes(q) ||
          g.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (category !== 'All') {
      result = result.filter((g) => g.categories?.includes(category));
    }

    if (platform !== 'All') {
      result = result.filter((g) => g.platforms?.includes(platform as any));
    }

    if (collection !== 'All') {
      result = result.filter((g) => g.editorialCollections?.includes(collection as any));
    }

    if (africanOnly) {
      result = result.filter((g) => g.isRwandanOrAfrican);
    }

    // Sort
    if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      result.sort(
        (a, b) => new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime()
      );
    }

    return result;
  }, [games, search, category, platform, collection, africanOnly, sortBy]);

  // Surprise Me: random pick from matching games
  const handleSurpriseMe = () => {
    const pool = filteredGames.length > 0 ? filteredGames : games;
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    router.push(`/games/${chosen.slug || chosen.id}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPlatform('All');
    setCollection('All');
    setAfricanOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    platform !== 'All' ||
    collection !== 'All' ||
    africanOnly ||
    sortBy !== 'newest';

  return (
    <div className="space-y-6">
      {/* Header with Title and Surprise Me */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f1f]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Discover Games
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore verified games, filter by hardware and support independent studios
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-[#1a1a1a] border border-[#262626] transition-colors"
            >
              <X size={14} />
              Reset Filters
            </button>
          )}

          <button
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2a173d] text-[#d8b4fe] border border-[#a855f7]/40 hover:bg-[#a855f7] hover:text-white transition-all shadow-sm"
          >
            <Shuffle size={14} />
            Surprise Me
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-3 bg-[#121212] p-4 rounded-2xl border border-[#222]">
        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 size-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, developer, or keyword..."
              className="w-full bg-[#171717] border border-[#262626] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-[#a855f7] outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#171717] border border-[#262626] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-[#a855f7] outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
            </select>

            <button
              onClick={() => setAfricanOnly(!africanOnly)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0',
                africanOnly
                  ? 'bg-[#a855f7] text-white border-[#c084fc]'
                  : 'bg-[#171717] text-neutral-300 border-[#262626] hover:border-neutral-500'
              )}
            >
              <Sparkles size={13} className={cn(africanOnly ? 'text-white' : 'text-[#a855f7]')} />
              African Games
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-neutral-500 font-medium text-[11px] uppercase mr-1 shrink-0">Genre:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors',
                category === cat
                  ? 'bg-[#a855f7] text-white shadow-sm'
                  : 'bg-[#191919] text-neutral-400 hover:text-white hover:bg-[#222]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Collections & Platform Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1c1c1c] text-xs">
          <span className="text-neutral-500 font-medium text-[11px] uppercase mr-1">Platform:</span>
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatform(plat)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                platform === plat
                  ? 'bg-[#292929] text-white border border-[#3b3b3b]'
                  : 'text-neutral-400 hover:text-white'
              )}
            >
              {plat}
            </button>
          ))}

          <span className="text-neutral-600 mx-2">|</span>

          <span className="text-neutral-500 font-medium text-[11px] uppercase mr-1">Collection:</span>
          {COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => setCollection(col.id)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                collection === col.id
                  ? 'bg-[#292929] text-white border border-[#3b3b3b]'
                  : 'text-neutral-400 hover:text-white'
              )}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredGames.length}</strong> games
        </span>
      </div>

      {/* Games Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-[#141414] animate-pulse border border-[#222]" />
          ))}
        </div>
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#121212] border border-[#222] p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] text-neutral-400 flex items-center justify-center mx-auto">
            <Filter size={22} />
          </div>
          <h3 className="text-lg font-bold text-white">No games found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            We couldn't find any games matching your current search or filter combination.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

