import React from 'react';
import Link from 'next/link';
import { fetchApi } from '@/app/lib/api';
import DocumentList from '@/components/DocumentList';

// Define Document interface (matching the one in DocumentList component)
interface Document {
  id: number;
  title: string;
  description?: string | null;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  courseId?: number | null;
  yearId?: number | null;
  semesterId?: number | null;
  unitId?: number | null;
  course?: { name: string } | null;
  year?: { year: number } | null;
  semester?: { semester: string } | null;
  unit?: { name: string } | null;
}

// Fetch all documents with proper typing
async function getDocuments(): Promise<Document[]> {
  try {
    const response = await fetchApi('/api/documents');
    return response as Document[];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Documents
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage documents across all courses, years, semesters, and units
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/documents/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Upload New Document
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Documents
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <DocumentList 
          documents={documents} 
          emptyMessage="No documents have been uploaded yet. Click 'Upload New Document' to add one." 
        />
      </div>
    </div>
  );
}