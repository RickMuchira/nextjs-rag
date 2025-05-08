// app/api/units/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET: Get a single unit by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const unitId = parseInt(params.id, 10);
    if (isNaN(unitId)) return NextResponse.json({ error: 'Invalid unit ID' }, { status: 400 });

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { semester: { include: { year: { include: { course: true } } } } }
    });

    if (!unit) return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    return NextResponse.json(unit, { status: 200 });
  } catch (error) {
    console.error('Error fetching unit:', error);
    return NextResponse.json({ error: 'Failed to fetch unit' }, { status: 500 });
  }
}

// PUT: Update a unit by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const unitId = parseInt(params.id, 10);
    if (isNaN(unitId)) return NextResponse.json({ error: 'Invalid unit ID' }, { status: 400 });

    const data = await request.json();
    if (!data.name) {
        return NextResponse.json({ error: 'Name field is required' }, { status: 400 });
    }

    const updatedUnit = await prisma.unit.update({
      where: { id: unitId },
      data: {
        name: data.name,
        content: data.content,
      },
    });
    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error: any) {
    console.error('Error updating unit:', error);
    if (error.code === 'P2025') return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to update unit' }, { status: 500 });
  }
}

// DELETE: Delete a unit by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const unitId = parseInt(params.id, 10);
    if (isNaN(unitId)) return NextResponse.json({ error: 'Invalid unit ID' }, { status: 400 });

    await prisma.unit.delete({ where: { id: unitId } });
    return NextResponse.json({ message: 'Unit deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting unit:', error);
    if (error.code === 'P2025') return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    return NextResponse.json({ error: 'Failed to delete unit' }, { status: 500 });
  }
}