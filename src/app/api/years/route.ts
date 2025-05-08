// app/api/years/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// POST: Create a new year
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.year || !data.courseId) {
      return NextResponse.json({ error: 'Year and courseId are required' }, { status: 400 });
    }

    // Optional: Check if courseId exists
    const courseExists = await prisma.course.findUnique({ where: { id: data.courseId } });
    if (!courseExists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const newYear = await prisma.year.create({
      data: {
        year: parseInt(data.year, 10),
        courseId: parseInt(data.courseId, 10),
      },
    });
    return NextResponse.json(newYear, { status: 201 });
  } catch (error) {
    console.error('Error creating year:', error);
    return NextResponse.json({ error: 'Failed to create year' }, { status: 500 });
  }
}

// GET: Get all years (can filter by courseId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const courseIdParam = searchParams.get('courseId');
    
    const whereClause: any = {};
    if (courseIdParam) {
      const courseId = parseInt(courseIdParam, 10);
      if (isNaN(courseId)) {
        return NextResponse.json({ error: 'Invalid courseId query parameter' }, { status: 400 });
      }
      whereClause.courseId = courseId;
    }

    const years = await prisma.year.findMany({
      where: whereClause,
      include: {
        course: true, // Include parent course
        semesters: true, // Optionally include related semesters
      },
      orderBy: {
        year: 'desc'
      }
    });
    return NextResponse.json(years, { status: 200 });
  } catch (error) {
    console.error('Error fetching years:', error);
    return NextResponse.json({ error: 'Failed to fetch years' }, { status: 500 });
  }
}