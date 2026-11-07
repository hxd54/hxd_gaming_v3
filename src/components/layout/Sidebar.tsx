'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  Home,
  Compass,
  LayoutGrid,
  Users,
  Bookmark,
  Cpu,
  PlusCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const mainNav: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Categories', href: '/discover?tab=categories', icon: LayoutGrid },
  { name: 'Developers', href: '/developers', icon: Users, badge: 'Africa' },
  { name: 'My List', href: '/my-list', icon: Bookmark },
  { name: 'PC Checker', href: '/compatibility', icon: Cpu },
  { name: 'Submit Game', href: '/submit', icon: PlusCircle },
];

const secondaryNav: NavItem[] = [
  { name: 'Admin', href: '/admin', icon: ShieldAlert },
  { name: 'Help & About', href: '/about', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-[#0d0d0d] border-r border-[#1f1f1f] transition-all duration-300 ease-in-out select-none',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#1f1f1f]">
        <NextLink href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#171717] border border-[#292929] flex items-center justify-center group-hover:border-[#a855f7] transition-colors">
            <span className="font-black text-sm tracking-tighter text-[#a855f7]">HXD</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                GAMING <span className="text-[10px] bg-[#a855f7]/20 text-[#a855f7] px-1.5 py-0.5 rounded font-mono">2.0</span>
              </span>
            </div>
          )}
        </NextLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Discovery
          </div>
        )}
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <NextLink
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative',
                isActive
                  ? 'bg-[#1a1a1a] text-white border border-[#292929] shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                size={19}
                className={cn(
                  'transition-transform duration-200 group-hover:scale-110 shrink-0',
                  isActive ? 'text-[#a855f7]' : 'text-neutral-400 group-hover:text-white'
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] font-medium bg-[#a855f7]/15 text-[#c084fc] px-1.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#a855f7] rounded-r-full" />
              )}
            </NextLink>
          );
        })}

        <div className="pt-4 mt-4 border-t border-[#1f1f1f]">
          {!collapsed && (
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Platform
            </div>
          )}
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <NextLink
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-3.5 py-2 rounded-xl font-medium text-sm transition-all duration-200 group',
                  isActive
                    ? 'bg-[#1a1a1a] text-white border border-[#292929]'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  size={18}
                  className={cn(
                    'transition-colors shrink-0',
                    isActive ? 'text-[#a855f7]' : 'text-neutral-400 group-hover:text-white'
                  )}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NextLink>
            );
          })}
        </div>
      </div>

      {/* Footer Branding */}
      {!collapsed && (
        <div className="p-4 border-t border-[#1f1f1f] bg-[#090909]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-400">Ad-Free Gaming Discovery</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Made with ❤️ in Rwanda</p>
        </div>
      )}
    </aside>
  );
}
