import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required to upload assets' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Allowed formats: JPEG, PNG, WebP, AVIF, GIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds maximum allowed size of 5MB' },
        { status: 400 }
      );
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${crypto.randomUUID()}.${ext}`;

    if (blobToken) {
      // Use Vercel Blob
      const blob = await put(`games/${filename}`, file, {
        access: 'public',
        token: blobToken,
      });
      return NextResponse.json({ success: true, url: blob.url });
    } else {
      // Local storage fallback in public/uploads
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      const localUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: localUrl });
    }
  } catch (error) {
    console.error('Asset upload error:', error);
    return NextResponse.json({ error: 'Failed to upload asset' }, { status: 500 });
  }
}

