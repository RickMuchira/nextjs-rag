// app/api/courses/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        years: {
          orderBy: {
            year: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(_request: Request) {
  try {
    const body = await _request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { name }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
