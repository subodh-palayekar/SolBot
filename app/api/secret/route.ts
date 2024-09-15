import User from '@/lib/database/model/user.model';
import { verifyJWT } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const userId = verifyJWT(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const mnemonic = await User.findById(userId).select('-_id mnemonic');

    return NextResponse.json(mnemonic, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
