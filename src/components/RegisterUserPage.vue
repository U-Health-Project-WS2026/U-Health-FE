<script setup lang="ts">
/**
 * @file RegisterUserPage.vue
 * @description User Registration interface for the U-Health platform.
 * * This component manages the creation of new patient accounts.
 * Core responsibilities include:
 * 1. Data Collection: Capturing personal details (Name, Age, Sex, Location) and account credentials.
 * 2. Input Validation: Ensuring password matches password confirmation before API submission.
 * 3. Asynchronous Submission: Sending structured data to the '/v1/register' endpoint.
 * 4. User Guidance: Providing feedback for successful registration and error handling for failed attempts.
 * 5. Automatic Redirection: Navigating the user to the login page after successful signup.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "@/api"
import axios from "axios"

// --- Reactive Form State Variables ---
/** @type {import('vue').Ref<string>} Unique username for the account. */
const username = ref("")

/** @type {import('vue').Ref<string>} Patient's legal first name. */
const firstName = ref("")

/** @type {import('vue').Ref<string>} Patient's legal last name. */
const lastName = ref("")

/** @type {import('vue').Ref<number|null>} Patient's age (numeric input). */
const age = ref<number | null>(null)

/** @type {import('vue').Ref<number|null>} Biological sex code (0=Female, 1=Male, 2=Diverse). */
const sex = ref<number | null>(null)

/** @type {import('vue').Ref<string>} Geographic location or country. */
const location = ref("")

/** @type {import('vue').Ref<string>} Primary contact email address. */
const email = ref("")

/** @type {import('vue').Ref<string>} Account password (min 6 characters). */
const password = ref("")

/** @type {import('vue').Ref<string>} Verification field for the password. */
const passwordConfirmation = ref("")


// --- UI & Feedback State ---
/** @type {import('vue').Ref<string>} Stores backend or validation error messages. */
const error = ref("")
/** @type {import('vue').Ref<string>} Stores success messages upon account creation. */
const success = ref("")
/** @type {import('vue').Ref<boolean>} Indicates if the registration request is in progress. */
const loading = ref(false)

const router = useRouter()


/**
 * Handles the registration form submission.
 * Performs a client-side password match check before initiating the API call.
 * On success, it displays a message and redirects the user after a short delay.
 * * @async
 * @function onRegister
 * @returns {Promise<void>}
 */
async function onRegister(): Promise<void> {
  error.value = ""
  success.value = ""

  // Client-side Validation: Integrity check for passwords
  if (password.value !== passwordConfirmation.value) {
    error.value = "Passwords do not match."
    return
  }

  loading.value = true

  try {
    await api.post("/v1/register", {
      username: username.value,
      first_name: firstName.value,
      last_name: lastName.value,
      age: age.value,
      sex: sex.value,
      location: location.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    success.value = "Registration successful! Redirecting to login..."

    // UX: Give the user time to read the success message before redirecting
    setTimeout(() => router.push("/login"), 2000)
  } catch (err: unknown) {
    /**
     * Error Handling:
     * Differentiates between Axios-specific errors (e.g., 422 Unprocessable Content)
     * and unexpected system failures.
     */
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message ?? "Registration failed."
    } else {
      error.value = "An unexpected error occurred."
    }
  } finally {
    loading.value = false
  }
}


/**
 * Programmatic navigation back to the login view.
 * @function goToLogin
 */
function goToLogin(): void {
  router.push("/login")
}
</script>

<template>
  <div class="min-vh-100 d-flex justify-content-center align-items-center bg-light py-5 px-3">
    <div class="card border-0 shadow-lg rounded-4 overflow-hidden" style="max-width: 800px; width: 100%">

      <div class="row g-0">
        <div class="col-lg-4 bg-primary d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-4">
          <i class="bi bi-person-plus fs-1 mb-3"></i>
          <h3 class="fw-bold">Join U‑Health</h3>
          <p class="text-center opacity-75 small">Secure your health data and manage your medical appointments digitally.</p>
        </div>

        <div class="col-lg-8 bg-white p-4 p-md-5">
          <h3 class="fw-bold mb-4 text-center text-lg-start">Create Account</h3>

          <form @submit.prevent="onRegister">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-bold small text-secondary text-uppercase">Account Basics</label>
              </div>

              <div class="col-md-6">
                <input v-model="username" type="text" class="form-control bg-light border-0 p-3" placeholder="Username" required />
              </div>

              <div class="col-md-6">
                <input v-model="email" type="email" class="form-control bg-light border-0 p-3" placeholder="Email Address" required />
              </div>

              <div class="col-12 mt-4">
                <label class="form-label fw-bold small text-secondary text-uppercase">Personal Information</label>
              </div>

              <div class="col-md-6">
                <input v-model="firstName" type="text" class="form-control bg-light border-0 p-3" placeholder="First Name" required />
              </div>

              <div class="col-md-6">
                <input v-model="lastName" type="text" class="form-control bg-light border-0 p-3" placeholder="Last Name" required />
              </div>

              <div class="col-md-4">
                <input v-model="age" type="number" class="form-control bg-light border-0 p-3" placeholder="Age" min="0" required />
              </div>

              <div class="col-md-4">
                <select v-model="sex" class="form-select bg-light border-0 p-3" required>
                  <option :value="null" disabled>Sex</option>
                  <option :value="1">Male</option>
                  <option :value="0">Female</option>
                  <option :value="2">Diverse</option>
                </select>
              </div>

              <div class="col-md-4">
                <input v-model="location" type="text" class="form-control bg-light border-0 p-3" placeholder="Location" required />
              </div>

              <div class="col-12 mt-4">
                <label class="form-label fw-bold small text-secondary text-uppercase">Security</label>
              </div>

              <div class="col-md-6">
                <input v-model="password" type="password" class="form-control bg-light border-0 p-3" placeholder="Password" required minlength="6" />
              </div>

              <div class="col-md-6">
                <input v-model="passwordConfirmation" type="password" class="form-control bg-light border-0 p-3" placeholder="Confirm Password" required />
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mt-4 border-0 small">
              <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
            </div>
            <div v-if="success" class="alert alert-success mt-4 border-0 small">
              <i class="bi bi-check-circle me-2"></i> {{ success }}
            </div>

            <div class="mt-5">
              <button type="submit" class="btn btn-primary w-100 p-3 rounded-3 fw-bold shadow-sm" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? "Creating Account..." : "Register Now" }}
              </button>

              <div class="text-center mt-4">
                <span class="text-muted small">Already a member?</span>
                <button type="button" class="btn btn-link fw-bold text-decoration-none" @click="goToLogin">Sign In</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/** * Focus states and Animations
 */
.form-control:focus, .form-select:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1) !important;
  border: 1px solid #0d6efd !important;
}

.card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.letter-spacing {
  letter-spacing: 0.5px;
}
</style>
