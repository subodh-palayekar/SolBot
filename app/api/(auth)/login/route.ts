import dbConnect from '@/lib/database/dbConnection';
import User, { UserType } from '@/lib/database/model/user.model';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    const dbUser: any = await User.findOne({ username });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    const isCorrect = await dbUser.verifyPassword(password);

    const jwtToken = jwt.sign({ userId: dbUser._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    if (isCorrect) {
      const response = NextResponse.json(
        { success: 'Password Correct' },
        { status: 200 }
      );

      response.cookies.set('token', jwtToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      return response;
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to signin' }, { status: 400 });
  }
}
