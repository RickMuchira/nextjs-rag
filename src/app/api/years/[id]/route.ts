// app/api/years/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET: Get a single year by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const yearId = parseInt(params.id, 10);
    if (isNaN(yearId)) return NextResponse.json({ error: 'Invalid year ID' }, { status: 400 });

    const year = await prisma.year.findUnique({
      where: { id: yearId },
      include: { course: true, semesters: { include: { units: true } } }
    });

    if (!year) return NextResponse.json({ error: 'Year not found' }, { status: 404 });
    return NextResponse.json(year, { status: 200 });
  } catch (error) {
    console.error('Error fetching year:', error);
    return NextResponse.json({ error: 'Failed to fetch year' }, { status: 500 });
  }
}

// PUT: Update a year by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const yearId = parseInt(params.id, 10);
    if (isNaN(yearId)) return NextResponse.json({ error: 'Invalid year ID' }, { status: 400 });

    const data = await request.json();
    if (!data.year) {
        return NextResponse.json({ error: 'Year field is required for update' }, { status: 400 });
    }

    const updatedYear = await prisma.year.update({
      where: { id: yearId },
      data: {
        year: parseInt(data.year, 10),
      },
    });
    return NextResponse.json(updatedYear, { status: 200 });
  } catch (error: any) {
    console.error('Error updating year:', error);
    if (error.code === 'P2025') return NextResponse.json({ error: 'Year not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update year' }, { status: 500 });
  }
}

// DELETE: Delete a year by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const yearId = parseInt(params.id, 10);
    if (isNaN(yearId)) return NextResponse.json({ error: 'Invalid year ID' }, { status: 400 });

    await prisma.year.delete({ where: { id: yearId } });
    return NextResponse.json({ message: 'Year deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting year:', error);
    if (error.code === 'P2025') return NextResponse.json({ error: 'Year not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete year' }, { status: 500 });
  }
}