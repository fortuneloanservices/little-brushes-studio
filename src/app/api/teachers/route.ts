import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Teacher from '@/lib/models/Teacher';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    return NextResponse.json({
      teachers: teachers.map((t) => ({
        id: t._id.toString(),
        fullName: t.fullName,
        email: t.email,
        phone: t.phone,
        specialization: t.specialization,
        experience: t.experience,
        status: t.status,
        classes: t.classes,
        isSenior: t.isSenior,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      specialization,
      experience = 1,
      classes = [],
      isSenior = false,
      status = 'Active',
    } = body;

    if (!fullName || !email || !specialization) {
      return NextResponse.json({ error: 'Full name, email, and specialization are required' }, { status: 400 });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const teacher = await Teacher.create({
      fullName,
      email,
      phone,
      specialization,
      experience,
      classes,
      isSenior,
      status,
    });

    return NextResponse.json({
      message: 'Teacher created successfully',
      teacher: {
        id: teacher._id.toString(),
        fullName: teacher.fullName,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        experience: teacher.experience,
        status: teacher.status,
        classes: teacher.classes,
        isSenior: teacher.isSenior,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
