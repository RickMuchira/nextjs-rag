// 7. app/admin/years/new/page.tsx
import React from 'react';
import YearForm from '../YearForm';
import { Suspense } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/app/lib/api';

// Add a function to get course details for breadcrumb
async function getCourseInfo(courseId: string): Promise<{ id: number; name: string } | null> {
  try {
    return await fetchApi<{ id: number; name: string }>(`/api/courses/${courseId}`);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function PageContent({ courseId }: { courseId?: string }) {
    const parsedCourseId = courseId ? parseInt(courseId, 10) : undefined;
    if (parsedCourseId === undefined || isNaN(parsedCourseId)) {
        return (
          <div>
            <div style={{ margin: '0 0 20px 0' }}>
              <Link href="/admin/courses">&larr; Back to Courses</Link>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f44336', 
              color: 'white',
              borderRadius: '4px'
            }}>
              Error: Valid Course ID is required to add a new year. 
              <Link href="/admin/courses" style={{ color: 'white', textDecoration: 'underline', marginLeft: '5px' }}>
                Select a course.
              </Link>
            </div>
          </div>
        );
    }

    // Get course info for breadcrumb
    const courseInfo = await getCourseInfo(courseId);
  
    return (
        <div>
            <div style={{ margin: '0 0 20px 0' }}>
              <Link href={`/admin/courses/${parsedCourseId}`}>
                &larr; Back to Course: {courseInfo?.name || `ID: ${parsedCourseId}`}
              </Link>
            </div>
            <h1>Add New Year</h1>
            <YearForm isEditing={false} courseId={parsedCourseId} />
            <div style={{ marginTop: '20px', color: '#666' }}>
              <p>After creating a year, you&apos;ll be able to add semesters to it.</p>
            </div>
        </div>
    );
}

export default function NewYearPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const courseId = typeof searchParams?.courseId === 'string' ? searchParams.courseId : undefined;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <PageContent courseId={courseId} />
    </Suspense>
  );
}
