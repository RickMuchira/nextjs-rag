// src/components/DocumentUploader.tsx
'use client';

import React, { useState, useRef } from 'react';
import { DocumentType } from '@/app/lib/blob';

interface UploadProps {
  courseId?: number;
  yearId?: number;
  semesterId?: number;
  unitId?: number;
  onSuccess?: (document: any) => void;
  onError?: (error: string) => void;
}

export default function DocumentUploader({
  courseId,
  yearId,
  semesterId,
  unitId,
  onSuccess,
  onError
}: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // List of allowed file types for display
  const allowedFileTypes = ['PDF', 'DOCX', 'TXT', 'MD'];

  // Helper function to reset the form
  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      
      // Auto-fill title with filename (without extension) if title is empty
      if (!title) {
        const fileName = e.target.files[0].name;
        const titleFromName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setTitle(titleFromName);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for the document');
      return;
    }

    // Check if at least one relationship is specified
    if (!courseId && !yearId && !semesterId && !unitId) {
      setError('Document must be associated with at least one part of the course hierarchy');
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      
      if (description) {
        formData.append('description', description);
      }
      
      if (courseId) {
        formData.append('courseId', courseId.toString());
      }
      
      if (yearId) {
        formData.append('yearId', yearId.toString());
      }
      
      if (semesterId) {
        formData.append('semesterId', semesterId.toString());
      }
      
      if (unitId) {
        formData.append('unitId', unitId.toString());
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload document');
      }

      const document = await response.json();
      
      // Reset form on success
      resetForm();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(document);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while uploading the document';
      setError(errorMessage);
      
      // Call error callback if provided
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
      
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
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept=".pdf,.docx,.txt,.md"
            disabled={isUploading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Allowed file types: {allowedFileTypes.join(', ')}. Maximum size: 10MB
          </p>
        </div>
        
        <div className="mb-4">
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
            disabled={isUploading}
          />
        </div>
        
        <div className="mb-4">
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
            disabled={isUploading}
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            disabled={isUploading}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isUploading || !file}
            className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isUploading || !file ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}