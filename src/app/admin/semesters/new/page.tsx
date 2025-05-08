import React from 'react';
import SemesterForm from '../SemesterForm';
import { Suspense } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/app/lib/api';

// Add a function to get year details for breadcrumb
async function getYearInfo(yearId: string): Promise<{ id: number; year: number; courseId: number; course: { name: string } } | null> {
  try {
    return await fetchApi<{ id: number; year: number; courseId: number; course: { name: string } }>(`/api/years/${yearId}`);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function PageContent({ yearId }: { yearId?: string }) {
    const parsedYearId = yearId ? parseInt(yearId, 10) : undefined;
    if (parsedYearId === undefined || isNaN(parsedYearId)) {
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
              href="/admin/courses"
              className="inline-flex items-center mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Courses
            </Link>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error: Valid Year ID is required</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>A valid Year ID is required to add a new semester.</p>
                    <p className="mt-1">
                      <Link href="/admin/courses" className="font-medium text-red-700 underline hover:text-red-600">
                        Go to courses
                      </Link>
                      {' '}and select a course to add years and semesters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }

    // Get year info for breadcrumb
    const yearInfo = await getYearInfo(yearId);
  
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/admin/courses" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Courses
                  </Link>
                </li>
                {yearInfo && (
                  <>
                    <li>
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <Link href={`/admin/courses/${yearInfo.courseId}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                          {yearInfo.course.name}
                        </Link>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <Link href={`/admin/years/${parsedYearId}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                          Year {yearInfo.year}
                        </Link>
                      </div>
                    </li>
                  </>
                )}
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Add New Semester</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Add New Semester</h1>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Fill in the details below to create a new semester. Once created, you can add units.
                    </p>
                  </div>
                </div>
              </div>
              
              <SemesterForm isEditing={false} yearId={parsedYearId} />
            </div>
        </div>
    );
}

export default function NewSemesterPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const yearId = typeof searchParams?.yearId === 'string' ? searchParams.yearId : undefined;
  
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    }>
        <PageContent yearId={yearId} />
    </Suspense>
  );
}
