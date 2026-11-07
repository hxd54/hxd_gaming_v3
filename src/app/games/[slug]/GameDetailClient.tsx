'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import { GameCard } from '@/components/games/GameCard';
import { checkGameCompatibility, CompatibilityResult, UserHardware } from '@/lib/specs-matcher';
import {
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  Star,
  Sparkles,
  Cpu,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flag,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameDetailClientProps {
  game: Game;
  relatedGames: Game[];
}

export function GameDetailClient({ game, relatedGames }: GameDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<string>(game.bannerUrl || game.imageUrl);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userHardware, setUserHardware] = useState<UserHardware | null>(null);
  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Gallery images list: banner, main image, plus any screenshots
  const galleryImages = [
    game.bannerUrl || game.imageUrl,
    game.imageUrl,
    ...(game.screenshots || []),
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hxd_my_list');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsSaved(list.includes(game.id));
      }

      const specs = localStorage.getItem('hxd_user_specs');
      if (specs) {
        const parsed = JSON.parse(specs);
        setUserHardware(parsed);
        const res = checkGameCompatibility(parsed, game.systemRequirements);
        setCompatResult(res);
      } else {
        const defaultHardware: UserHardware = { ramGb: 16, storageGb: 500, os: 'Windows 10' };
        setUserHardware(defaultHardware);
        const res = checkGameCompatibility(defaultHardware, game.systemRequirements);
        setCompatResult(res);
      }
    } catch {
      // ignore
    }
  }, [game]);

  const toggleSave = () => {
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

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSubmitted(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/discover" className="hover:text-white transition-colors">Games</Link>
          <span>/</span>
          <span className="text-neutral-200 font-medium truncate max-w-[200px]">{game.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#242424] hover:border-neutral-500 text-xs font-medium text-neutral-300 transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => setReportOpen(true)}
            className="p-1.5 rounded-lg bg-[#141414] border border-[#242424] hover:border-neutral-500 text-neutral-400 hover:text-white transition-colors"
            title="Report incorrect information"
          >
            <Flag size={14} />
          </button>
        </div>
      </div>

      {/* Main Artwork Preview Section (Image 2 style) */}
      <section className="space-y-3">
        {/* Cinematic Main Preview */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden border border-[#242424] bg-[#121212] shadow-2xl">
          <img
            src={selectedImage}
            alt={game.title}
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-black/30" />

          {game.isRwandanOrAfrican && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b0764]/90 text-[#e9d5ff] border border-[#a855f7]/40 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={13} className="text-[#c084fc]" />
              African Game Creator
            </div>
          )}
        </div>

        {/* Thumbnail Selector Gallery */}
        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  'relative w-28 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200',
                  selectedImage === img
                    ? 'border-[#a855f7] scale-105 shadow-md shadow-[#a855f7]/20'
                    : 'border-[#262626] opacity-60 hover:opacity-100 hover:border-neutral-500'
                )}
              >
                <img src={img} alt={`${game.title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Grid: Details + CTA Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Title, Description, Specs Highlights */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href={`/developers/${game.developerSlug || 'indie'}`}
                className="text-sm font-medium text-[#c084fc] hover:underline"
              >
                {game.developer}
              </Link>
              {game.publisher && (
                <span className="text-xs text-neutral-500">• Published by {game.publisher}</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {game.title}
            </h1>
          </div>

          {/* Quick Info Grid (Matching Image 2 Specs Card) */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#242424] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-neutral-400 block mb-1">Compatible with</span>
              <div className="flex flex-wrap gap-1">
                {game.platforms?.map((p) => (
                  <span key={p} className="text-xs font-semibold text-white bg-[#1f1f1f] px-2 py-0.5 rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 block mb-1">Genres</span>
              <div className="text-xs font-semibold text-white truncate">
                {game.categories?.join(', ')}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 block mb-1">Release Date</span>
              <div className="text-xs font-semibold text-white">
                {game.releaseDate || 'TBA'}
              </div>
            </div>

            <div>
              <span className="text-xs text-neutral-400 block mb-1">Rating</span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Star size={13} className="fill-amber-400" />
                {game.rating ? `${game.rating} / 10` : 'Not Rated'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">About the Game</h2>
            <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line space-y-3">
              {game.description}
            </div>
          </div>

          {/* Gameplay & Features */}
          {game.gameplayModes && game.gameplayModes.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Gameplay Modes
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.gameplayModes.map((mode) => (
                  <span
                    key={mode}
                    className="text-xs font-medium px-3 py-1 rounded-xl bg-[#1a1a1a] text-neutral-200 border border-[#292929]"
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* System Requirements Section (Matching Image 2 Specs Card) */}
          <section className="space-y-4 pt-4 border-t border-[#1f1f1f]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu size={19} className="text-[#a855f7]" />
                System Requirements
              </h2>

              <Link
                href="/compatibility"
                className="text-xs text-[#c084fc] hover:underline font-medium"
              >
                Hardware Checker →
              </Link>
            </div>

            {/* Live User Compatibility Badge (Image 2 style) */}
            {compatResult && (
              <div
                className={cn(
                  'p-3.5 rounded-xl border flex items-center gap-3',
                  compatResult.color === 'green' && 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
                  compatResult.color === 'amber' && 'bg-amber-950/40 border-amber-500/40 text-amber-300',
                  compatResult.color === 'red' && 'bg-rose-950/40 border-rose-500/40 text-rose-300',
                  compatResult.color === 'neutral' && 'bg-[#141414] border-[#242424] text-neutral-300'
                )}
              >
                {compatResult.color === 'green' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                {compatResult.color === 'amber' && <AlertTriangle size={18} className="text-amber-400 shrink-0" />}
                {compatResult.color === 'red' && <AlertTriangle size={18} className="text-rose-400 shrink-0" />}
                {compatResult.color === 'neutral' && <Info size={18} className="text-neutral-400 shrink-0" />}

                <span className="text-xs font-semibold">{compatResult.label}</span>
              </div>
            )}

            {/* Minimum vs Recommended Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Minimum Specs */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-2 text-xs">
                <h3 className="font-bold text-sm text-neutral-200 border-b border-[#242424] pb-2">
                  Minimum Requirements
                </h3>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">OS:</strong>{' '}
                  {game.systemRequirements?.minimum?.os || 'Windows 10 64-bit'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Processor:</strong>{' '}
                  {game.systemRequirements?.minimum?.processor || 'Intel Core i5 / AMD FX'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Memory:</strong>{' '}
                  {game.systemRequirements?.minimum?.memory || '8 GB RAM'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Graphics:</strong>{' '}
                  {game.systemRequirements?.minimum?.graphics || 'GeForce GTX 960 / Radeon R9 280'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Storage:</strong>{' '}
                  {game.systemRequirements?.minimum?.storage || '50 GB space'}
                </div>
              </div>

              {/* Recommended Specs */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-2 text-xs">
                <h3 className="font-bold text-sm text-neutral-200 border-b border-[#242424] pb-2">
                  Recommended Requirements
                </h3>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">OS:</strong>{' '}
                  {game.systemRequirements?.recommended?.os || 'Windows 11 64-bit'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Processor:</strong>{' '}
                  {game.systemRequirements?.recommended?.processor || 'Intel Core i7 / AMD Ryzen 5'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Memory:</strong>{' '}
                  {game.systemRequirements?.recommended?.memory || '16 GB RAM'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Graphics:</strong>{' '}
                  {game.systemRequirements?.recommended?.graphics || 'GeForce RTX 3070 / Radeon RX 6700'}
                </div>
                <div className="text-neutral-400">
                  <strong className="text-neutral-300">Storage:</strong>{' '}
                  {game.systemRequirements?.recommended?.storage || '50 GB SSD space'}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Actions Box (NOT a store!) */}
        <div className="space-y-6">
          <div className="sticky top-24 p-6 rounded-3xl bg-[#141414] border border-[#262626] space-y-5 shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
                Official Access
              </span>
              <h3 className="text-lg font-bold text-white">Get & Support This Game</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Direct official distribution links provided by verified developers and stores.
              </p>
            </div>

            {/* Official Website */}
            {game.officialWebsite && (
              <a
                href={game.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
              >
                <ExternalLink size={15} />
                Visit Official Website
              </a>
            )}

            {/* Authorized Distribution Links (Steam, Epic, itch.io) */}
            <div className="space-y-2">
              {game.authorizedLinks && game.authorizedLinks.length > 0 ? (
                game.authorizedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-white text-xs font-medium border border-[#303030] transition-colors"
                  >
                    <span>{link.label || `View on ${link.platform}`}</span>
                    <ExternalLink size={14} className="text-neutral-400" />
                  </a>
                ))
              ) : (
                <a
                  href={`https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-white text-xs font-medium border border-[#303030] transition-colors"
                >
                  <span>Search on Steam Store</span>
                  <ExternalLink size={14} className="text-neutral-400" />
                </a>
              )}
            </div>

            {/* Save to My List CTA */}
            <button
              onClick={toggleSave}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 border',
                isSaved
                  ? 'bg-[#a855f7] border-[#c084fc] text-white shadow-lg shadow-[#a855f7]/25'
                  : 'bg-[#1b1526] border-[#a855f7]/40 text-[#d8b4fe] hover:bg-[#a855f7] hover:text-white'
              )}
            >
              <Bookmark size={16} className={cn(isSaved && 'fill-white')} />
              {isSaved ? 'In My Saved List' : 'Save to My List'}
            </button>

            {/* Creator Verification Seal */}
            <div className="pt-4 border-t border-[#222] flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Verified Developer & Platform Attribution</span>
            </div>
          </div>
        </div>
      </div>

      {/* People Also Liked / Related Games Section (Image 2 style) */}
      {relatedGames.length > 0 && (
        <section className="pt-8 border-t border-[#1f1f1f]">
          <h2 className="text-xl font-bold text-white mb-5">People Also Liked</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedGames.map((rel) => (
              <GameCard key={rel.id} game={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#2b2b2b] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-white">Report Listing Information</h3>
            <p className="text-xs text-neutral-400">
              Help keep HXD Gaming trustworthy. Submit corrections for system requirements, release date, or official links.
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                ✓ Report received. Our verification team will review this listing.
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the incorrect detail or provide the verified official source..."
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:border-[#a855f7] outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
