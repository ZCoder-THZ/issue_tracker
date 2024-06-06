// pages/api/auth/register.js

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  const body = await request.json();
  const { email, password, name } = body;

  try {
    // Check if user already exists
    const checkUser = await prisma.user.findUnique({
      where: { email },
    });

    if (checkUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Return success response with user data
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    // Return a generic error message for unexpected errors
    return NextResponse.json({
      success: false,
      message: 'An error occurred',
    });
  }
};
