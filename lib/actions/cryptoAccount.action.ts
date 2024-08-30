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

export async function createAccount(userId: string) {
  const mnemonic = generateMnemonic();

  const user = await User.findById(userId).select('cryptoAccount');

  const accountNumber = user?.cryptoAccount?.length || 1;

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
    accountName: `Account ${accountNumber}`,
    solWallet: solWallet,
    ethWallet: ethWallet,
  };

  const newAccount = await CryptoAccount.create(accountPayload);

  const updatedUser = await User.findByIdAndUpdate(userId, {
    $push: { cryptoAccount: newAccount },
  });

  return updatedUser;
}
