// src/app/lib/blob.ts
import { del, put } from '@vercel/blob';

// Define DocumentType enum to match Prisma schema
export enum DocumentType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  TXT = 'TXT',
  MD = 'MD',
  OTHER = 'OTHER'
}

// Map MIME types to our DocumentType enum
const mimeTypeToDocumentType: Record<string, DocumentType> = {
  'application/pdf': DocumentType.PDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocumentType.DOCX,
  'text/plain': DocumentType.TXT,
  'text/markdown': DocumentType.MD
};

// File size limit (10MB in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types
export const ALLOWED_MIME_TYPES = Object.keys(mimeTypeToDocumentType);

interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileKey?: string;
  error?: string;
  fileType?: DocumentType;
  fileSize?: number;
}

/**
 * Upload a file to Vercel Blob storage
 */
export async function uploadFile(
  file: File,
  folder: string = 'documents'
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'File type not supported. Supported types: PDF, DOCX, TXT, MD'
      };
    }

    // Generate a unique filename to avoid conflicts
    const timestamp = new Date().getTime();
    const fileName = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload file to Vercel Blob
    const { url, downloadUrl } = await put(fileName, file, {
      access: 'public', // Make file publicly accessible
    });

    // Determine document type
    let fileType: DocumentType = mimeTypeToDocumentType[file.type] || DocumentType.OTHER;

    return {
      success: true,
      fileUrl: downloadUrl,
      fileKey: fileName,
      fileType,
      fileSize: file.size
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: 'Failed to upload file. Please try again.'
    };
  }
}

/**
 * Delete a file from Vercel Blob storage
 */
export async function deleteFile(fileKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    await del(fileKey);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: 'Failed to delete file. Please try again.'
    };
  }
}
