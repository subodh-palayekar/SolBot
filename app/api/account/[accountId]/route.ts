import CryptoAccount from '@/lib/database/model/cryptoAccount.model';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/dbConnection';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const accountId = req.nextUrl.pathname.split('/').pop();

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    let accountFullDetails = await CryptoAccount.findById(accountId).populate(
      'solWallet ethWallet'
    );

    if (accountFullDetails.solWallet) {
      accountFullDetails.solWallet.privateKey =
        await accountFullDetails.solWallet.decryptprivateKey().key;
    }

    if (accountFullDetails.ethWallet) {
      accountFullDetails.ethWallet.privateKey =
        await accountFullDetails.ethWallet.decryptprivateKey().key;
    }

    if (!accountFullDetails) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(accountFullDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch account details' },
      { status: 500 }
    );
  }
}
