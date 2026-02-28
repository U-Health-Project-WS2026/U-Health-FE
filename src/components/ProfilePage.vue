<script setup lang="ts">
/**
 * @module ProfilePage
 * @description Personal account and profile management for the patient.
 * * This component serves as the central hub for user data and security settings.
 * Main functionalities include:
 * 1. Profile Retrieval: Fetching comprehensive patient and account data via the '/v1/patients/me' endpoint.
 * 2. Data Transformation: Converting raw backend codes (e.g., sex ID) into human-readable labels.
 * 3. Session Management: Providing a secure logout mechanism by clearing local storage.
 * 4. Security Controls: Password update functionality with real-time feedback.
 * 5. Error Handling: Intercepting session expiration (401) and validation errors.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import axios from 'axios'


/**
 * @interface UserInfo
 * @description Nested object containing core authentication and identity details.
 */
interface UserInfo {
  user_id: number;
  username: string;
  email: string;
}

/**
 * @interface PatientData
 * @description Complete patient record including personal demographics and linked user account info.
 */
interface PatientData {
  patient_id: number;
  first_name: string;
  last_name: string;
  age: number;
  sex: number;
  location: string;
  user_info: UserInfo;
}

const router = useRouter()

/** @type {import('vue').Ref<PatientData|null>} Reactive storage for the fetched patient profile. */
const patient = ref<PatientData | null>(null)

/** @type {import('vue').Ref<boolean>} UI state for the loading spinner. */
const loading = ref(true)

/** @type {import('vue').Ref<string>} Error message storage for API or Auth failures. */
const error = ref('')

/** @type {import('vue').Ref<boolean>} UI state for the password update button. */
const passwordLoading = ref(false)

/** * @type {import('vue').Ref<Object>}
 * Reactive object for password change form inputs, matching the backend's expected schema.
 */
const passwordData = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})


/**
 * Utility function to map numerical sex codes to readable strings.
 * * @param {number} sex - The code from the database (0, 1, or 2).
 * @returns {string} The corresponding label: 'Male', 'Female', 'Diverse', or 'Unknown'.
 */
const getSexLabel = (sex: number): string => {
  const labels: Record<number, string> = { 1: 'Male', 0: 'Female', 2: 'Diverse' }
  return labels[sex] || 'Unknown'
}

/**
 * Fetches the current user's profile from the backend.
 * Uses the centralized 'api' instance which automatically injects the Bearer token.
 * * @async
 * @function fetchProfile
 * @returns {Promise<void>}
 */
const fetchProfile = async (): Promise<void> => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/v1/patients/me')
    patient.value = response.data.data
  } catch (err: any) {
    console.error("Profile Fetch Error Details:", err.response || err)

    if (err.response?.status === 401) {
      error.value = "Your session has expired. Please log in again."
    } else {
      error.value = err.response?.data?.message || 'Connection to server failed.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Terminates the user session.
 * Removes the authentication token from LocalStorage and redirects to the Login page.
 * @function handleLogout
 */
const handleLogout = (): void => {
  localStorage.removeItem('token')
  router.push('/login')
}


/**
 * Handles the password change request.
 * 1. Validates that the new password and confirmation match.
 * 2. Submits the current and new password to the security endpoint.
 * 3. Clears the form on success.
 * * @async
 * @function changePassword
 * @returns {Promise<void>}
 */
const changePassword = async (): Promise<void> => {
  // Client-side Validation
  if (passwordData.value.password !== passwordData.value.password_confirmation) {
    alert('New passwords do not match!')
    return
  }

  passwordLoading.value = true

  try {
    /** * API Call to the dedicated password change endpoint.
     * Token injection is handled automatically by api.ts interceptors.
     */
    const response = await api.post('/v1/change-current-password', {
      current_password: passwordData.value.current_password,
      password: passwordData.value.password,
      password_confirmation: passwordData.value.password_confirmation
    })

    alert(response.data.message || 'Password successfully updated!')

    // Clear form fields after success
    passwordData.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } catch (err: any) {
    /**
     * Error Handling: Displays specific validation errors from the backend
     * (e.g., "Current password incorrect").
     */
    if (axios.isAxiosError(err)) {
      alert('Error: ' + (err.response?.data?.message || 'Password update failed.'))
    } else {
      alert('An unexpected error occurred.')
    }
  } finally {
    passwordLoading.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">

      <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 50vh;">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div class="alert alert-danger shadow-sm rounded-4 p-4">
            <i class="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
            <h4>Authentication Error</h4>
            <p>{{ error }}</p>
            <button class="btn btn-primary rounded-pill px-4 mt-2" @click="router.push('/login')">
              Back to Login
            </button>
          </div>
        </div>
      </div>

      <div v-else class="row g-4 justify-content-center">

        <div class="col-lg-7">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="card-header bg-primary p-4 border-0">
              <div class="d-flex align-items-center">
                <div class="icon-circle bg-white text-primary me-3">
                  <i class="bi bi-person-fill fs-2"></i>
                </div>
                <div class="text-white">
                  <h3 class="mb-0 fw-bold">{{ patient?.first_name }} {{ patient?.last_name }}</h3>
                  <p class="mb-0 opacity-75">Patient Account #{{ patient?.patient_id }}</p>
                </div>
              </div>
            </div>

            <div class="card-body p-4 bg-white">
              <h5 class="fw-bold mb-4 text-secondary text-uppercase small letter-spacing">Personal Information</h5>

              <div class="row g-4">
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Username</label>
                    <span class="fw-bold text-dark">@{{ patient?.user_info.username }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Email Address</label>
                    <span class="fw-bold text-dark">{{ patient?.user_info.email }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Age</label>
                    <span class="fw-bold text-dark">{{ patient?.age }} Years</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Sex</label>
                    <span class="fw-bold text-dark">{{ getSexLabel(patient?.sex || 0) }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Location</label>
                    <span class="fw-bold text-dark">{{ patient?.location }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-5 pt-3 border-top">
                <button @click="handleLogout" class="btn btn-outline-danger px-4 rounded-pill shadow-sm">
                  <i class="bi bi-box-arrow-right me-2"></i>Logout from U-Health
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-lg rounded-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-4">
                <i class="bi bi-shield-lock-fill text-warning fs-3 me-2"></i>
                <h5 class="fw-bold mb-0">Security</h5>
              </div>

              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label class="form-label small fw-bold">Current Password</label>
                  <input v-model="passwordData.current_password" type="password" class="form-control bg-light border-0 p-3 rounded-3" placeholder="••••••••">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">New Password</label>
                  <input v-model="passwordData.password" type="password" class="form-control bg-light border-0 p-3 rounded-3" placeholder="••••••••">
                </div>
                <div class="mb-4">
                  <label class="form-label small fw-bold">Confirm New Password</label>
                  <input v-model="passwordData.password_confirmation" type="password" class="form-control bg-light border-0 p-3 rounded-3" placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-primary w-100 p-3 rounded-3 fw-bold">
                  Update Password
                </button>
              </form>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 mt-4 bg-info-subtle text-info-emphasis">
            <div class="card-body p-4">
              <h6 class="fw-bold"><i class="bi bi-info-circle-fill me-2"></i>Data Privacy</h6>
              <p class="small mb-0 text-secondary">
                Your medical data is encrypted and only visible to authorized healthcare providers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Icon Branding */
.icon-circle {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.letter-spacing {
  letter-spacing: 1px;
}

/* Enhanced Focus States */
.form-control:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border: 1px solid #0d6efd !important;
}

/* Card Interactivity */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

</style>
