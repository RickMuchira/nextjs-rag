// File: app/lib/api.ts

/**
 * Helper function to fetch data from the API with proper error handling
 */
export async function fetchApi<T>(endpoint: string): Promise<T> {
  // Use the base URL from environment variables or default to relative path
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;

  // Set cache: 'no-store' for server-side fetching to always get fresh data
  const response = await fetch(url, { 
    cache: 'no-store',
    next: { revalidate: 0 } // For Next.js 13+
  });

  if (!response.ok) {
    // Handle HTTP errors
    if (response.status === 404) {
      throw new Error(`Not found: ${endpoint}`);
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
