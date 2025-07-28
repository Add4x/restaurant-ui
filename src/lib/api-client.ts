import { API_BASE_URL, API_VERSION } from '@/lib/api-config';

interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = {
      credentials: 'include',
      ...config,
    };
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    
    // Only add auth headers on server-side
    if (typeof window === 'undefined') {
      const clientId = process.env.API_CLIENT_ID;
      const clientSecret = process.env.API_CLIENT_SECRET;
      
      if (clientId && clientSecret) {
        // Basic auth for server-to-server communication
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
      }
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let errorDetails: unknown = null;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
      } catch {
        // Response wasn't JSON
      }
      
      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        details: errorDetails,
      };
      
      throw error;
    }
    
    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }
    
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.config.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const authHeaders = await this.getAuthHeaders();
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...authHeaders,
      },
      credentials: this.config.credentials,
    });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...authHeaders,
      },
      credentials: this.config.credentials,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...authHeaders,
      },
      credentials: this.config.credentials,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...authHeaders,
      },
      credentials: this.config.credentials,
    });
    
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...authHeaders,
      },
      credentials: this.config.credentials,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return this.handleResponse<T>(response);
  }
}

// Create singleton instances
// Handle case where API_VERSION might already include '/public'
const baseVersion = API_VERSION.replace(/\/public$/, '');

export const publicApiClient = new ApiClient({
  baseURL: `${API_BASE_URL}/api/${baseVersion}/public`,
});

export const privateApiClient = new ApiClient({
  baseURL: `${API_BASE_URL}/api/${baseVersion}`,
});

// Helper function to check if we're on the server
export function isServer() {
  return typeof window === 'undefined';
}

// Export the appropriate client based on context
export function getApiClient() {
  // Always use private client on server-side
  if (isServer()) {
    return privateApiClient;
  }
  
  // Use public client on client-side
  return publicApiClient;
}