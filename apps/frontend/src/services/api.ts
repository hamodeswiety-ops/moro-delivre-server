import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient

export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  // Dream Projects
  projects: {
    create: '/v1/dream-projects',
    list: '/v1/dream-projects',
    get: (id: string) => `/v1/dream-projects/${id}`,
    update: (id: string) => `/v1/dream-projects/${id}`,
    delete: (id: string) => `/v1/dream-projects/${id}`,
    stats: '/v1/dream-projects/stats',
  },
  // Materials
  materials: {
    list: '/v1/materials',
    get: (id: string) => `/v1/materials/${id}`,
    search: '/v1/materials/search',
    eco: '/v1/materials/eco-friendly',
    priceRange: '/v1/materials/price-range',
  },
  // Pricing
  pricing: {
    basePrice: '/v1/pricing/base-price',
    fullCost: '/v1/pricing/full-cost',
    paymentPlans: '/v1/pricing/payment-plans',
    financing: '/v1/pricing/financing-options',
    addOns: '/v1/pricing/addons',
  },
}
