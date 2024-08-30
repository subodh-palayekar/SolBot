import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const response = NextResponse.json(
    { success: 'Logged out successfully' },
    { status: 200 }
  );

  response.cookies.set('token', '', {
    expires: new Date(0),
    httpOnly: true,
  });

  return response;
}
