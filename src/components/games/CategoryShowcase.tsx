import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const categories = [
  {
    name: 'Action & Adventure',
    slug: 'Action',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    count: '24 games',
  },
  {
    name: 'Role Playing (RPG)',
    slug: 'RPG',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    count: '18 games',
  },
  {
    name: 'Racing & Speed',
    slug: 'Racing',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    count: '10 games',
  },
  {
    name: 'Strategy & Tactics',
    slug: 'Strategy',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    count: '12 games',
  },
  {
    name: 'Fighting',
    slug: 'Fighting',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    count: '8 games',
  },
  {
    name: 'Simulation & Casual',
    slug: 'Simulation',
    image: 'https://images.unsplash.com/photo-1612287233215-62d29b2b2a6a?auto=format&fit=crop&w=600&q=80',
    count: '15 games',
  },
  {
    name: 'Indie Originals',
    slug: 'Indie',
    image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80',
    count: '16 games',
  },
  {
    name: 'Shooter & Combat',
    slug: 'Shooter',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    count: '14 games',
  },
];

export function CategoryShowcase() {
  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Browse By Categories
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Explore curated game genres tailored to your playstyle
          </p>
        </div>

        <Link
          href="/discover"
          className="flex items-center gap-1 text-xs md:text-sm font-medium text-[#c084fc] hover:text-[#e9d5ff] transition-colors group shrink-0"
        >
          <span>Explore All</span>
          <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/discover?category=${encodeURIComponent(cat.slug)}`}
            className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-[#242424] hover:border-[#a855f7]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#a855f7]/15"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute inset-0 p-3.5 flex flex-col justify-end">
              <span className="font-bold text-sm text-white group-hover:text-[#c084fc] transition-colors">
                {cat.name}
              </span>
              <span className="text-[11px] text-neutral-400">{cat.count}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

