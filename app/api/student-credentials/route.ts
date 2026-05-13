import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Student from '@/lib/models/Student';
import StudentCredentials from '@/lib/models/StudentCredentials';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      studentId,
      username,
      email,
      password,
      confirmPassword,
      role = 'Student',
      portalAccess = true,
      forcePasswordReset = true,
      recoveryEmail,
      mobileNumber,
      studentIdNumber,
      createdBy,
    } = body;

    // Validation
    if (!studentId || !username || !email || !password) {
      return NextResponse.json(
        { error: 'Student ID, username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if credentials already exist
    const existingCredentials = await StudentCredentials.findOne({ studentId });
    if (existingCredentials) {
      return NextResponse.json(
        { error: 'Credentials already exist for this student' },
        { status: 409 }
      );
    }

    // Check username and email uniqueness
    const existingUsername = await StudentCredentials.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    const existingEmail = await StudentCredentials.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create credentials
    const credentials = await StudentCredentials.create({
      studentId,
      username,
      email,
      passwordHash,
      role,
      accountStatus: 'Active',
      portalAccess,
      forcePasswordReset,
      recoveryEmail,
      mobileNumber,
      studentIdNumber,
      createdBy,
    });

    return NextResponse.json({
      message: 'Credentials created successfully',
      credentials: {
        id: credentials._id,
        username: credentials.username,
        email: credentials.email,
        role: credentials.role,
        accountStatus: credentials.accountStatus,
        portalAccess: credentials.portalAccess,
        createdAt: credentials.createdAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating student credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}