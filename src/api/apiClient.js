import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

function buildUrl(path, queryParams = {}) {
  const base = apiClient.defaults.baseURL || '/';
  const baseOrigin = base.startsWith('http') ? base : window.location.origin;

  const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  const fullPath = basePath + normalizedPath;

  const url = new URL(fullPath, baseOrigin);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}


// Authorized requests (send cookies)
const authorizedRequest = (options) => {
  return apiClient(options)
}

// Unauthorized requests (no cookies)
const unauthorizedRequest = (options) => {
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

// Helper to handle responseType & default Content-Type
const buildOptions = (method, url, data, responseType = 'json', headers = {}) => ({
  method,
  url,
  data,
  responseType,
  headers: {
    'Content-Type': responseType === 'json' ? 'application/json' : 'text/plain',
    ...headers,
  },
})

const authorized = {
  get: (url, responseType = 'json', headers = {}) =>
    authorizedRequest(buildOptions('get', url, undefined, responseType, headers)),
  post: (url, data, responseType = 'json', headers = {}) =>
    authorizedRequest(buildOptions('post', url, data, responseType, headers)),
  put: (url, data, responseType = 'json', headers = {}) =>
    authorizedRequest(buildOptions('put', url, data, responseType, headers)),
  delete: (url, data, responseType = 'json', headers = {}) =>
    authorizedRequest(buildOptions('delete', url, data, responseType, headers)),
}

const unauthorized = {
  get: (url, responseType = 'json', headers = {}) =>
    unauthorizedRequest(buildOptions('get', url, undefined, responseType, headers)),
  post: (url, data, responseType = 'json', headers = {}) =>
    unauthorizedRequest(buildOptions('post', url, data, responseType, headers)),
  put: (url, data, responseType = 'json', headers = {}) =>
    unauthorizedRequest(buildOptions('put', url, data, responseType, headers)),
  delete: (url, data, responseType = 'json', headers = {}) =>
    unauthorizedRequest(buildOptions('delete', url, data, responseType, headers)),
}

export default {
  authorizedRequest,
  unauthorizedRequest,
  authorized,
  unauthorized,
  apiClient,
  buildUrl
}
