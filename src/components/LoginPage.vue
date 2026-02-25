<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%">
      <div class="card-body p-4">
        <h3 class="card-title text-center mb-3">Login</h3>

        <form @submit.prevent="onLogin">
          <!-- E-Mail -->
          <div class="mb-3">
            <label for="email" class="form-label">E-Mail</label>
            <input
              id="email"
              type="email"
              class="form-control"
              v-model="email"
              required
            />
          </div>

          <!-- Passwort -->
          <div class="mb-3">
            <label for="password" class="form-label">Passwort</label>
            <input
              id="password"
              type="password"
              class="form-control"
              v-model="password"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            {{ loading ? "Login..." : "Einloggen" }}
          </button>

          <!-- Fehleranzeige -->
          <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>
        </form>

        <!-- Link zur Registrierung -->
        <div class="text-center mt-3">
          <span>Noch nicht registriert?</span>
          <button class="btn btn-link p-0" @click="goToRegister">
            Jetzt registrieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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

    const token = response.data.token
    localStorage.setItem("token", token)
    await router.push("/dashboard")

    router.push("/dashboard")
  } catch (err: unknown) {


    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message ?? "Login fehlgeschlagen."
    } else {
      error.value = "Ein unerwarteter Fehler ist aufgetreten."
    }




  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push("/register")
}
</script>

<style scoped>
/* optional weitere Styles */
</style>
