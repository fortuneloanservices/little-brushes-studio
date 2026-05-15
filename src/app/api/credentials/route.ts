import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Credential from '@/lib/models/Credentials';

export const runtime = 'nodejs';
const roles = ['student', 'teacher', 'senior_teacher'] as const;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const role = url.searchParams.get('role');

    const filter: Record<string, string> = {};
    if (role) {
      if (!roles.includes(role as typeof roles[number])) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      filter.role = role;
    }

    const credentials = await Credential.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      credentials: credentials.map(doc => ({
        id: doc._id.toString(),
        name: doc.name,
        username: doc.username,
        email: doc.email,
        password: doc.password,
        mobileNumber: doc.mobileNumber,
        role: doc.role,
        accountStatus: doc.accountStatus,
        createdAt: doc.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      email,
      password,
      confirmPassword,
      role = 'student',
      mobileNumber,
      accountStatus = 'Active',
      createdBy = 'Admin',
    } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Name, email, password, and confirmPassword are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (!roles.includes(role as typeof roles[number])) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    const username = email.split('@')[0];

    const existingEmail = await Credential.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const existingUsername = await Credential.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const credential = await Credential.create({
      name,
      username,
      email,
      password,
      passwordHash,
      role,
      accountStatus,
      mobileNumber,
      createdBy,
    });

    return NextResponse.json(
      {
        message: 'Credential created successfully',
        credentials: {
          id: credential._id.toString(),
          name: credential.name,
          username: credential.username,
          email: credential.email,
          password: credential.password,
          mobileNumber: credential.mobileNumber,
          role: credential.role,
          accountStatus: credential.accountStatus,
          createdAt: credential.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating credential:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
