import { NextRequest, NextResponse } from 'next/server';
import { getGameById, getGameBySlug, saveGame, deleteGame } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let game = await getGameById(id);
    if (!game) {
      game = await getGameBySlug(id);
    }

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Error fetching game by ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existing = await getGameById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const body = await req.json();
    const updatedGame = {
      ...existing,
      ...body,
      id: existing.id, // Immutable ID
      slug: body.title ? slugify(body.title) : existing.slug,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveGame(updatedGame);
    return NextResponse.json({ success: true, game: saved });
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const success = await deleteGame(id);

    if (!success) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}

