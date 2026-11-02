import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    { message: `Reviews for place ${id} - Implementation scheduled for Phase 2` },
    { status: 501 }
  );
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    { message: `Submit review for place ${id} - Implementation scheduled for Phase 2` },
    { status: 501 }
  );
}

