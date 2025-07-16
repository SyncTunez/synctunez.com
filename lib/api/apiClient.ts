import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

// Axios instance with credentials
export const apiClient: AxiosInstance = axios.create({
    baseURL: '/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Build a full URL with optional query parameters
export function buildUrl(
    path: string,
    queryParams: Record<string, string | number | boolean | null | undefined> = {}
): string {
    const base = apiClient.defaults.baseURL || '/';
    const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    const fullPath = basePath + normalizedPath;

    // Always return a relative URL for internal endpoints
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

// Authorized request (with cookies)
export const authorizedRequest = <T = unknown>(
    options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    return apiClient(options)
}

// Unauthorized request (no cookies)
export const unauthorizedRequest = <T = unknown>(
    options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
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
    return authorized.post('/logout');
}
