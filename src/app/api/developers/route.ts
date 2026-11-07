import { NextRequest, NextResponse } from 'next/server';
import { getDevelopers, saveDeveloper } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { Developer } from '@/types';
import { slugify } from '@/lib/utils';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const african = searchParams.get('african');
    const rwandan = searchParams.get('rwandan');

    let devs = await getDevelopers();

    if (rwandan === 'true') {
      devs = devs.filter((d) => d.isRwandan);
    } else if (african === 'true') {
      devs = devs.filter((d) => d.isAfrican);
    }

    return NextResponse.json({ developers: devs });
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json({ error: 'Failed to retrieve developers' }, { status: 500 });
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
    const { name, bio, location, country, isAfrican, isRwandan, website, logoUrl, bannerUrl, socialLinks, featured } = body;

    if (!name || !bio) {
      return NextResponse.json({ error: 'Studio name and bio are required' }, { status: 400 });
    }

    const newDev: Developer = {
      id: crypto.randomUUID(),
      name,
      slug: slugify(name),
      bio,
      location: location || 'Unknown',
      country: country || 'Unknown',
      isAfrican: !!isAfrican || !!isRwandan,
      isRwandan: !!isRwandan,
      website: website || '',
      logoUrl: logoUrl || '/images/icons/gamepad.svg',
      bannerUrl: bannerUrl || '',
      socialLinks: socialLinks || [],
      verified: true,
      featured: !!featured,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveDeveloper(newDev);
    return NextResponse.json({ success: true, developer: saved }, { status: 201 });
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json({ error: 'Failed to create developer' }, { status: 500 });
  }
}

