import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDeveloperBySlug, getGames } from '@/lib/data';
import { GameCard } from '@/components/games/GameCard';
import { MapPin, ExternalLink, ShieldCheck, Sparkles, ArrowLeft, Gamepad2 } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dev = await getDeveloperBySlug(slug);

  if (!dev) {
    return { title: 'Developer Not Found — HXD Gaming 2.0' };
  }

  return {
    title: `${dev.name} — Studio Profile & Games`,
    description: dev.bio.slice(0, 160),
  };
}

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const developer = await getDeveloperBySlug(slug);

  if (!developer) {
    notFound();
  }

  const allGames = await getGames();
  const developerGames = allGames.filter((g) => {
    const matchSlug = g.developerSlug === developer.slug;
    const matchName = g.developer.toLowerCase().includes(developer.name.toLowerCase());
    return matchSlug || matchName;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/developers"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Developer Directory
        </Link>
      </div>

      {/* Studio Header Card */}
      <div className="rounded-3xl bg-[#141414] border border-[#242424] overflow-hidden">
        {/* Banner */}
        <div className="h-44 sm:h-56 w-full bg-[#1b1b1b] relative overflow-hidden">
          {developer.bannerUrl ? (
            <img src={developer.bannerUrl} alt={developer.name} className="w-full h-full object-cover filter brightness-75" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#2a173d] via-[#141414] to-[#121212]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-10 pb-8 relative -mt-16 flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#191919] border-4 border-[#141414] overflow-hidden shrink-0 shadow-xl">
            <img src={developer.logoUrl || '/images/icons/gamepad.svg'} alt={developer.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {developer.name}
              </h1>

              {developer.verified && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> Verified Studio
                </span>
              )}

              {developer.isRwandan && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#d8b4fe] bg-[#2e1065] border border-[#a855f7]/40 px-2.5 py-0.5 rounded-full">
                  <Sparkles size={12} className="text-[#c084fc]" /> Rwanda
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <MapPin size={13} className="text-neutral-500" />
              <span>{developer.location}</span>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
              {developer.bio}
            </p>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {developer.website && (
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
                >
                  <ExternalLink size={13} /> Official Website
                </a>
              )}
              {developer.socialLinks?.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1f1f1f] hover:bg-[#282828] text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Published Games by this Studio */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gamepad2 size={19} className="text-[#a855f7]" />
            Published Games ({developerGames.length})
          </h2>
        </div>

        {developerGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {developerGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#141414] border border-[#242424] text-center text-xs text-neutral-400">
            No public games currently listed for this developer.
          </div>
        )}
      </section>
    </div>
  );
}
