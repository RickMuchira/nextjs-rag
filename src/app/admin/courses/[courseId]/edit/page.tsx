// 3. app/admin/courses/[courseId]/edit/page.tsx

import React from 'react';
import CourseForm from '../../CourseForm';

interface Course {
  id: number;
  name: string;
}

async function getCourseById(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`/api/courses/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch course: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
  const course = await getCourseById(params.courseId);

  if (!course) {
    return <div>Course not found. <a href="/admin/courses">Go back to courses.</a></div>;
  }

  return (
    <div>
      <h1>Edit Course: {course.name}</h1>
      <CourseForm initialData={course} isEditing={true} />
    </div>
  );
}