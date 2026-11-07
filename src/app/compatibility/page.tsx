'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '@/types';
import { checkGameCompatibility, CompatibilityResult, UserHardware } from '@/lib/specs-matcher';
import { Cpu, HardDrive, Monitor, Save, AlertCircle, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CompatibilityPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [hardware, setHardware] = useState<UserHardware>({
    os: 'Windows 10 64-bit',
    cpu: '',
    ramGb: 16,
    gpu: '',
    storageGb: 500,
  });
  const [savedAlert, setSavedAlert] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  useEffect(() => {
    // Load games for tester dropdown
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        if (data.games) {
          setGames(data.games);
          if (data.games.length > 0) {
            setSelectedGameId(data.games[0].id);
          }
        }
      })
      .catch((err) => console.error(err));

    // Load saved specs from localStorage
    try {
      const saved = localStorage.getItem('hxd_user_specs');
      if (saved) {
        setHardware(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const selectedGame = games.find((g) => g.id === selectedGameId);

  useEffect(() => {
    if (selectedGame) {
      const res = checkGameCompatibility(hardware, selectedGame.systemRequirements);
      setResult(res);
    }
  }, [hardware, selectedGame]);

  const handleSaveSpecs = () => {
    try {
      localStorage.setItem('hxd_user_specs', JSON.stringify(hardware));
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
      window.dispatchEvent(new Event('hxd_user_specs_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c084fc] mb-1.5">
          <Cpu size={15} />
          Hardware Evaluation
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          PC Hardware Compatibility Checker
        </h1>
        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
          Verify whether your computer meets the published hardware requirements before downloading or purchasing. Your specifications are stored locally on your device.
        </p>
      </div>

      {/* Honest Principles Notice */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] flex items-start gap-3 mb-8">
        <Info size={18} className="text-[#a855f7] shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-300 leading-relaxed">
          <strong className="text-white">Transparent Hardware Matching:</strong> We do not fabricate synthetic FPS estimates or speculative benchmarks. Comparisons are performed directly against verified minimum and recommended requirements published by game creators.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hardware Input Panel */}
        <div className="bg-[#141414] rounded-2xl border border-[#242424] p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center justify-between">
            <span>Your PC Specifications</span>
            <span className="text-xs font-normal text-neutral-400">Stored in browser</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Operating System</label>
            <select
              value={hardware.os}
              onChange={(e) => setHardware({ ...hardware, os: e.target.value })}
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
            >
              <option value="Windows 11 64-bit">Windows 11 64-bit</option>
              <option value="Windows 10 64-bit">Windows 10 64-bit</option>
              <option value="Windows 7 / 8">Windows 7 / 8</option>
              <option value="Linux (Ubuntu / SteamOS)">Linux (Ubuntu / SteamOS)</option>
              <option value="macOS">macOS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Processor (CPU)</label>
            <input
              type="text"
              value={hardware.cpu}
              onChange={(e) => setHardware({ ...hardware, cpu: e.target.value })}
              placeholder="e.g. Intel Core i5-10400 or AMD Ryzen 5 3600"
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">System RAM</label>
              <select
                value={hardware.ramGb}
                onChange={(e) => setHardware({ ...hardware, ramGb: parseInt(e.target.value, 10) })}
                className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
              >
                <option value={4}>4 GB RAM</option>
                <option value={8}>8 GB RAM</option>
                <option value={12}>12 GB RAM</option>
                <option value={16}>16 GB RAM</option>
                <option value={32}>32 GB RAM</option>
                <option value={64}>64 GB RAM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Available Storage</label>
              <select
                value={hardware.storageGb}
                onChange={(e) => setHardware({ ...hardware, storageGb: parseInt(e.target.value, 10) })}
                className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
              >
                <option value={50}>50 GB Free</option>
                <option value={100}>100 GB Free</option>
                <option value={250}>250 GB Free</option>
                <option value={500}>500 GB Free</option>
                <option value={1000}>1 TB Free</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Graphics Card (GPU)</label>
            <input
              type="text"
              value={hardware.gpu}
              onChange={(e) => setHardware({ ...hardware, gpu: e.target.value })}
              placeholder="e.g. NVIDIA RTX 3060 or AMD Radeon RX 6600"
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2 text-sm text-white focus:border-[#a855f7] outline-none"
            />
          </div>

          <button
            onClick={handleSaveSpecs}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold transition-colors mt-2"
          >
            <Save size={15} />
            Save Specs to Browser
          </button>

          {savedAlert && (
            <p className="text-center text-xs text-emerald-400 font-medium animate-fade-in">
              ✓ Specifications saved locally! They will now automatically appear on game detail pages.
            </p>
          )}
        </div>

        {/* Live Evaluation Panel */}
        <div className="bg-[#141414] rounded-2xl border border-[#242424] p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Live Compatibility Test</h2>

            {/* Game Selector */}
            <label className="block text-xs font-medium text-neutral-400 mb-1">Select Game to Test</label>
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="w-full bg-[#1b1b1b] border border-[#2b2b2b] rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#a855f7] outline-none mb-6"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.developer})
                </option>
              ))}
            </select>

            {/* Outcome Result Card */}
            {result && (
              <div
                className={cn(
                  'p-4 rounded-xl border mb-6 flex items-start gap-3',
                  result.color === 'green' && 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
                  result.color === 'amber' && 'bg-amber-950/40 border-amber-500/40 text-amber-300',
                  result.color === 'red' && 'bg-rose-950/40 border-rose-500/40 text-rose-300',
                  result.color === 'neutral' && 'bg-neutral-900 border-neutral-700 text-neutral-300'
                )}
              >
                {result.color === 'green' && <CheckCircle2 size={22} className="text-emerald-400 shrink-0 mt-0.5" />}
                {result.color === 'amber' && <AlertCircle size={22} className="text-amber-400 shrink-0 mt-0.5" />}
                {result.color === 'red' && <XCircle size={22} className="text-rose-400 shrink-0 mt-0.5" />}
                {result.color === 'neutral' && <Info size={22} className="text-neutral-400 shrink-0 mt-0.5" />}

                <div>
                  <h3 className="font-bold text-sm tracking-wide">{result.label}</h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    Evaluation based on published minimum & recommended specifications.
                  </p>
                </div>
              </div>
            )}

            {/* Requirement Breakdown */}
            {selectedGame && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#1b1b1b] border border-[#262626]">
                  <span className="text-neutral-400 block mb-1 font-medium">Memory (RAM):</span>
                  <div className="flex justify-between items-center text-neutral-200">
                    <span>Required: {selectedGame.systemRequirements?.minimum?.memory || 'Not specified'}</span>
                    <span className="font-semibold text-white">Your PC: {hardware.ramGb} GB</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1b1b1b] border border-[#262626]">
                  <span className="text-neutral-400 block mb-1 font-medium">Storage Space:</span>
                  <div className="flex justify-between items-center text-neutral-200">
                    <span>Required: {selectedGame.systemRequirements?.minimum?.storage || 'Not specified'}</span>
                    <span className="font-semibold text-white">Free: {hardware.storageGb} GB</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1b1b1b] border border-[#262626]">
                  <span className="text-neutral-400 block mb-1 font-medium">Target Graphics Card:</span>
                  <div className="text-neutral-200">
                    {selectedGame.systemRequirements?.minimum?.graphics || 'Not specified'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

