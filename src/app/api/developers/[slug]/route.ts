import { NextRequest, NextResponse } from 'next/server';
import { getDeveloperBySlug, getGames } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const developer = await getDeveloperBySlug(slug);

    if (!developer) {
      return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
    }

    const allGames = await getGames();
    const developerGames = allGames.filter((g) => {
      const matchSlug = g.developerSlug === developer.slug;
      const matchName = g.developer.toLowerCase().includes(developer.name.toLowerCase());
      return matchSlug || matchName;
    });

    return NextResponse.json({
      developer: {
        ...developer,
        gamesCount: developerGames.length,
      },
      games: developerGames,
    });
  } catch (error) {
    console.error('Error fetching developer profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

