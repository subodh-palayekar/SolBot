import CryptoAccount from '@/lib/database/model/cryptoAccount.model';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/dbConnection';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

import axios from 'axios';

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

    // Convert SOL balance to USD

    if (accountFullDetails.solWallet) {
      // const solBalance = await getSolanaBalance(
      //   'Df1tqcvcstRsTwH6nN9P8vN4WzzZZWsw75puEdY86X4B'
      // );
      const solBalance = await getSolanaBalance(
        accountFullDetails?.solWallet?.publicKey
      );
      const solToUsdRate = await getSolToUsdRate();
      accountFullDetails.solWallet.privateKey =
        await accountFullDetails.solWallet.decryptprivateKey().key;
      // accountFullDetails.solWallet.balance = await getSolanaBalance(
      //   accountFullDetails?.solWallet?.publicKey
      // );

      accountFullDetails.solWallet.balance = solBalance;
      accountFullDetails.solWallet.balanceInUsd = solBalance * solToUsdRate;
      console.log(accountFullDetails, solBalance * solToUsdRate, solToUsdRate);
    }

    if (accountFullDetails.ethWallet) {
      const ethBalance = await getEthereumBalance(
        accountFullDetails?.ethWallet?.publicKey
      );
      const ethToUsdRate = await getEthToUsdRate();
      accountFullDetails.ethWallet.privateKey =
        await accountFullDetails.ethWallet.decryptprivateKey().key;

      accountFullDetails.ethWallet.balance = ethBalance;
      accountFullDetails.ethWallet.balanceInUsd = ethBalance * ethToUsdRate;
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

export async function getSolanaBalance(publicKey: string): Promise<number> {
  try {
    // Connect to the Solana cluster (using the mainnet beta cluster here)
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );

    // Create a PublicKey object
    const solanaPublicKey = new PublicKey(publicKey);

    // Get the balance in lamports (1 SOL = 1,000,000,000 lamports)
    const balanceInLamports = await connection.getBalance(solanaPublicKey);

    // Convert lamports to SOL
    const balanceInSol = balanceInLamports / 1e9; // 1e9 = 1,000,000,000

    return balanceInSol;
  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    throw new Error('Failed to fetch Solana balance');
  }
}

export async function getEthereumBalance(publicKey: string): Promise<number> {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;
    const url = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;

    const data = {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [publicKey, 'latest'],
      id: 1,
    };

    const response = await axios.post(url, data);

    // The balance returned by the API is in Wei (1 ETH = 10^18 Wei)
    const balanceInWei = response.data.result;

    // Convert Wei to Ether (1 Ether = 10^18 Wei)
    const balanceInEth = parseFloat(
      (parseInt(balanceInWei, 16) / 1e18).toFixed(18)
    );

    return balanceInEth;
  } catch (error) {
    console.error('Error fetching Ethereum balance:', error);
    throw new Error('Failed to fetch Ethereum balance');
  }
}

export async function getSolToUsdRate(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'
    );
    const solToUsdRate = parseFloat(response.data.price);

    return solToUsdRate;
  } catch (error) {
    console.error('Error fetching SOL to USD rate:', error);
    throw new Error('Failed to fetch SOL to USD rate');
  }
}

export async function getEthToUsdRate(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'
    );
    const ethToUsdRate = parseFloat(response.data.price);

    return ethToUsdRate;
  } catch (error) {
    console.error('Error fetching ETH to USD rate:', error);
    throw new Error('Failed to fetch ETH to USD rate');
  }
}
