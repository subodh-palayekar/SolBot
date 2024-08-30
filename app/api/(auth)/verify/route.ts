import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export async function GET(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get('token')?.value || '';

  if (token) {
    const isValid = jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.json({ isAuthenticated: isValid }, { status: 200 });
  }

  return NextResponse.json({ isAuthenticated: false }, { status: 401 });
}
