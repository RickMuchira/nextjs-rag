// src/app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { deleteFile } from '@/app/lib/blob';

// GET: Get a single document by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id, 10);
    
    if (isNaN(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }
    
    // Use dynamic access to the document model
    const document = await (prisma as any).document.findUnique({
      where: { id: documentId },
      include: {
        course: true,
        year: true,
        semester: true,
        unit: true,
      },
    });
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

// PUT: Update document metadata (not the file itself)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id, 10);
    
    if (isNaN(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }
    
    // Get request body
    const data = await request.json();
    const { title, description, courseId, yearId, semesterId, unitId } = data;
    
    // Find the document to update - using dynamic access
    const existingDocument = await (prisma as any).document.findUnique({
      where: { id: documentId },
    });
    
    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Ensure at least one context is provided
    if (
      (courseId === null || courseId === undefined) && 
      (yearId === null || yearId === undefined) && 
      (semesterId === null || semesterId === undefined) && 
      (unitId === null || unitId === undefined)
    ) {
      return NextResponse.json({ 
        error: 'At least one context (course, year, semester, or unit) must be provided' 
      }, { status: 400 });
    }
    
    // Update document metadata - using dynamic access
    const updatedDocument = await (prisma as any).document.update({
      where: { id: documentId },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        courseId: courseId !== undefined ? courseId : undefined,
        yearId: yearId !== undefined ? yearId : undefined,
        semesterId: semesterId !== undefined ? semesterId : undefined,
        unitId: unitId !== undefined ? unitId : undefined,
      },
      include: {
        course: true,
        year: true,
        semester: true,
        unit: true,
      },
    });
    
    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE: Delete a document
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id, 10);
    
    if (isNaN(documentId)) {
      return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
    }
    
    // Find the document to delete - using dynamic access
    const document = await (prisma as any).document.findUnique({
      where: { id: documentId },
    });
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Delete the file from Vercel Blob
    const deleteResult = await deleteFile(document.fileKey);
    
    if (!deleteResult.success) {
      // Log the error but continue with deleting the database record
      console.error('Error deleting file from blob storage:', deleteResult.error);
    }
    
    // Delete the document record from the database - using dynamic access
    await (prisma as any).document.delete({
      where: { id: documentId },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
