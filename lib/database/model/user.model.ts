import { model, models, Schema } from 'mongoose';
import { generateMnemonic } from 'bip39';
import bcrypt from 'bcryptjs';
import { CryptoAccountType } from './cryptoAccount.model';

export type UserType = {
  _id: string;
  username: string;
  password: string;
  profileImage?: string | null;
  cryptoAccount: CryptoAccountType;
  mnemonic?: string[];
};

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  cryptoAccount: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CryptoAccount',
    },
  ],
  mnemonic: [String],
});

userSchema.pre('save', async function (next) {
  const user = this as any;

  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
      throw new Error('Unable to encrypt password');
    }
  }

  if (!user.mnemonic || user.mnemonic.length === 0) {
    try {
      const mnemonic = generateMnemonic();
      user.mnemonic = mnemonic.split(' ');
    } catch (err) {
      return next(new Error('Unable to generate mnemonic'));
    }
  }

  next();
});

userSchema.methods.verifyPassword = async function (providedPassword: string) {
  const user = this as any;
  try {
    return await bcrypt.compare(providedPassword, user.password);
  } catch (err) {
    throw new Error('Error verifying password');
  }
};

const User = models?.User || model('User', userSchema);

export default User;
