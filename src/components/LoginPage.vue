<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "@/api"
import axios from "axios"

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)
const router = useRouter()

async function onLogin() {
  error.value = ""
  loading.value = true

  try {
    const response = await api.post("/v1/login", {
      email: email.value,
      password: password.value,
    })

    // WICHTIG: Sicherstellen, dass nur der String gespeichert wird
    const token = response.data.token
    localStorage.setItem("token", token)

    // Weiterleitung zum Dashboard
    await router.push("/dashboard")
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message ?? "Login failed. Please check your credentials."
    } else {
      error.value = "An unexpected error occurred."
    }
  } finally {
    loading.value = false
  }
}

function handleForgotPassword() {
  if (!email.value) {
    alert("Please enter your email address first.")
    return
  }
  // Hier käme dein API-Call für den Password-Reset hin
  alert(`A reset link has been sent to: ${email.value} (Mockup function)`)
}

function goToRegister() {
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
            <button type="button" @click="handleForgotPassword" class="btn btn-link p-0 text-decoration-none small fw-semibold">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 p-3 rounded-3 fw-bold shadow-sm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? "Signing in..." : "Sign In" }}
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
</style>
