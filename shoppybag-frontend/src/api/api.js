import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST || 'http://localhost:8080'
})

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if error is from login/register endpoints
    const requestUrl = error.config?.url || ''
    const isAuthEndpoint = requestUrl.includes('/api/users/signin') || requestUrl.includes('/api/users/register')
    
    // Don't redirect if on public pages
    const currentPath = window.location.pathname
    const isPublicPage = currentPath === '/' || currentPath === '/login' || currentPath === '/register'
    
    // Only handle 401 (not logged in) for protected resources
    if (error.response && error.response.status === 401 && !isAuthEndpoint && !isPublicPage) {
      // Session expired - clear token and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
