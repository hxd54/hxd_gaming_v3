'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SubmitGamePage() {
  const [formData, setFormData] = useState({
    title: '',
    developer: '',
    developerEmail: '',
    description: '',
    shortDescription: '',
    imageUrl: '',
    categories: ['Indie'],
    platforms: ['PC'],
    releaseDate: '',
    officialWebsite: '',
    storeLink: '',
    os: 'Windows 10 64-bit',
    processor: '',
    memory: '8 GB RAM',
    graphics: '',
    storage: '10 GB available space',
    isAfricanDeveloper: false,
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        developer: formData.developer,
        developerEmail: formData.developerEmail,
        description: formData.description,
        shortDescription: formData.shortDescription,
        imageUrl: formData.imageUrl || '/images/gaming.jpg',
        categories: formData.categories,
        platforms: formData.platforms,
        releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0],
        officialWebsite: formData.officialWebsite,
        authorizedLinks: formData.storeLink
          ? [{ platform: 'Official', url: formData.storeLink, label: 'Official Distribution' }]
          : [],
        systemRequirements: {
          minimum: {
            os: formData.os,
            processor: formData.processor,
            memory: formData.memory,
            graphics: formData.graphics,
            storage: formData.storage,
          },
        },
        isAfricanDeveloper: formData.isAfricanDeveloper,
        location: formData.location,
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit game');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      const updated = exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat];
      return { ...prev, categories: updated.length > 0 ? updated : ['Indie'] };
    });
  };

  const handlePlatformToggle = (plat: string) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(plat);
      const updated = exists ? prev.platforms.filter((p) => p !== plat) : [...prev.platforms, plat];
      return { ...prev, platforms: updated.length > 0 ? updated : ['PC'] };
    });
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-5 bg-[#141414] border border-[#262626] rounded-3xl p-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white">Submission Successfully Received!</h2>
        <p className="text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
          Thank you for sharing your game with HXD Gaming. Your submission has entered our pending review queue and will be evaluated by our team for verified attribution before appearing publicly.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setSuccess(false)}
            className="px-5 py-2.5 rounded-xl bg-[#1f1f1f] hover:bg-[#282828] text-neutral-300 text-xs font-semibold"
          >
            Submit Another Game
          </button>
          <Link
            href="/discover"
            className="px-5 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold"
          >
            Back to Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c084fc] mb-1.5">
          <PlusCircle size={15} />
          Creator Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Submit Your Game for Review
        </h1>
        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
          Independent game developers, studios, and creators can submit their projects for discovery on HXD Gaming. All submissions undergo administrative review to ensure verified links and accurate metadata.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Core Game Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white border-b border-[#222] pb-2">
            1. Core Game Information
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Game Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Kigali Drift or Void Runner"
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Developer / Studio Name *</label>
              <input
                type="text"
                required
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                placeholder="e.g. Kigali Game Studio"
                className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Developer Contact Email *</label>
              <input
                type="email"
                required
                value={formData.developerEmail}
                onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })}
                placeholder="studio@example.com"
                className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Short Description *</label>
            <input
              type="text"
              required
              maxLength={160}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief 1-2 sentence elevator pitch for game cards (max 160 characters)"
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Full Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed game synopsis, gameplay mechanics, lore, and background..."
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Cover Artwork URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/artwork.jpg (Leave blank to use default)"
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none"
            />
          </div>
        </div>

        {/* Categories & Platforms */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-bold text-white border-b border-[#222] pb-2">
            2. Categories & Supported Platforms
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Racing', 'Fighting', 'Shooter', 'Indie', 'Casual'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                    formData.categories.includes(cat)
                      ? 'bg-[#a855f7] text-white border-[#c084fc]'
                      : 'bg-[#1b1b1b] text-neutral-400 border-[#2b2b2b] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Supported Platforms</label>
            <div className="flex flex-wrap gap-2">
              {['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'macOS', 'Linux', 'Mobile'].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => handlePlatformToggle(plat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                    formData.platforms.includes(plat)
                      ? 'bg-[#a855f7] text-white border-[#c084fc]'
                      : 'bg-[#1b1b1b] text-neutral-400 border-[#2b2b2b] hover:text-white'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* African Developer Checkbox */}
        <div className="p-4 rounded-2xl bg-[#1c1426] border border-[#a855f7]/30 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="african-creator"
              checked={formData.isAfricanDeveloper}
              onChange={(e) => setFormData({ ...formData, isAfricanDeveloper: e.target.checked })}
              className="w-4 h-4 rounded text-[#a855f7] focus:ring-[#a855f7] bg-[#121212] border-white/20"
            />
            <label htmlFor="african-creator" className="text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
              <Sparkles size={14} className="text-[#c084fc]" />
              This game is developed by an African or Rwandan creator/studio
            </label>
          </div>

          {formData.isAfricanDeveloper && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-neutral-300 mb-1">Studio Location (City, Country)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Kigali, Rwanda or Nairobi, Kenya"
                className="w-full bg-[#141414] border border-[#2b2b2b] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#a855f7] outline-none"
              />
            </div>
          )}
        </div>

        {/* Official Links */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-bold text-white border-b border-[#222] pb-2">
            3. Official Distribution & Store Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Official Website</label>
              <input
                type="url"
                value={formData.officialWebsite}
                onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                placeholder="https://yourgamestudio.com"
                className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Steam / Store / itch.io URL</label>
              <input
                type="url"
                value={formData.storeLink}
                onChange={(e) => setFormData({ ...formData, storeLink: e.target.value })}
                placeholder="https://store.steampowered.com/app/..."
                className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#a855f7]/25"
        >
          {loading ? 'Submitting for Review...' : 'Submit Game for Review'}
        </button>
      </form>
    </div>
  );
}
