import { NextResponse } from 'next/server';
import { dataProvider } from '@/lib/data';

export async function GET() {
  try {
    const stats = await dataProvider.getAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
