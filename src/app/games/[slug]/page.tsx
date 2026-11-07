import React from 'react';
import { notFound } from 'next/navigation';
import { getGameBySlug, getGames } from '@/lib/data';
import { GameDetailClient } from './GameDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Game Not Found — HXD Gaming 2.0',
    };
  }

  return {
    title: `${game.title} — HXD Gaming 2.0`,
    description: game.shortDescription || game.description.slice(0, 160),
    openGraph: {
      title: `${game.title} — Details & Specs`,
      description: game.shortDescription || game.description.slice(0, 160),
      images: [{ url: game.bannerUrl || game.imageUrl }],
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  // Find related games by category
  const allGames = await getGames();
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && g.categories.some((c) => game.categories.includes(c)))
    .slice(0, 6);

  return <GameDetailClient game={game} relatedGames={relatedGames} />;
}
