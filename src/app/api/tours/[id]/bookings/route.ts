import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    { message: `Bookings for tour slot ${id} - Implementation scheduled for Phase 3` },
    { status: 501 }
  );
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    { message: `Create booking for tour slot ${id} - Implementation scheduled for Phase 3` },
    { status: 501 }
  );
}

