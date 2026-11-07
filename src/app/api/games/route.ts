import { NextRequest, NextResponse } from 'next/server';
import { getGames, saveGame } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { Game } from '@/types';
import { slugify } from '@/lib/utils';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim();
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');
    const collection = searchParams.get('collection');
    const isAfrican = searchParams.get('isAfrican');
    const sort = searchParams.get('sort') || 'newest';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    let games = await getGames();

    if (search) {
      games = games.filter((g) => {
        const titleMatch = g.title.toLowerCase().includes(search);
        const devMatch = g.developer?.toLowerCase().includes(search);
        const catMatch = g.categories?.some((c) => c.toLowerCase().includes(search));
        const descMatch = g.shortDescription?.toLowerCase().includes(search);
        return titleMatch || devMatch || catMatch || descMatch;
      });
    }

    if (category && category !== 'All') {
      games = games.filter((g) => g.categories?.includes(category));
    }

    if (platform && platform !== 'All') {
      games = games.filter((g) => g.platforms?.includes(platform as any));
    }

    if (collection && collection !== 'All') {
      games = games.filter((g) => g.editorialCollections?.includes(collection as any));
    }

    if (isAfrican === 'true') {
      games = games.filter((g) => g.isRwandanOrAfrican);
    }

    // Sorting
    if (sort === 'alphabetical') {
      games.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'rating') {
      games.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default: newest release or created
      games.sort((a, b) => new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime());
    }

    if (limit && limit > 0) {
      games = games.slice(0, limit);
    }

    return NextResponse.json({ games, total: games.length });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to retrieve games' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      shortDescription,
      imageUrl,
      bannerUrl,
      screenshots,
      developer,
      publisher,
      releaseDate,
      rating,
      categories,
      platforms,
      gameplayModes,
      systemRequirements,
      officialWebsite,
      authorizedLinks,
      accessibilityFeatures,
      isRwandanOrAfrican,
      editorialCollections,
      featured,
    } = body;

    if (!title || !description || !developer) {
      return NextResponse.json(
        { error: 'Title, description, and developer are required fields' },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const newGame: Game = {
      id: crypto.randomUUID(),
      title,
      slug,
      description,
      shortDescription: shortDescription || description.slice(0, 160),
      imageUrl: imageUrl || '/images/gaming.jpg',
      bannerUrl: bannerUrl || imageUrl,
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      developer,
      developerSlug: slugify(developer),
      publisher: publisher || developer,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      rating: typeof rating === 'number' ? rating : 7,
      categories: Array.isArray(categories) && categories.length > 0 ? categories : ['Indie'],
      platforms: Array.isArray(platforms) ? platforms : ['PC'],
      gameplayModes: Array.isArray(gameplayModes) ? gameplayModes : ['Single-player'],
      systemRequirements: systemRequirements || {
        minimum: { os: 'Windows 10 64-bit' },
      },
      officialWebsite: officialWebsite || '',
      authorizedLinks: Array.isArray(authorizedLinks) ? authorizedLinks : [],
      accessibilityFeatures: Array.isArray(accessibilityFeatures) ? accessibilityFeatures : [],
      isRwandanOrAfrican: !!isRwandanOrAfrican,
      editorialCollections: Array.isArray(editorialCollections) ? editorialCollections : [],
      featured: !!featured,
      verificationStatus: 'verified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveGame(newGame);
    return NextResponse.json({ success: true, game: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}

