// app/api/courses/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        years: {
          include: {
            semesters: {
              include: {
                units: true
              }
            }
          },
          orderBy: {
            year: 'desc'
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error(`Error fetching course:`, error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await _request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { name }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error(`Error updating course:`, error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.course.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting course:`, error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
