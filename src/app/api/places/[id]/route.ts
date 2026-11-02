import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    { message: `Place ${id} endpoint - Implementation scheduled for Phase 2` },
    { status: 501 }
  );
}

