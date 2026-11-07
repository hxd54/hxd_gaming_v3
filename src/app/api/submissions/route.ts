import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, saveSubmission } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { Submission } from '@/types';
import crypto from 'crypto';

const submissionRateLimits = new Map<string, { count: number; resetTime: number }>();

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }

    const submissions = await getSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const limit = 5;

    const rate = submissionRateLimits.get(ip);
    if (!rate || now > rate.resetTime) {
      submissionRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      if (rate.count >= limit) {
        return NextResponse.json(
          { error: 'Submission limit reached for this hour. Please try again later.' },
          { status: 429 }
        );
      }
      rate.count += 1;
    }

    const body = await req.json();
    const {
      title,
      developer,
      developerEmail,
      description,
      shortDescription,
      imageUrl,
      screenshots,
      categories,
      platforms,
      releaseDate,
      officialWebsite,
      authorizedLinks,
      systemRequirements,
      accessibilityFeatures,
      isAfricanDeveloper,
      location,
    } = body;

    // Strict validation
    if (!title?.trim() || !developer?.trim() || !developerEmail?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Title, developer name, email, and description are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(developerEmail.trim())) {
      return NextResponse.json({ error: 'Valid developer email is required' }, { status: 400 });
    }

    const newSubmission: Submission = {
      id: crypto.randomUUID(),
      title: title.trim(),
      developer: developer.trim(),
      developerEmail: developerEmail.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim() || description.trim().slice(0, 160),
      imageUrl: imageUrl?.trim() || '/images/gaming.jpg',
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      categories: Array.isArray(categories) && categories.length > 0 ? categories : ['Indie'],
      platforms: Array.isArray(platforms) && platforms.length > 0 ? platforms : ['PC'],
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      officialWebsite: officialWebsite?.trim() || '',
      authorizedLinks: Array.isArray(authorizedLinks) ? authorizedLinks : [],
      systemRequirements: systemRequirements || { minimum: { os: 'Windows 10' } },
      accessibilityFeatures: Array.isArray(accessibilityFeatures) ? accessibilityFeatures : [],
      isAfricanDeveloper: !!isAfricanDeveloper,
      location: location?.trim() || 'Unknown',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const saved = await saveSubmission(newSubmission);
    return NextResponse.json(
      {
        success: true,
        message: 'Game submitted successfully. An administrator will review your submission before it appears publicly.',
        submissionId: saved.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submission creation error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
