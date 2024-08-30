import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/dbConnection';
import { createAccount } from '@/lib/actions/cryptoAccount.action';
import User from '@/lib/database/model/user.model';
import { verifyJWT } from '@/lib/utils';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    const userId = verifyJWT(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { walletName } = await req.json();

    const newAccount = await createAccount(userId, walletName);

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

//getCryptoAccountByUserId
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    const userId = verifyJWT(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cryptoAccounts = await User.findById(userId)
      .select('cryptoAccount -_id')
      .populate('cryptoAccount');

    return NextResponse.json(cryptoAccounts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get accounts' },
      { status: 500 }
    );
  }
}
