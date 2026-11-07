'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game, Developer, Submission } from '@/types';
import {
  Shield,
  Gamepad2,
  Users,
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  Sparkles,
  Edit,
  ExternalLink,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'submissions' | 'games' | 'developers'>('submissions');
  const [authChecked, setAuthChecked] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState('');

  // Add/Edit Game Modal State
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);

  // RAWG Auto-fill state
  const [rawgSearch, setRawgSearch] = useState('');
  const [rawgResults, setRawgResults] = useState<any[]>([]);
  const [rawgLoading, setRawgLoading] = useState(false);

  // Verify server-side session
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login');
        } else {
          setAuthChecked(true);
          loadAllData();
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const loadAllData = () => {
    fetch('/api/games')
      .then((r) => r.json())
      .then((d) => d.games && setGames(d.games));

    fetch('/api/submissions')
      .then((r) => r.json())
      .then((d) => d.submissions && setSubmissions(d.submissions));

    fetch('/api/developers')
      .then((r) => r.json())
      .then((d) => d.developers && setDevelopers(d.developers));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleApproveSubmission = async (id: string) => {
    const res = await fetch(`/api/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', adminNotes: 'Verified and approved' }),
    });
    if (res.ok) {
      loadAllData();
    }
  };

  const handleRejectSubmission = async (id: string) => {
    const res = await fetch(`/api/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', adminNotes: 'Did not meet listing criteria' }),
    });
    if (res.ok) {
      loadAllData();
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      const res = await fetch(`/api/games/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGames((prev) => prev.filter((g) => g.id !== id));
      }
    }
  };

  const handleToggleFeatured = async (game: Game) => {
    const res = await fetch(`/api/games/${game.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !game.featured }),
    });
    if (res.ok) {
      setGames((prev) =>
        prev.map((g) => (g.id === game.id ? { ...g, featured: !g.featured } : g))
      );
    }
  };

  const handleSaveGameForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame?.title || !editingGame?.developer) return;

    if (editingGame.id) {
      // Update
      const res = await fetch(`/api/games/${editingGame.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGame),
      });
      if (res.ok) {
        setGameModalOpen(false);
        loadAllData();
      }
    } else {
      // Create
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGame),
      });
      if (res.ok) {
        setGameModalOpen(false);
        loadAllData();
      }
    }
  };

  const handleRawgSearch = async () => {
    if (!rawgSearch.trim()) return;
    setRawgLoading(true);
    try {
      const res = await fetch(`/api/rawg?query=${encodeURIComponent(rawgSearch.trim())}`);
      const data = await res.json();
      setRawgResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRawgLoading(false);
    }
  };

  const handleApplyRawgGame = async (rawgId: number) => {
    try {
      const res = await fetch(`/api/rawg?gameId=${rawgId}`);
      const data = await res.json();
      if (data.game) {
        const rg = data.game;
        setEditingGame((prev) => ({
          ...prev,
          title: rg.title,
          description: rg.description,
          shortDescription: rg.description?.slice(0, 160) || '',
          imageUrl: rg.imageUrl,
          developer: rg.developer,
          publisher: rg.publisher,
          releaseDate: rg.releaseDate,
          rating: rg.rating,
          categories: rg.categories,
          officialWebsite: rg.website,
        }));
        setRawgResults([]);
        setRawgSearch('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!authChecked) {
    return (
      <div className="py-20 text-center text-xs text-neutral-500">
        Verifying administrator session...
      </div>
    );
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const filteredGames = games.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.developer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#241738] text-[#c084fc] border border-[#a855f7]/40 flex items-center justify-center">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Management Dashboard
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Verified Session
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              Manage library games, verify creator submissions, and configure spotlights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingGame({
                title: '',
                developer: '',
                description: '',
                categories: ['Indie'],
                platforms: ['PC'],
                systemRequirements: { minimum: { os: 'Windows 10' } },
              });
              setGameModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold shadow-md shadow-[#a855f7]/25"
          >
            <Plus size={15} /> Add Game
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-[#262626] hover:bg-rose-950/30 hover:text-rose-400 text-neutral-400 text-xs font-medium transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1f1f1f] pb-1 text-xs">
        <button
          onClick={() => setActiveTab('submissions')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
            activeTab === 'submissions'
              ? 'bg-[#1f1f1f] text-white border border-[#2e2e2e]'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          <Inbox size={15} />
          Submissions
          {pendingSubmissions.length > 0 && (
            <span className="bg-[#a855f7] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
            activeTab === 'games'
              ? 'bg-[#1f1f1f] text-white border border-[#2e2e2e]'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          <Gamepad2 size={15} />
          Games Library ({games.length})
        </button>

        <button
          onClick={() => setActiveTab('developers')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
            activeTab === 'developers'
              ? 'bg-[#1f1f1f] text-white border border-[#2e2e2e]'
              : 'text-neutral-400 hover:text-white'
          )}
        >
          <Users size={15} />
          Studios & Creators ({developers.length})
        </button>
      </div>

      {/* SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-400">
            Pending creator submissions require verification before being visible in the public library.
          </div>

          {submissions.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-500 bg-[#121212] rounded-2xl border border-[#222]">
              No submissions currently in queue.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-[#141414] border border-[#242424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">{sub.title}</h3>
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase',
                          sub.status === 'pending' && 'bg-amber-950 text-amber-400 border border-amber-500/30',
                          sub.status === 'approved' && 'bg-emerald-950 text-emerald-400 border border-emerald-500/30',
                          sub.status === 'rejected' && 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        )}
                      >
                        {sub.status}
                      </span>
                      {sub.isAfricanDeveloper && (
                        <span className="text-[10px] font-semibold text-[#d8b4fe] bg-[#2e1065] px-2 py-0.5 rounded-full">
                          African Creator
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400">
                      Developer: <strong className="text-neutral-200">{sub.developer}</strong> ({sub.developerEmail})
                    </p>
                    <p className="text-xs text-neutral-300 max-w-xl line-clamp-2">{sub.description}</p>
                  </div>

                  {sub.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveSubmission(sub.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        <Check size={14} /> Approve & Publish
                      </button>
                      <button
                        onClick={() => handleRejectSubmission(sub.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-500/30"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GAMES LIBRARY TAB */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 size-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library games..."
              className="w-full bg-[#141414] border border-[#242424] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden divide-y divide-[#1f1f1f]">
            {filteredGames.map((game) => (
              <div key={game.id} className="p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#1c1c1c] overflow-hidden shrink-0">
                    <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-white truncate">{game.title}</h4>
                      {game.featured && (
                        <span className="text-[10px] font-semibold bg-[#a855f7]/20 text-[#c084fc] px-1.5 rounded">
                          Hero Featured
                        </span>
                      )}
                      {game.isRwandanOrAfrican && (
                        <span className="text-[10px] font-semibold bg-[#2e1065] text-[#d8b4fe] px-1.5 rounded">
                          African
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {game.developer} • {game.categories.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(game)}
                    className={cn(
                      'p-1.5 rounded-lg text-xs font-medium border transition-colors',
                      game.featured
                        ? 'bg-amber-950 text-amber-400 border-amber-500/30'
                        : 'bg-[#1a1a1a] text-neutral-400 border-[#262626] hover:text-white'
                    )}
                    title={game.featured ? 'Remove from Featured Hero' : 'Feature on Hero'}
                  >
                    <Star size={14} className={cn(game.featured && 'fill-amber-400')} />
                  </button>

                  <button
                    onClick={() => {
                      setEditingGame(game);
                      setGameModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#1a1a1a] text-neutral-400 hover:text-white border border-[#262626]"
                    title="Edit Game"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => handleDeleteGame(game.id)}
                    className="p-1.5 rounded-lg bg-[#1a1a1a] text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 border border-[#262626]"
                    title="Delete Game"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEVELOPERS TAB */}
      {activeTab === 'developers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {developers.map((dev) => (
              <div key={dev.id} className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{dev.name}</h4>
                  {dev.isAfrican && (
                    <span className="text-[10px] font-semibold bg-[#2e1065] text-[#d8b4fe] px-2 py-0.5 rounded-full">
                      {dev.isRwandan ? 'Rwanda' : 'Africa'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400">{dev.location}</p>
                <p className="text-xs text-neutral-300 line-clamp-2">{dev.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Game Modal with RAWG Autocomplete */}
      {gameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <h3 className="font-bold text-base text-white">
                {editingGame?.id ? 'Edit Game Listing' : 'Add New Game to Library'}
              </h3>
              <button
                onClick={() => setGameModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* RAWG Search Helper */}
            <div className="p-3.5 rounded-xl bg-[#1a1424] border border-[#a855f7]/30 space-y-2">
              <span className="text-[11px] font-semibold text-[#c084fc] flex items-center gap-1">
                <Sparkles size={12} /> Auto-fill from RAWG Database (Optional)
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rawgSearch}
                  onChange={(e) => setRawgSearch(e.target.value)}
                  placeholder="Type title (e.g. Witcher 3, Cyberpunk)..."
                  className="flex-1 bg-[#121212] border border-[#2b2b2b] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#a855f7]"
                />
                <button
                  type="button"
                  onClick={handleRawgSearch}
                  disabled={rawgLoading}
                  className="px-3 py-1.5 rounded-xl bg-[#a855f7] text-white text-xs font-semibold shrink-0"
                >
                  {rawgLoading ? 'Searching...' : 'Search RAWG'}
                </button>
              </div>

              {rawgResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 pt-2 border-t border-[#241c30]">
                  {rawgResults.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleApplyRawgGame(r.id)}
                      className="w-full text-left p-2 rounded-lg bg-black/40 hover:bg-[#a855f7]/20 flex items-center justify-between text-xs text-white"
                    >
                      <span className="truncate">{r.title} ({r.releaseDate?.split('-')[0]})</span>
                      <span className="text-[10px] text-[#c084fc] font-semibold">Apply Metadata</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Game Form */}
            <form onSubmit={handleSaveGameForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Game Title *</label>
                <input
                  type="text"
                  required
                  value={editingGame?.title || ''}
                  onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-white outline-none focus:border-[#a855f7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Developer Studio *</label>
                  <input
                    type="text"
                    required
                    value={editingGame?.developer || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, developer: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-white outline-none focus:border-[#a855f7]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Release Date</label>
                  <input
                    type="date"
                    value={editingGame?.releaseDate || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, releaseDate: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-white outline-none focus:border-[#a855f7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Cover Artwork URL</label>
                <input
                  type="url"
                  value={editingGame?.imageUrl || ''}
                  onChange={(e) => setEditingGame({ ...editingGame, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-white outline-none focus:border-[#a855f7]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingGame?.description || ''}
                  onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-white outline-none focus:border-[#a855f7]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingGame?.isRwandanOrAfrican || false}
                    onChange={(e) => setEditingGame({ ...editingGame, isRwandanOrAfrican: e.target.checked })}
                    className="w-4 h-4 rounded text-[#a855f7] bg-[#1a1a1a]"
                  />
                  <span className="text-white">African / Rwandan Creator</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingGame?.featured || false}
                    onChange={(e) => setEditingGame({ ...editingGame, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#a855f7] bg-[#1a1a1a]"
                  />
                  <span className="text-white">Featured Hero Showcase</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setGameModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1a1a1a] text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold"
                >
                  Save Game Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

