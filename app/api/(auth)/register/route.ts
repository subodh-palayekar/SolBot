import dbConnect from '@/lib/database/dbConnection';
import User from '@/lib/database/model/user.model';
import { Keypair } from '@solana/web3.js';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    const { username, password, profileImage } = await req.json();

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username Already Exists' },
        { status: 400 }
      );
    }

    const newUser = new User({
      username,
      password,
      profileImage: profileImage || null,
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user and Solana wallet:', error);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
