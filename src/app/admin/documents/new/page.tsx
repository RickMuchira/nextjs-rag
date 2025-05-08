'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DocumentUploader from '@/components/DocumentUploader';

export default function NewDocumentPage() {
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [units, setUnits] = useState([]);
  
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>(undefined);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>(undefined);
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(undefined);
  
  const [isLoading, setIsLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const router = useRouter();
  
  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Fetch years when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      const fetchYears = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/years?courseId=${selectedCourseId}`);
          if (!response.ok) throw new Error('Failed to fetch years');
          const data = await response.json();
          setYears(data);
          
          // Reset child selections
          setSelectedYearId(undefined);
          setSemesters([]);
          setSelectedSemesterId(undefined);
          setUnits([]);
          setSelectedUnitId(undefined);
        } catch (error) {
          console.error('Error fetching years:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchYears();
    } else {
      setYears([]);
      setSelectedYearId(undefined);
      setSemesters([]);
      setSelectedSemesterId(undefined);
      setUnits([]);
      setSelectedUnitId(undefined);
    }
  }, [selectedCourseId]);
  
  // Fetch semesters when a year is selected
  useEffect(() => {
    if (selectedYearId) {
      const fetchSemesters = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/semesters?yearId=${selectedYearId}`);
          if (!response.ok) throw new Error('Failed to fetch semesters');
          const data = await response.json();
          setSemesters(data);
          
          // Reset child selections
          setSelectedSemesterId(undefined);
          setUnits([]);
          setSelectedUnitId(undefined);
        } catch (error) {
          console.error('Error fetching semesters:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSemesters();
    } else {
      setSemesters([]);
      setSelectedSemesterId(undefined);
      setUnits([]);
      setSelectedUnitId(undefined);
    }
  }, [selectedYearId]);
  
  // Fetch units when a semester is selected
  useEffect(() => {
    if (selectedSemesterId) {
      const fetchUnits = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/units?semesterId=${selectedSemesterId}`);
          if (!response.ok) throw new Error('Failed to fetch units');
          const data = await response.json();
          setUnits(data);
          
          // Reset unit selection
          setSelectedUnitId(undefined);
        } catch (error) {
          console.error('Error fetching units:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUnits();
    } else {
      setUnits([]);
      setSelectedUnitId(undefined);
    }
  }, [selectedSemesterId]);
  
  // Handle successful upload
  const handleUploadSuccess = (document: any) => {
    setUploadSuccess(true);
    
    // Redirect after a delay
    setTimeout(() => {
      router.push('/admin/documents');
    }, 2000);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/admin/documents"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
          Back to Documents
        </Link>
      </div>
      
      {uploadSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 font-medium text-green-800">
                Document uploaded successfully! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Upload New Document</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                First, select where this document belongs in the course hierarchy. Then upload your file.
              </p>
            </div>
          </div>
        </div>
        
        {/* Hierarchy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="courseId"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              disabled={isLoading}
            >
              <option value="">Select a course</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="yearId" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="yearId"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedYearId || ''}
              onChange={(e) => setSelectedYearId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              disabled={!selectedCourseId || isLoading || years.length === 0}
            >
              <option value="">Select a year</option>
              {years.map((year: any) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="semesterId" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="semesterId"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedSemesterId || ''}
              onChange={(e) => setSelectedSemesterId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              disabled={!selectedYearId || isLoading || semesters.length === 0}
            >
              <option value="">Select a semester</option>
              {semesters.map((semester: any) => (
                <option key={semester.id} value={semester.id}>
                  {semester.semester}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              id="unitId"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedUnitId || ''}
              onChange={(e) => setSelectedUnitId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              disabled={!selectedSemesterId || isLoading || units.length === 0}
            >
              <option value="">Select a unit</option>
              {units.map((unit: any) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <DocumentUploader
            courseId={selectedCourseId}
            yearId={selectedYearId}
            semesterId={selectedSemesterId}
            unitId={selectedUnitId}
            onSuccess={handleUploadSuccess}
          />
        </div>
      </div>
    </div>
  );
}
