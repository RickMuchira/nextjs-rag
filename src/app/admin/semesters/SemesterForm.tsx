'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface Semester {
  id?: number;
  semester: string;
  yearId: number;
}

interface SuccessData {
  id: number;
  semester: string;
  yearId: number;
}

interface SemesterFormProps {
  initialData?: Partial<Semester> | null;
  isEditing: boolean;
  yearId?: number;
}

export default function SemesterForm({ initialData, isEditing, yearId: propYearId }: SemesterFormProps) {
  const [semester, setSemester] = useState('');
  const [currentYearId, setCurrentYearId] = useState<number | undefined>(propYearId || initialData?.yearId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setSemester(initialData.semester || '');
    }
    if (propYearId) {
        setCurrentYearId(propYearId);
    }
  }, [initialData, propYearId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!currentYearId) {
        setError('Year ID is missing.');
        setIsLoading(false);
        return;
    }
    if (semester === '') {
        setError('Semester name is required.');
        setIsLoading(false);
        return;
    }

    const semesterData = { semester, yearId: currentYearId };

    try {
      let response;
      if (isEditing && initialData?.id) {
        response = await fetch(`/api/semesters/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ semester: semesterData.semester }),
        });
      } else {
        response = await fetch('/api/semesters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(semesterData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} semester`);
      }
      
      // Show success message before redirecting
      const result = await response.json();
      setSuccessData(result);
      setIsSuccess(true);
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push(isEditing ? `/admin/semesters/${result.id}` : `/admin/semesters/${result.id}`);
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && successData) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm leading-5 font-medium text-green-800">
              Semester {successData.semester} has been {isEditing ? 'updated' : 'created'} successfully! Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
          Semester Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter semester name (e.g., Fall 2025)"
          required
        />
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isEditing ? 'Update Semester' : 'Create Semester'
          )}
        </button>
      </div>
      
      {!isEditing && (
        <p className="mt-2 text-sm text-gray-500">
          After creating this semester, you'll be able to add units to it.
        </p>
      )}
    </form>
  );
}
