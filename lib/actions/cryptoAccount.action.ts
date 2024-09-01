import { generateMnemonic } from 'bip39';
import { generateEthKeyPair, generateSolanaKeyPair, Ikeypair } from '../utils';
import {
  EthWallet,
  SolWallet,
  WalletType,
} from '../database/model/wallet.model';
import CryptoAccount, {
  CryptoAccountType,
} from '../database/model/cryptoAccount.model';
import User from '../database/model/user.model';

export async function createAccount(userId: string, walletName: string) {
  const mnemonic = generateMnemonic();

  const user = await User.findById(userId).select('cryptoAccount');

  const accountNumber = user?.cryptoAccount?.length || 0;

  const solKeyPair: Ikeypair = await generateSolanaKeyPair(
    mnemonic,
    accountNumber
  );

  const ethKeypair: Ikeypair = await generateEthKeyPair(
    mnemonic,
    accountNumber
  );

  const solWallet = await SolWallet.create({
    publicKey: solKeyPair.publicKey,
    privateKey: solKeyPair.privateKey,
    balance: '0',
  });

  const ethWallet: WalletType = await EthWallet.create({
    publicKey: ethKeypair.publicKey,
    privateKey: ethKeypair.privateKey,
    balance: '0',
  });

  const accountPayload: CryptoAccountType = {
    accountName: walletName,
    solWallet: solWallet,
    ethWallet: ethWallet,
  };

  const newAccount = await CryptoAccount.create(accountPayload);

  const updatedUser = await User.findByIdAndUpdate(userId, {
    $push: { cryptoAccount: newAccount },
  });

  return newAccount;
}

export async function doesAccountExist(
  userId: string,
  accountName: string
): Promise<boolean> {
  try {
    // Find the user by ID and populate their cryptoAccount array
    const user = await User.findById(userId).populate('cryptoAccount').exec();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if any of the user's crypto accounts have the given accountName
    const accountExists = user.cryptoAccount.some(
      (account: any) => account.accountName === accountName
    );

    return accountExists;
  } catch (error) {
    console.error('Error checking account existence:', error);
    throw error; // Rethrow error after logging
  }
}
