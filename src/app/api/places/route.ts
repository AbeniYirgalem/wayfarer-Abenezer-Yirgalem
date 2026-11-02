import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'Places endpoint - Implementation scheduled for Phase 2' },
    { status: 501 }
  );
}

