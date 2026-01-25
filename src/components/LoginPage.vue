<!--<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="onLogin">
      <div>
        <label for="email">E-Mail</label>
        <input id="email" type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Passwort</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit">Einloggen</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
-->

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%">
      <div class="card-body p-4">
        <h3 class="card-title text-center mb-3">Login</h3>

        <form @submit.prevent="onLogin">
          <!-- E‑Mail -->
          <div class="mb-3">
            <label for="email" class="form-label">E‑Mail</label>
            <input id="email" type="email" class="form-control" v-model="email" required />
          </div>

          <!-- Passwort -->
          <div class="mb-3">
            <label for="password" class="form-label">Passwort</label>
            <input id="password" type="password" class="form-control" v-model="password" required />
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100">Einloggen</button>

          <!-- Fehleranzeige -->
          <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()

async function onLogin() {
  error.value = ''
  try {
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    })
    const token = response.data.token
    localStorage.setItem('token', token)
    // optional: setze in Pinia-Store, falls du Auth-State global speichern willst
    router.push('/timeslots') // nach dem Login weiterleiten
  } catch (e) {
    error.value = 'Login fehlgeschlagen. Bitte versuche es erneut.'
    console.error(e)
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-page label {
  display: block;
  margin-bottom: 0.5rem;
}

.login-page input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.login-page button {
  padding: 0.6rem 1.2rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
