// app/api/units/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// POST: Create a new unit
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name || !data.semesterId) {
      return NextResponse.json({ error: 'Name and semesterId are required' }, { status: 400 });
    }

    const semesterExists = await prisma.semester.findUnique({where: {id: data.semesterId}});
    if(!semesterExists) {
        return NextResponse.json({ error: 'Semester not found' }, { status: 404 });
    }

    const newUnit = await prisma.unit.create({
      data: {
        name: data.name,
        content: data.content, // Optional
        semesterId: parseInt(data.semesterId, 10),
      },
    });
    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error('Error creating unit:', error);
    return NextResponse.json({ error: 'Failed to create unit' }, { status: 500 });
  }
}

// GET: Get all units (can filter by semesterId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const semesterIdParam = searchParams.get('semesterId');
    
    const whereClause: any = {};
    if (semesterIdParam) {
      const semesterId = parseInt(semesterIdParam, 10);
      if(isNaN(semesterId)) return NextResponse.json({ error: 'Invalid semesterId query parameter' }, { status: 400 });
      whereClause.semesterId = semesterId;
    }

    const units = await prisma.unit.findMany({
      where: whereClause,
      include: { semester: true }, // Include parent semester
      orderBy: {
        name: 'asc' // Or createdAt, etc.
      }
    });
    return NextResponse.json(units, { status: 200 });
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  }
}