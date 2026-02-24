import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})


// Token automatisch mitsenden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // Sicherstellen, dass payload existiert
    const parts = token.split('.')
    const base64Payload = parts.length > 1 ? parts[1] : null

    if (!base64Payload) {
      // Kein gültiger JWT
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new axios.Cancel('Token invalid')
    }

    const payload = JSON.parse(atob(base64Payload))
    const expiresAt = payload.exp * 1000

    if (Date.now() > expiresAt) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new axios.Cancel('Token expired')
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api



// Response Interceptor
// Auto-Logout beim Token-Expiry auch während des API-Calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
