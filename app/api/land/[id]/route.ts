import { NextRequest, NextResponse } from 'next/server';
import { dataProvider } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const parcel = await dataProvider.getLandById(params.id);
    if (!parcel) {
      return NextResponse.json({ success: false, error: 'Land parcel not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: parcel });
  } catch (error) {
    console.error('Land detail API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch land detail' }, { status: 500 });
  }
}
