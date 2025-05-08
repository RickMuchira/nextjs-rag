// app/api/semesters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// POST: Create a new semester
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.semester || !data.yearId) {
      return NextResponse.json({ error: 'Semester and yearId are required' }, { status: 400 });
    }

    const yearExists = await prisma.year.findUnique({ where: { id: data.yearId }});
    if (!yearExists) {
        return NextResponse.json({ error: 'Year not found' }, { status: 404 });
    }

    const newSemester = await prisma.semester.create({
      data: {
        semester: data.semester,
        yearId: parseInt(data.yearId, 10),
      },
    });
    return NextResponse.json(newSemester, { status: 201 });
  } catch (error) {
    console.error('Error creating semester:', error);
    return NextResponse.json({ error: 'Failed to create semester' }, { status: 500 });
  }
}

// GET: Get all semesters (can filter by yearId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const yearIdParam = searchParams.get('yearId');
    
    const whereClause: any = {};
    if (yearIdParam) {
      const yearId = parseInt(yearIdParam, 10);
      if(isNaN(yearId)) return NextResponse.json({ error: 'Invalid yearId query parameter' }, { status: 400 });
      whereClause.yearId = yearId;
    }

    const semesters = await prisma.semester.findMany({
      where: whereClause,
      include: { year: true, units: true },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(semesters, { status: 200 });
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return NextResponse.json({ error: 'Failed to fetch semesters' }, { status: 500 });
  }
}