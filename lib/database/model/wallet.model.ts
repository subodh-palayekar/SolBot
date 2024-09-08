import { model, models, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

const SECRET: string = process.env.JWT_SECRET || '';

export type WalletType = {
  _id?: string;
  publicKey: string;
  privateKey: string;
  balance: string;
  balanceInUsd: string;
};

const walletSchema = new Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: String,
  },
  balanceInUsd: {
    type: String,
  },
});

walletSchema.pre('save', async function (next) {
  const wallet = this as any;
  if (wallet.isModified('privateKey')) {
    try {
      wallet.privateKey = jwt.sign({ key: wallet.privateKey }, SECRET);
    } catch (error) {
      throw new Error('Failed to encrypt the private key');
    }
  }
  next();
});

walletSchema.methods.decryptprivateKey = function () {
  const wallet = this as any;
  try {
    const decoded = jwt.verify(wallet.privateKey, SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Failed to decrypt the private key');
  }
};

const EthWallet = models?.EthWallet || model('EthWallet', walletSchema);
const SolWallet = models?.SolWallet || model('SolWallet', walletSchema);

export { EthWallet, SolWallet };
