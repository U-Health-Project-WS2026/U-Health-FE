<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-sm" style="max-width: 600px; width: 100%">
      <div class="card-body p-4">
        <h3 class="text-center mb-3">Registrierung</h3>

        <form @submit.prevent="onRegister">

          <!-- Username -->
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input v-model="username" type="text" class="form-control" required />
          </div>

          <!-- Vorname -->
          <div class="mb-3">
            <label class="form-label">Vorname</label>
            <input v-model="firstName" type="text" class="form-control" required />
          </div>

          <!-- Nachname -->
          <div class="mb-3">
            <label class="form-label">Nachname</label>
            <input v-model="lastName" type="text" class="form-control" required />
          </div>

          <!-- Age -->
          <div class="mb-3">
            <label class="form-label">Alter</label>
            <input v-model="age" type="number" class="form-control" min="0" required />
          </div>

          <!-- Sex (Biologisch) -->
          <div class="mb-3">
            <label class="form-label">Sex</label>
            <select v-model="sex" class="form-select" required>
              <option value="" disabled>Bitte wählen</option>
              <option value="male">Männlich</option>
              <option value="female">Weiblich</option>
              <option value="other">Andere</option>
            </select>
          </div>

          <!-- Location -->
          <div class="mb-3">
            <label class="form-label">Location</label>
            <input v-model="location" type="text" class="form-control" placeholder="Deutschland" required />
          </div>

          <!-- E-Mail -->
          <div class="mb-3">
            <label class="form-label">E-Mail</label>
            <input v-model="email" type="email" class="form-control" required />
          </div>

          <!-- Passwort -->
          <div class="mb-3">
            <label class="form-label">Passwort</label>
            <input v-model="password" type="password" class="form-control" required minlength="6" />
          </div>

          <!-- Passwort Bestätigung -->
          <div class="mb-3">
            <label class="form-label">Passwort bestätigen</label>
            <input
              v-model="passwordConfirmation"
              type="password"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-success w-100" :disabled="loading">
            {{ loading ? "Registriere..." : "Registrieren" }}
          </button>

          <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>
          <p v-if="success" class="text-success text-center mt-2">{{ success }}</p>
        </form>

        <div class="text-center mt-3">
          <span>Schon registriert?</span>
          <button class="btn btn-link" @click="goToLogin">Login</button>
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


const username = ref("")
const firstName = ref("")
const lastName = ref("")
const age = ref<number | null>(null)
const sex = ref("")
const location = ref("")
const email = ref("")
const password = ref("")
const passwordConfirmation = ref("")
const error = ref("")
const success = ref("")
const loading = ref(false)

const router = useRouter()

async function onRegister() {
  error.value = ""
  success.value = ""
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

    success.value = "Registrierung erfolgreich! Du kannst dich jetzt einloggen."
  } catch (err: unknown) {


    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message ?? "Registrierung fehlgeschlagen."
    } else {
      error.value = "Ein unerwarteter Fehler ist aufgetreten."
    }



  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push("/login")
}
</script>
