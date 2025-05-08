// src/app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { uploadFile, DocumentType } from '@/app/lib/blob';

// GET: List documents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    // Extract filter parameters
    const courseId = searchParams.get('courseId') ? parseInt(searchParams.get('courseId')!, 10) : undefined;
    const yearId = searchParams.get('yearId') ? parseInt(searchParams.get('yearId')!, 10) : undefined;
    const semesterId = searchParams.get('semesterId') ? parseInt(searchParams.get('semesterId')!, 10) : undefined;
    const unitId = searchParams.get('unitId') ? parseInt(searchParams.get('unitId')!, 10) : undefined;
    
    // Build the where clause based on provided filters
    const whereClause: any = {};
    if (courseId) whereClause.courseId = courseId;
    if (yearId) whereClause.yearId = yearId;
    if (semesterId) whereClause.semesterId = semesterId;
    if (unitId) whereClause.unitId = unitId;
    
    // Access document model via dynamic access
    const documents = await (prisma as any).document.findMany({
      where: whereClause,
      include: {
        course: true,
        year: true,
        semester: true,
        unit: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST: Create a new document
export async function POST(request: NextRequest) {
  try {
    // This route will be used by the client to receive upload URL and complete metadata
    // The actual file upload will happen directly from the client to Vercel Blob
    
    const formData = await request.formData();
    
    // Extract form data
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const courseId = formData.get('courseId') ? parseInt(formData.get('courseId') as string, 10) : null;
    const yearId = formData.get('yearId') ? parseInt(formData.get('yearId') as string, 10) : null;
    const semesterId = formData.get('semesterId') ? parseInt(formData.get('semesterId') as string, 10) : null;
    const unitId = formData.get('unitId') ? parseInt(formData.get('unitId') as string, 10) : null;
    
    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    // Ensure at least one context is provided
    if (!courseId && !yearId && !semesterId && !unitId) {
      return NextResponse.json({ 
        error: 'At least one context (course, year, semester, or unit) must be provided' 
      }, { status: 400 });
    }
    
    // Upload file to Vercel Blob
    const uploadResult = await uploadFile(file);
    
    if (!uploadResult.success) {
      return NextResponse.json({ error: uploadResult.error }, { status: 400 });
    }
    
    console.log('File uploaded successfully, creating document record');
    
    // Create document record in database using dynamic access
    const document = await (prisma as any).document.create({
      data: {
        title,
        description,
        filename: file.name,
        fileUrl: uploadResult.fileUrl!,
        fileKey: uploadResult.fileKey!,
        fileSize: uploadResult.fileSize!,
        fileType: uploadResult.fileType! as any, // Cast to any to avoid type conflicts
        courseId,
        yearId,
        semesterId,
        unitId,
      },
    });
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
