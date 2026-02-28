/**
 * @module api
 * @file api.ts
 * @description Central API configuration for the U-Health Frontend.
 * * This module initializes a custom Axios instance tailored for communication with the Laravel backend.
 * Its primary responsibilities include:
 * 1. Base URL management for all API endpoints.
 * 2. Automatic injection of Authentication Bearer tokens via Request Interceptors.
 * 3. Centralized error handling via Response Interceptors (specifically managing 401 Unauthorized states).
 * 4. Ensuring consistent header management (JSON Accept/Content-Type).
 * * @author [Christopher Herlitz]
 * @version 1.0.0
 */

import axios from 'axios'

/**
 * Custom Axios instance with pre-defined configuration.
 * Sets the default base URL and mandatory JSON headers.
 */
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})


/**
 * Request Interceptor
 * * Executed before every outgoing request.
 * Checks the browser's LocalStorage for a 'token' and attaches it to the
 * Authorization header using the Bearer scheme if present.
 * * @param {InternalAxiosRequestConfig} config - The current Axios request configuration.
 * @returns {InternalAxiosRequestConfig} The modified configuration including Auth headers.
 * @throws {Promise<AxiosError>} Rejected promise if a request configuration error occurs.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})


/**
 * Response Interceptor
 * * Executed after a response is received from the server.
 * Provides a centralized security gateway: if the server returns a 401 (Unauthorized) status,
 * the local session is cleared and the user is redirected to the login page.
 * * @param {AxiosResponse} response - The successful response object.
 * @returns {AxiosResponse} The unmodified response object for further processing.
 * @throws {Promise<AxiosError>} Global error handler for failed requests.
 */
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
