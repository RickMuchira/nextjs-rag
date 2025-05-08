// src/app/lib/api.ts
/**
 * Fetch data from the API with improved error handling
 */
export async function fetchApi<T = any>(endpoint: string): Promise<T> {
  // Make sure the endpoint starts with a slash
  const url = endpoint.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${endpoint}` 
    : endpoint;
  
  try {
    // Use absolute URL format
    const absoluteUrl = new URL(
      url,
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    ).toString();
    
    const response = await fetch(absoluteUrl, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
