import dbConnect from '@/lib/database/dbConnection';
import User from '@/lib/database/model/user.model';
import { isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  user_id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!isValidObjectId(user_id)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const dbUser = await User.findById(user_id).populate('solWallet');

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: 'Successfully fetched user and solwallet',
        data: dbUser.solWallet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user and solwallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user and solwallet' },
      { status: 500 }
    );
  }
}
