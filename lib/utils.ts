import { mnemonicToSeed } from 'bip39';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { Wallet, HDNodeWallet } from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Ikeypair {
  publicKey: string;
  privateKey: string;
}

export async function generateSolanaKeyPair(
  mnemonic: string,
  accountNumber: number
): Promise<Ikeypair> {
  const seed = await mnemonicToSeed(mnemonic);

  const path = `m/44'/501'/${accountNumber}'/0'`;

  const derivedSeed = derivePath(path, seed.toString('hex')).key;

  const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

  const keyPair = Keypair.fromSecretKey(secretKey);

  return {
    publicKey: keyPair.publicKey.toBase58(),
    privateKey: Uint8ArrayToString(secretKey),
  };
}

export async function generateEthKeyPair(
  mnemonic: string,
  accountNumber: number
): Promise<Ikeypair> {
  const seed = await mnemonicToSeed(mnemonic);

  const path = `m/44'/60'/${accountNumber}'/0'`;

  const hdNode = HDNodeWallet.fromSeed(seed);

  const child = hdNode.derivePath(path);

  const privateKey = child.privateKey;
  const wallet = new Wallet(privateKey);

  return {
    publicKey: wallet.address,
    privateKey: privateKey,
  };
}

export function Uint8ArrayToString(array: Uint8Array): string {
  const hexString = Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hexString;
}

export function convertPrivateKeyToUint8Array(privateKey: string): Uint8Array {
  const uint8Array = new Uint8Array(
    privateKey.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return uint8Array;
}

import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export function verifyJWT(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect('/login');
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded?.userId;
  } catch (error) {
    return NextResponse.redirect('/login');
  }
}
