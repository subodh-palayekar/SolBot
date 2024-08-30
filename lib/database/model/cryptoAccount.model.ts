import { model, models, Schema } from 'mongoose';
import { WalletType } from './wallet.model';

export type CryptoAccountType = {
  _id?: string;
  accountName: string;
  solWallet: WalletType;
  ethWallet: WalletType;
};

const accountSchema = new Schema({
  accountName: {
    type: String,
    required: true,
  },

  solWallet: {
    type: Schema.Types.ObjectId,
    ref: 'SolWallet',
  },

  ethWallet: {
    type: Schema.Types.ObjectId,
    ref: 'EthWallet',
  },
});

const CryptoAccount =
  models?.CryptoAccount || model('CryptoAccount', accountSchema);

export default CryptoAccount;
