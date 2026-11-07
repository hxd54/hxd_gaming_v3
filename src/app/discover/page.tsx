import React, { Suspense } from 'react';
import { DiscoverView } from './DiscoverView';

export const metadata = {
  title: 'Discover Games — HXD Gaming 2.0',
  description: 'Filter and discover games by genre, platform, hardware specifications, and independent creator studios.',
};

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-neutral-500 text-sm">Loading discovery library...</div>}>
      <DiscoverView />
    </Suspense>
  );
}

