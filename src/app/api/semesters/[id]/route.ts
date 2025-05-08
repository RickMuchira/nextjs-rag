// app/api/semesters/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET: Get a single semester by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const semesterId = parseInt(params.id, 10);
    if (isNaN(semesterId)) return NextResponse.json({ error: 'Invalid semester ID' }, { status: 400 });

    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
      include: { year: { include: { course: true } }, units: true }
    });

    if (!semester) return NextResponse.json({ error: 'Semester not found' }, { status: 404 });
    return NextResponse.json(semester, { status: 200 });
  } catch (error) {
    console.error('Error fetching semester:', error);
    return NextResponse.json({ error: 'Failed to fetch semester' }, { status: 500 });
  }
}

// PUT: Update a semester by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const semesterId = parseInt(params.id, 10);
    if (isNaN(semesterId)) return NextResponse.json({ error: 'Invalid semester ID' }, { status: 400 });

    const data = await request.json();
    if (!data.semester) {
        return NextResponse.json({ error: 'Semester field is required' }, { status: 400 });
    }

    const updatedSemester = await prisma.semester.update({
      where: { id: semesterId },
      data: {
        semester: data.semester,
      },
    });
    return NextResponse.json(updatedSemester, { status: 200 });
  } catch (error: any) {
    console.error('Error updating semester:', error);
    if (error.code === 'P2025') return NextResponse.json({ error: 'Semester not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update semester' }, { status: 500 });
  }
}

// DELETE: Delete a semester by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const semesterId = parseInt(params.id, 10);
    if (isNaN(semesterId)) return NextResponse.json({ error: 'Invalid semester ID' }, { status: 400 });

    await prisma.semester.delete({ where: { id: semesterId } });
    return NextResponse.json({ message: 'Semester deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting semester:', error);
    if (error.code === 'P2025') return NextResponse.json({ error: 'Semester not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete semester' }, { status: 500 });
  }
}