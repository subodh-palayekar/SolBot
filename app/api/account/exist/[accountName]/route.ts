import { doesAccountExist } from '@/lib/actions/cryptoAccount.action';
import dbConnect from '@/lib/database/dbConnection';
import { verifyJWT } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const arr = req.url?.split('/');
    const accountName = arr[arr.length - 1];

    const userId = verifyJWT(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = await doesAccountExist(userId, accountName);

    if (result) {
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred', error },
      { status: 500 }
    );
  }
}
