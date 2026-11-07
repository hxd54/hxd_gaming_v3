import React from 'react';
import Link from 'next/link';
import { getDevelopers } from '@/lib/data';
import { Users, Sparkles, MapPin, ExternalLink, ArrowRight, Gamepad2 } from 'lucide-react';

export const metadata = {
  title: 'Independent Developer Directory — HXD Gaming 2.0',
  description: 'Explore independent game studios and creators, with dedicated spotlights on Rwandan and African developers.',
};

export default async function DevelopersPage() {
  const developers = await getDevelopers();
  const africanDevs = developers.filter((d) => d.isAfrican);
  const otherDevs = developers.filter((d) => !d.isAfrican);

  return (
    <div className="space-y-10">
      {/* Directory Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c084fc] mb-1.5">
          <Users size={15} />
          Creator Ecosystem
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Independent Developer Directory
        </h1>
        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
          Discover the creators, teams, and studios behind the games. HXD Gaming highlights independent development, prioritizing the visibility of Rwandan and African game creators.
        </p>
      </div>

      {/* Rwandan & African Creators Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#a855f7]" />
            <h2 className="text-xl font-bold text-white">Rwandan & African Studios</h2>
          </div>
          <span className="text-xs text-neutral-400">{africanDevs.length} Studios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {africanDevs.map((dev) => (
            <Link
              key={dev.id}
              href={`/developers/${dev.slug}`}
              className="group p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#a855f7]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#a855f7]/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1f1f1f] border border-white/10 shrink-0">
                    <img src={dev.logoUrl || '/images/icons/gamepad.svg'} alt={dev.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide bg-[#2e1065] text-[#d8b4fe] border border-[#a855f7]/40 px-2.5 py-0.5 rounded-full">
                    {dev.isRwandan ? 'Rwanda' : 'Africa'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-[#c084fc] transition-colors">
                  {dev.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 mb-3">
                  <MapPin size={13} className="text-neutral-500" />
                  <span>{dev.location}</span>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                  {dev.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-neutral-400">
                <span className="text-[#c084fc] font-medium flex items-center gap-1">
                  View Profile <ArrowRight size={13} />
                </span>
                {dev.website && (
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <ExternalLink size={11} /> Website
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Global Independent Studios */}
      {otherDevs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#1f1f1f]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Featured Global Studios</h2>
            <span className="text-xs text-neutral-400">{otherDevs.length} Studios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherDevs.map((dev) => (
              <Link
                key={dev.id}
                href={`/developers/${dev.slug}`}
                className="group p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#a855f7]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#a855f7]/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1f1f1f] border border-white/10 shrink-0">
                      <img src={dev.logoUrl || '/images/icons/gamepad.svg'} alt={dev.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-[#c084fc] transition-colors">
                    {dev.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 mb-3">
                    <MapPin size={13} className="text-neutral-500" />
                    <span>{dev.location}</span>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                    {dev.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-neutral-400">
                  <span className="text-[#c084fc] font-medium flex items-center gap-1">
                    View Profile <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Creator Callout */}
      <div className="p-8 rounded-3xl bg-[#141414] border border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Are you an independent developer?</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-lg leading-relaxed">
            Get your game listed on HXD Gaming with verified developer attribution, hardware compatibility profiling, and official website routing.
          </p>
        </div>
        <Link
          href="/submit"
          className="px-6 py-3 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-md shadow-[#a855f7]/20"
        >
          Submit a Game for Review
        </Link>
      </div>
    </div>
  );
}

