'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, Cpu, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Developers', href: '/developers', icon: Users },
  { name: 'My List', href: '/my-list', icon: Bookmark },
  { name: 'PC Check', href: '/compatibility', icon: Cpu },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-lg border-t border-[#1f1f1f] px-2 py-2 flex items-center justify-around">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all',
              isActive ? 'text-[#a855f7]' : 'text-neutral-400 hover:text-white'
            )}
          >
            <Icon size={20} className={cn(isActive && 'text-[#a855f7]')} />
            <span className="text-[10px] font-medium tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

