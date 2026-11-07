import React from 'react';
import Link from 'next/link';
import { getGames, getDevelopers } from '@/lib/data';
import { FeaturedHero } from '@/components/games/FeaturedHero';
import { CuratedSection } from '@/components/games/CuratedSection';
import { CategoryShowcase } from '@/components/games/CategoryShowcase';
import { Sparkles, Compass, ShieldCheck, Heart, Users, Cpu, ArrowRight } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  const games = await getGames();
  const developers = await getDevelopers();

  // African & Rwandan Games Spotlight
  const africanGames = games.filter((g) => g.isRwandanOrAfrican);

  // Recently Added Games (latest release date or created)
  const recentlyAdded = [...games]
    .sort((a, b) => new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime())
    .slice(0, 6);

  // Best Indie Games Collection
  const bestIndie = games.filter((g) => g.editorialCollections?.includes('best-indie')).slice(0, 6);

  // Story-Driven Adventures
  const storyDriven = games.filter((g) => g.editorialCollections?.includes('story-driven')).slice(0, 6);

  // Low-Spec Friendly PC Games
  const lowSpec = games.filter((g) => g.editorialCollections?.includes('low-spec')).slice(0, 6);

  // Rwandan & African Developers Spotlight
  const featuredStudios = developers.filter((d) => d.featured).slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Cinematic Featured Hero Showcase */}
      <FeaturedHero games={games} />

      {/* Quick Value Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#20152b] text-[#c084fc] flex items-center justify-center shrink-0">
            <Compass size={18} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Ad-Free Discovery</h4>
            <p className="text-[11px] text-neutral-400">Pure gaming curation</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#162720] text-emerald-400 flex items-center justify-center shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Hardware Match</h4>
            <p className="text-[11px] text-neutral-400">Accurate PC specs checker</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2e1922] text-pink-400 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">African Creators</h4>
            <p className="text-[11px] text-neutral-400">Spotlighting regional talent</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#182333] text-sky-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Verified Links</h4>
            <p className="text-[11px] text-neutral-400">Official developer distribution</p>
          </div>
        </div>
      </div>

      {/* Rwandan & African Games Section (Core Principle #4) */}
      {africanGames.length > 0 && (
        <CuratedSection
          title="African & Rwandan Creators Spotlight"
          subtitle="Discover games created by independent developers across Africa and Rwanda"
          exploreHref="/discover?african=true"
          games={africanGames}
        />
      )}

      {/* Recently Added Section */}
      <CuratedSection
        title="Recently Added"
        subtitle="Fresh additions to the HXD discovery library"
        exploreHref="/discover?sort=newest"
        games={recentlyAdded}
      />

      {/* Browse by Categories Cards */}
      <CategoryShowcase />

      {/* Best Indie Games */}
      {bestIndie.length > 0 && (
        <CuratedSection
          title="Best Indie Games"
          subtitle="Exceptional independent projects with creative heart"
          exploreHref="/discover?collection=best-indie"
          games={bestIndie}
        />
      )}

      {/* Story-Driven Adventures */}
      {storyDriven.length > 0 && (
        <CuratedSection
          title="Story-Driven Adventures"
          subtitle="Narrative-rich journeys, unforgettable characters, and worlds"
          exploreHref="/discover?collection=story-driven"
          games={storyDriven}
        />
      )}

      {/* Low-Spec Friendly PC Games */}
      {lowSpec.length > 0 && (
        <CuratedSection
          title="Low-Spec PC Gems"
          subtitle="Great experiences that run smoothly on integrated graphics and modest hardware"
          exploreHref="/discover?collection=low-spec"
          games={lowSpec}
        />
      )}

      {/* Independent Studio Spotlight Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-[#1c1328] via-[#141414] to-[#121212] border border-[#a855f7]/30 p-6 sm:p-10 mb-12 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#c084fc]">
            <Users size={14} />
            Independent Studio Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Connecting Players with Independent Creators
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed mb-6">
            HXD Gaming provides visibility to independent developers, with a special focus on Rwandan and African game studios. Explore developer profiles, verify social links, and learn about the minds behind the games.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold transition-colors"
            >
              Browse Studio Directory
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors"
            >
              Submit Your Game
            </Link>
          </div>
        </div>

        {/* Featured Studios Preview Badges */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredStudios.map((studio) => (
            <Link
              key={studio.id}
              href={`/developers/${studio.slug}`}
              className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-[#a855f7]/50 transition-colors group block"
            >
              <div className="font-semibold text-sm text-neutral-200 group-hover:text-[#c084fc] transition-colors truncate">
                {studio.name}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5 truncate">{studio.location}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
