<script setup lang="ts">
/**
 * @file LoginPage.vue
 * @description Authentication gateway for the U-Health application.
 * * This component provides a secure interface for users to access their accounts.
 * Core functionalities include:
 * 1. User Authentication: Submits credentials to the Laravel Sanctum backend for Opaque Token retrieval.
 * 2. Integrated Reset Flow: Implements the 'Forgot Password' trigger directly within the login context.
 * 3. Session Management: Securely stores the retrieved Opaque Token in LocalStorage.
 * 4. Reactive Feedback: Handles both success (reset link sent) and error (invalid credentials) states dynamically.
 * 5. UX States: Manages loading indicators and prevents multiple simultaneous login attempts.
 * 6. Lifecycle Navigation: Automatic redirection to the Dashboard upon successful handshake.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "@/api"
import axios from "axios"

/** @type {import('vue').Ref<string>} User's email input for authentication. */
const email = ref("")

/** @type {import('vue').Ref<string>} User's password input. */
const password = ref("")

/** @type {import('vue').Ref<string>} Stores error messages to be displayed in the UI. */
const error = ref("")

/** @type {import('vue').Ref<string>} Stores success messages, specifically for password reset confirmation. */
const successMessage = ref("")

/** @type {import('vue').Ref<boolean>} Toggles the loading state (spinner/button disabling). */
const loading = ref(false)

const router = useRouter()


/**
 * Handles the login form submission.
 * * Sends a POST request to the login endpoint. Upon success, it extracts the
 * authentication token, persists it locally, and redirects to the dashboard.
 * * @async
 * @function onLogin
 * @returns {Promise<void>}
 * @throws {AxiosError} Specifically catches 422 (Validation) or 401 (Unauthorized) errors.
 */
async function onLogin(): Promise<void> {
  error.value = ""
  successMessage.value = ""
  loading.value = true

  try {
    const response = await api.post("/v1/login", {
      email: email.value,
      password: password.value,
    })

    /** * Persistence: Save the token string.
     * The api.ts interceptor will automatically use this for future requests.
     */
    const token = response.data.token
    localStorage.setItem("token", token)

    // Smooth transition to the protected area
    await router.push("/dashboard")
  } catch (err: unknown) {
    /**
     * Centralized Error Interpretation:
     * Checks if the error is an Axios instance to provide the user with
     * a meaningful message from the backend.
     */
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message ?? "Login failed. Please check your credentials."
    } else {
      error.value = "An unexpected error occurred."
    }
  } finally {
    loading.value = false
  }
}


/**
 * Triggers the password reset email flow.
 * * Sends a POST request to '/v1/forgot-password'.
 * @async
 * @function handleForgotPassword
 */
async function handleForgotPassword(): Promise<void> {
  if (!email.value) {
    error.value = "Please enter your email address first to reset your password."
    return
  }

  error.value = ""
  loading.value = true

  try {
    const response = await api.post("/v1/forgot-password", { email: email.value })
    successMessage.value = response.data.status // "We have emailed your password reset link."
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      error.value = "We couldn't find a user with that email address."
    } else {
      error.value = "Error sending reset link. Please try again later."
    }
  } finally {
    loading.value = false
  }
}


/**
 * Programmatic navigation to the registration view.
 * @function goToRegister
 */
function goToRegister(): void {
  router.push("/register")
}
</script>


<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center bg-light px-3">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden" style="max-width: 450px; width: 100%">

      <div class="bg-primary p-4 text-center text-white">
        <h2 class="fw-bold mb-0">U‑Health</h2>
        <p class="small opacity-75 mb-0">Welcome back! Please login to your account.</p>
      </div>

      <div class="card-body p-4 p-md-5">
        <div v-if="successMessage" class="alert alert-success border-0 small mb-4">
          <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
        </div>

        <form @submit.prevent="onLogin">
          <div class="mb-3">
            <label for="email" class="form-label fw-bold small text-secondary">Email Address</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0"><i class="bi bi-envelope"></i></span>
              <input
                id="email"
                type="email"
                class="form-control bg-light border-0 p-3"
                v-model="email"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div class="mb-2">
            <label for="password" class="form-label fw-bold small text-secondary">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-0"><i class="bi bi-lock"></i></span>
              <input
                id="password"
                type="password"
                class="form-control bg-light border-0 p-3"
                v-model="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div class="text-end mb-4">
            <button type="button" @click="handleForgotPassword" class="btn btn-link p-0 text-decoration-none small fw-semibold" :disabled="loading">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 p-3 rounded-3 fw-bold shadow-sm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? "Processing..." : "Sign In" }}
          </button>

          <div v-if="error" class="alert alert-danger d-flex align-items-center mt-3 border-0 small">
            <i class="bi bi-exclamation-circle-fill me-2"></i>
            {{ error }}
          </div>
        </form>

        <hr class="my-4 text-muted opacity-25">

        <div class="text-center">
          <span class="text-muted small">Don't have an account?</span><br>
          <button class="btn btn-link fw-bold text-decoration-none" @click="goToRegister">
            Create an Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/**
 * UI Polishing & Interaction Feedback
 */
.form-control:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1) !important;
  border: 1px solid #0d6efd !important;
}

.input-group-text {
  color: #6c757d;
}

.card {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/** Visual cue for error state */
.animate-shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
