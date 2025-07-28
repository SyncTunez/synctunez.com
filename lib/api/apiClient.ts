import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from 'axios'
import { captureAPIError, addBreadcrumb } from '@/lib/sentry';

// Axios instance with credentials
export const apiClient: AxiosInstance = axios.create({
    baseURL: '/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor for tracking
apiClient.interceptors.request.use(
    (config) => {
        addBreadcrumb('API request started', 'api', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        captureAPIError(
            `API request interceptor error: ${error.message}`,
            {
                endpoint: error.config?.url || 'unknown',
                method: error.config?.method?.toUpperCase() || 'unknown',
                statusCode: 0,
                additionalData: {
                    error: error.message,
                    stack: error.stack,
                    config: error.config
                }
            },
            'error'
        );
        return Promise.reject(error);
    }
);

// Add response interceptor for tracking
apiClient.interceptors.response.use(
    (response) => {
        addBreadcrumb('API response received', 'api', {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
            statusText: response.statusText
        });
        return response;
    },
    (error: AxiosError) => {
        const statusCode = error.response?.status || 0;
        const endpoint = error.config?.url || 'unknown';
        const method = error.config?.method?.toUpperCase() || 'unknown';
        
        captureAPIError(
            `API request failed: ${error.message}`,
            {
                endpoint,
                method,
                statusCode,
                responseData: error.response?.data,
                requestData: error.config?.data,
                headers: error.config?.headers,
                additionalData: {
                    error: error.message,
                    stack: error.stack,
                    isNetworkError: !error.response,
                    isTimeout: error.code === 'ECONNABORTED',
                    timeout: error.config?.timeout,
                    baseURL: error.config?.baseURL
                }
            },
            statusCode >= 500 ? 'error' : 'warning'
        );
        
        return Promise.reject(error);
    }
);

// Build a full URL with optional query parameters
export function buildUrl(
    path: string,
    queryParams: Record<string, string | number | boolean | null | undefined> = {}
): string {
    const base = apiClient.defaults.baseURL || '/'
    const baseOrigin = base.startsWith('http')
        ? base
        : typeof window !== 'undefined'
            ? window.location.origin
            : '';

    const basePath = base.endsWith('/') ? base.slice(0, -1) : base
    const normalizedPath = path.startsWith('/') ? path : '/' + path
    const fullPath = basePath + normalizedPath

    let url: URL;
    if (baseOrigin) {
        url = new URL(fullPath, baseOrigin);
    } else {
        // If baseOrigin is empty (server-side with relative baseURL),
        // we assume fullPath is already correct relative path.
        // Append query parameters manually.
        let resultUrl = fullPath;
        const queryString = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryString.append(key, String(value));
            }
        });
        if (queryString.toString()) {
            resultUrl += '?' + queryString.toString();
        }
        return resultUrl;
    }

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value))
        }
    })

    return url.toString()
}

// Authorized request (with cookies)
export const authorizedRequest = <T = unknown>(
    options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    addBreadcrumb('Authorized request', 'api', {
        method: options.method?.toUpperCase(),
        url: options.url,
        withCredentials: true
    });
    
    return apiClient(options)
}

// Unauthorized request (no cookies)
export const unauthorizedRequest = <T = unknown>(
    options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    addBreadcrumb('Unauthorized request', 'api', {
        method: options.method?.toUpperCase(),
        url: options.url,
        withCredentials: false
    });
    
    return axios({
        ...options,
        baseURL: '/api/',
        withCredentials: false,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    })
}

// Common config builder
function buildOptions(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: unknown,
    responseType: 'json' | 'text' = 'json',
    headers: Record<string, string> = {}
): AxiosRequestConfig {
    return {
        method,
        url,
        data,
        responseType,
        headers: {
            'Content-Type': responseType === 'json' ? 'application/json' : 'text/plain',
            ...headers,
        },
    }
}

// Authorized HTTP shortcuts
export const authorized = {
    get: <T = unknown>(url: string, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        authorizedRequest<T>(buildOptions('get', url, undefined, responseType, headers)),

    post: <T = unknown>(url: string, data?: unknown, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        authorizedRequest<T>(buildOptions('post', url, data, responseType, headers)),

    put: <T = unknown>(url: string, data?: unknown, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        authorizedRequest<T>(buildOptions('put', url, data, responseType, headers)),

    delete: <T = unknown>(url: string, data?: unknown, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        authorizedRequest<T>(buildOptions('delete', url, data, responseType, headers)),
}

// Unauthorized HTTP shortcuts
export const unauthorized = {
    get: <T = unknown>(url: string, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        unauthorizedRequest<T>(buildOptions('get', url, undefined, responseType, headers)),

    post: <T = unknown>(url: string, data?: unknown, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        unauthorizedRequest<T>(buildOptions('post', url, data, responseType, headers)),

    put: <T = unknown>(url: string, data?: unknown, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        unauthorizedRequest<T>(buildOptions('put', url, data, responseType, headers)),

    delete: <T = unknown>(url: string, data?: unknown, responseType: 'json' | 'text' = 'json', headers: Record<string, string> = {}) =>
        unauthorizedRequest<T>(buildOptions('delete', url, data, responseType, headers)),
}

export const logout = async () => {
    addBreadcrumb('Logout request', 'auth', { endpoint: '/logout' });
    return authorized.post('/logout');
}
