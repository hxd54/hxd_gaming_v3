import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const gameId = searchParams.get('gameId');

    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'RAWG API key is not configured on the server. Please set RAWG_API_KEY in environment variables.',
          configured: false,
        },
        { status: 503 }
      );
    }

    if (gameId) {
      // Fetch specific game details
      const response = await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(gameId)}?key=${apiKey}`);
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch game details from RAWG' }, { status: response.status });
      }

      const data = await response.json();

      // Extract system requirements honestly without inventing data
      const pcPlatform = data.platforms?.find((p: any) => p.platform?.id === 4 || p.platform?.slug === 'pc');
      const reqs = pcPlatform?.requirements || {};

      const formatted = {
        id: data.id,
        title: data.name,
        slug: data.slug,
        description: data.description_raw || data.description || 'Not provided',
        imageUrl: data.background_image || '',
        screenshots: data.short_screenshots?.map((s: any) => s.image) || [],
        developer: data.developers?.[0]?.name || 'Not provided',
        publisher: data.publishers?.[0]?.name || 'Not provided',
        releaseDate: data.released || 'Unknown',
        rating: data.rating ? Math.round(data.rating * 2) : undefined, // Convert 5-star to 10-scale
        categories: data.genres?.map((g: any) => g.name) || [],
        website: data.website || '',
        systemRequirements: {
          minimum: {
            raw: reqs.minimum || 'Not provided',
          },
          recommended: {
            raw: reqs.recommended || 'Not provided',
          },
        },
        attribution: 'Data provided by RAWG Video Games Database (rawg.io)',
      };

      return NextResponse.json({ game: formatted });
    }

    if (query) {
      // Search games
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=10`
      );

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to search games from RAWG' }, { status: response.status });
      }

      const data = await response.json();
      const results = (data.results || []).map((item: any) => ({
        id: item.id,
        title: item.name,
        slug: item.slug,
        imageUrl: item.background_image || '',
        releaseDate: item.released || 'Unknown',
        rating: item.rating ? Math.round(item.rating * 2) : undefined,
        categories: item.genres?.map((g: any) => g.name) || [],
      }));

      return NextResponse.json({ results });
    }

    return NextResponse.json({ error: 'Missing query or gameId parameter' }, { status: 400 });
  } catch (error) {
    console.error('RAWG Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error while contacting RAWG' }, { status: 500 });
  }
}

