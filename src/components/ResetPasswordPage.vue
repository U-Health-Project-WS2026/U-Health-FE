<script setup lang="ts">
/**
 * @file ResetPasswordPage.vue
 * @description Finalizes the password recovery flow.
 * * This component:
 * 1. URL Parsing: Extracts the unique reset token and email from the route.
 * 2. New Password Submission: Sends the updated credentials to '/v1/reset-password'.
 * 3. Validation: Ensures password matching before API call.
 * * @author [Christopher Herlitz]
 * @version 1.0.0
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
 * Reactive storage for the reset request payload.
 */
const form = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  // Extract token from path: /password-reset/:token
  form.value.token = route.params.token as string
  // Extract email from query: ?email=...
  form.value.email = route.query.email as string

  if (!form.value.token || !form.value.email) {
    error.value = "Invalid or expired reset link."
  }
})

/**
 * Handles the password reset submission.
 * @async
 */
async function handleReset(): Promise<void> {
  if (form.value.password !== form.value.password_confirmation) {
    error.value = "Passwords do not match."
    return
  }

  error.value = ""
  loading.value = true

  try {
    await api.post("/v1/reset-password", form.value)
    success.value = true
    // Redirect to login after 3 seconds
    setTimeout(() => router.push('/login'), 3000)
  } catch (err: any) {
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

.form-control:focus { background-color: #fff !important;
border: 1px solid #ffc107 !important;
box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.1) !important; }

</style>
