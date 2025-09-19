import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    
    // Transform error for better UX
    if (error.response?.data?.message) {
      error.message = error.response.data.message
    } else if (error.response?.status === 404) {
      error.message = 'Resource not found'
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please try again later.'
    } else if (!error.message) {
      error.message = 'An unexpected error occurred'
    }
    
    return Promise.reject(error)
  }
)
