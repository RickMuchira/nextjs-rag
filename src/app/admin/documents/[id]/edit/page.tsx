'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DocumentEditProps {
 params: {
   id: string;
 };
}

export default function EditDocumentPage({ params }: DocumentEditProps) {
 const documentId = parseInt(params.id, 10);
 const router = useRouter();
 
 const [document, setDocument] = useState<any>(null);
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 
 const [courses, setCourses] = useState([]);
 const [years, setYears] = useState([]);
 const [semesters, setSemesters] = useState([]);
 const [units, setUnits] = useState([]);
 
 const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
 const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
 const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null);
 const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
 
 const [isLoading, setIsLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState(false);
 
 // Fetch document data
 useEffect(() => {
   const fetchDocument = async () => {
     try {
       setIsLoading(true);
       const response = await fetch(`/api/documents/${documentId}`);
       
       if (!response.ok) {
         throw new Error('Failed to fetch document');
       }
       
       const data = await response.json();
       setDocument(data);
       setTitle(data.title || '');
       setDescription(data.description || '');
       setSelectedCourseId(data.courseId);
       setSelectedYearId(data.yearId);
       setSelectedSemesterId(data.semesterId);
       setSelectedUnitId(data.unitId);
     } catch (error) {
       console.error('Error fetching document:', error);
       setError('Failed to load document. Please try again.');
     } finally {
       setIsLoading(false);
     }
   };
   
   fetchDocument();
 }, [documentId]);
 
 // Fetch courses
 useEffect(() => {
   const fetchCourses = async () => {
     try {
       const response = await fetch('/api/courses');
       if (!response.ok) throw new Error('Failed to fetch courses');
       const data = await response.json();
       setCourses(data);
     } catch (error) {
       console.error('Error fetching courses:', error);
     }
   };
   
   fetchCourses();
 }, []);
 
 // Fetch years when a course is selected
 useEffect(() => {
   if (selectedCourseId) {
     const fetchYears = async () => {
       try {
         const response = await fetch(`/api/years?courseId=${selectedCourseId}`);
         if (!response.ok) throw new Error('Failed to fetch years');
         const data = await response.json();
         setYears(data);
       } catch (error) {
         console.error('Error fetching years:', error);
       }
     };
     
     fetchYears();
   } else {
     setYears([]);
   }
 }, [selectedCourseId]);
 
 // Fetch semesters when a year is selected
 useEffect(() => {
   if (selectedYearId) {
     const fetchSemesters = async () => {
       try {
         const response = await fetch(`/api/semesters?yearId=${selectedYearId}`);
         if (!response.ok) throw new Error('Failed to fetch semesters');
         const data = await response.json();
         setSemesters(data);
       } catch (error) {
         console.error('Error fetching semesters:', error);
       }
     };
     
     fetchSemesters();
   } else {
     setSemesters([]);
   }
 }, [selectedYearId]);
 
 // Fetch units when a semester is selected
 useEffect(() => {
   if (selectedSemesterId) {
     const fetchUnits = async () => {
       try {
         const response = await fetch(`/api/units?semesterId=${selectedSemesterId}`);
         if (!response.ok) throw new Error('Failed to fetch units');
         const data = await response.json();
         setUnits(data);
       } catch (error) {
         console.error('Error fetching units:', error);
       }
     };
     
     fetchUnits();
   } else {
     setUnits([]);
   }
 }, [selectedSemesterId]);
 
 // Handle form submission
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   setError(null);
   
   if (!title.trim()) {
     setError('Title is required');
     return;
   }
   
   if (!selectedCourseId && !selectedYearId && !selectedSemesterId && !selectedUnitId) {
     setError('At least one context (course, year, semester, or unit) must be selected');
     return;
   }
   
   try {
     setIsSaving(true);
     
     const response = await fetch(`/api/documents/${documentId}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         title,
         description,
         courseId: selectedCourseId,
         yearId: selectedYearId,
         semesterId: selectedSemesterId,
         unitId: selectedUnitId,
       }),
     });
     
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || 'Failed to update document');
     }
     
     setSuccess(true);
     
     // Redirect after a delay
     setTimeout(() => {
       router.push('/admin/documents');
     }, 2000);
   } catch (err: any) {
     setError(err.message || 'Failed to update document. Please try again.');
   } finally {
     setIsSaving(false);
   }
 };
 
 if (isLoading) {
   return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
       <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500">
         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
         Loading...
       </div>
     </div>
   );
 }
 
 if (!document && !isLoading) {
   return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="bg-white shadow-md rounded-lg p-6 text-center">
         <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
         <h2 className="mt-2 text-lg font-medium text-gray-900">Document not found</h2>
         <p className="mt-1 text-gray-500">The document you are looking for does not exist or has been deleted.</p>
         <Link 
           href="/admin/documents" 
           className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
         >
           Return to Documents
         </Link>
       </div>
     </div>
   );
 }
 
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
     
     {success && (
       <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
         <div className="flex">
           <div className="flex-shrink-0">
             <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="ml-3">
             <p className="text-sm leading-5 font-medium text-green-800">
               Document updated successfully! Redirecting...
             </p>
           </div>
         </div>
       </div>
     )}
     
     <div className="bg-white shadow-md rounded-lg p-6">
       <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Document: {document?.title}</h1>
       
       {error && (
         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
       
       <form onSubmit={handleSubmit}>
         <div className="space-y-6">
           <div>
             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
               Title <span className="text-red-500">*</span>
             </label>
             <input
               type="text"
               id="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="Enter document title"
               required
             />
           </div>
           
           <div>
             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
               Description
             </label>
             <textarea
               id="description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
               placeholder="Enter document description (optional)"
               rows={3}
             />
           </div>
           
           <div>
             <h3 className="text-sm font-medium text-gray-700 mb-4">Document Context</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                 <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                   Course
                 </label>
                 <select
                   id="courseId"
                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                   value={selectedCourseId || ''}
                   onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value, 10) : null)}
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
                   onChange={(e) => setSelectedYearId(e.target.value ? parseInt(e.target.value, 10) : null)}
                   disabled={!selectedCourseId}
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
                   onChange={(e) => setSelectedSemesterId(e.target.value ? parseInt(e.target.value, 10) : null)}
                   disabled={!selectedYearId}
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
                   onChange={(e) => setSelectedUnitId(e.target.value ? parseInt(e.target.value, 10) : null)}
                   disabled={!selectedSemesterId}
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
             <p className="mt-2 text-xs text-gray-500">
               At least one context (course, year, semester, or unit) must be selected.
             </p>
           </div>
           
           <div className="bg-gray-50 rounded-md p-4">
             <h4 className="text-sm font-medium text-gray-700 mb-2">Document Information</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-gray-500">Filename</p>
                 <p className="text-sm">{document?.filename}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500">File Type</p>
                 <p className="text-sm">{document?.fileType}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500">File Size</p>
                 <p className="text-sm">{document?.fileSize ? `${(document.fileSize / 1024).toFixed(1)} KB` : 'Unknown'}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-500">Uploaded</p>
                 <p className="text-sm">{document?.createdAt ? new Date(document.createdAt).toLocaleString() : 'Unknown'}</p>
               </div>
             </div>
             <div className="mt-4">
               <a
                 href={document?.fileUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                 <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                   <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                 </svg>
                 View Document
               </a>
             </div>
           </div>
           
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
               disabled={isSaving}
               className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
             >
               {isSaving ? (
                 <span className="flex items-center">
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Saving...
                 </span>
               ) : (
                 'Save Changes'
               )}
             </button>
           </div>
         </div>
       </form>
     </div>
   </div>
 );
}