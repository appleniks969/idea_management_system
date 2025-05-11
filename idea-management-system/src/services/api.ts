// Common API response types and utilities

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type ApiError = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};

// Simulate API response with proper structure and error handling
export function createApiResponse<T>(data: T, status = 200, message = 'Success'): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    // Simulate random errors (10% chance) to test error handling
    const shouldFail = Math.random() < 0.1;
    
    setTimeout(() => {
      if (shouldFail) {
        const error: ApiError = {
          status: 500,
          message: 'Simulated server error',
        };
        reject(error);
      } else {
        resolve({
          data,
          status,
          message,
        });
      }
    }, 300); // Simulate network delay
  });
}

// Helper function to handle API errors consistently
export function handleApiError(error: unknown): never {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    console.error('API Error:', error);
    throw error;
  }
  
  const genericError: ApiError = {
    status: 500,
    message: 'An unexpected error occurred',
  };
  
  throw genericError;
}