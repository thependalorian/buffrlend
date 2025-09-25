import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'Buffr_Logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    return NextResponse.json({ logoBase64 });
  } catch (error) {
    console.error('Error reading logo file:', error);
    return NextResponse.json({ error: 'Failed to load logo' }, { status: 500 });
  }
}
