<script setup lang="ts">
/**
 * @module ResetPasswordPage
 * @description Finalizes the password recovery flow for the U-Health platform.
 * * This component acts as the landing page for users arriving from an email reset link.
 * Core responsibilities include:
 * 1. URL Parameter Extraction: Parses the 'token' from the path and 'email' from query strings.
 * 2. Input Validation: Enforces client-side matching of the new password and its confirmation.
 * 3. Secure Submission: Communicates with the '/v1/reset-password' endpoint using the provided token.
 * 4. UX Management: Displays success states and handles automatic redirection to the login gateway.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

/** @type {import('vue').Ref<boolean>} UI state for the loading spinner during the reset process. */
const loading = ref(false)

/** @type {import('vue').Ref<string>} Stores error messages (e.g., mismatching passwords or expired tokens). */
const error = ref('')

/** @type {import('vue').Ref<boolean>} Flag to switch the UI to a success state after a successful reset. */
const success = ref(false)

/** * @type {import('vue').Ref<Object>}
 * Reactive data model for the password reset request, matching the Laravel backend requirements.
 */
const form = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
})


/**
 * Lifecycle hook: Initializes the form data by reading the route state.
 * Validates the presence of required parameters (token and email) immediately.
 */
onMounted(() => {
  // Path parameter extraction: defined as /password-reset/:token in the router
  form.value.token = route.params.token as string
  // Query parameter extraction: expected as ?email=... in the URL
  form.value.email = route.query.email as string

  if (!form.value.token || !form.value.email) {
    error.value = "Invalid or expired reset link."
  }
})


/**
 * Handles the submission of the new password.
 * Performs client-side matching before initiating the API request.
 * * @async
 * @function handleReset
 * @returns {Promise<void>}
 */
async function handleReset(): Promise<void> {
  // Client-side pre-flight check
  if (form.value.password !== form.value.password_confirmation) {
    error.value = "Passwords do not match."
    return
  }

  error.value = ""
  loading.value = true

  try {
    /** * API Call to the password reset endpoint.
     * Expected Response: { "status": "Your password has been reset." }
     */
    await api.post("/v1/reset-password", form.value)
    success.value = true

    // Redirect to login after 3 seconds
    setTimeout(() => router.push('/login'), 3000)
  } catch (err: any) {
    /**
     * Error Handling:
     * Catches 422 for expired tokens or 500 for server issues.
     */
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      error.value = err.response.data.message || "Failed to reset password. The link may have expired."
    } else {
      error.value = "A server error occurred. Please try again later."
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center bg-light px-3">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden" style="max-width: 450px; width: 100%">

      <div class="bg-warning p-4 text-center text-dark">
        <h2 class="fw-bold mb-0">Reset Password</h2>
        <p class="small opacity-75 mb-0">Please enter your new security credentials.</p>
      </div>

      <div class="card-body p-4 p-md-5">
        <div v-if="success" class="text-center py-3">
          <div class="icon-box bg-success-subtle text-success mx-auto mb-3">
            <i class="bi bi-check-lg fs-1"></i>
          </div>
          <h4 class="fw-bold">Success!</h4>
          <p class="text-muted">Your password has been reset. Redirecting to login...</p>
        </div>

        <form v-else @submit.prevent="handleReset">
          <div class="mb-3">
            <label class="form-label fw-bold small text-secondary">Email</label>
            <input type="email" class="form-control bg-light border-0 p-3" v-model="form.email" disabled />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold small text-secondary">New Password</label>
            <input type="password" class="form-control bg-light border-0 p-3" v-model="form.password" placeholder="••••••••" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold small text-secondary">Confirm New Password</label>
            <input type="password" class="form-control bg-light border-0 p-3" v-model="form.password_confirmation" placeholder="••••••••" required />
          </div>

          <button type="submit" class="btn btn-warning w-100 p-3 rounded-3 fw-bold shadow-sm" :disabled="loading || !!error">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Update Password
          </button>

          <div v-if="error" class="alert alert-danger mt-3 border-0 small">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<style scoped>
.icon-box {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; }

  /* Enhanced Focus States for better UX */
.form-control:focus {
  background-color: #fff !important;
  border: 1px solid #ffc107 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.1) !important;
}

.input-group-text {
  color: #6c757d;
}

.bg-success-subtle {
  background-color: #d1e7dd;
}

</style>
