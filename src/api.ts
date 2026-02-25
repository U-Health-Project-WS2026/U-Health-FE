import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})


// Request Interceptor: Token mitsenden
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})



// Response Interceptor: Fehlerbehandlung (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Wenn der Server 401 meldet, ist der Token abgelaufen oder ungültig
    if (error.response?.status === 401) {
      console.warn("Sitzung abgelaufen oder nicht autorisiert.")
      localStorage.removeItem('token')

      // Nur umleiten, wenn wir nicht sowieso schon auf der Login-Seite sind
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
