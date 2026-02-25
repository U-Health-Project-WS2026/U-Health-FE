<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const currentYear = new Date().getFullYear()
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">

    <nav v-if="route.meta.showNav" class="navbar navbar-expand-lg navbar-dark bg-primary px-3 shadow-sm">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold" to="/">U-Health</router-link>

        <div class="navbar-nav me-auto">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link v-if="!route.meta.requiresAuth" class="nav-link" to="/login">Login</router-link>
          <router-link v-if="route.meta.requiresAuth" class="nav-link" to="/dashboard">Dashboard</router-link>
        </div>

        <button
          v-if="route.meta.showProfile"
          class="btn btn-light d-flex align-items-center rounded-pill px-3 shadow-sm"
          @click="$router.push('/profile')"
        >
          <i class="bi bi-person-circle me-2"></i>
          Profile
        </button>
      </div>
    </nav>

    <main class="flex-grow-1">
      <router-view />
    </main>

    <footer class="bg-white border-top py-4 mt-auto">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-4 text-center text-md-start">
            <span class="fw-bold text-primary">U-Health</span>
            <p class="text-muted small mb-0">&copy; {{ currentYear }} Digital Medical Solutions</p>
          </div>

          <div class="col-md-4 text-center my-3 my-md-0">
            <div class="d-flex justify-content-center gap-3">
              <a href="#" class="text-muted text-decoration-none small">Privacy Policy</a>
              <a href="#" class="text-muted text-decoration-none small">Terms of Service</a>
              <a href="#" class="text-muted text-decoration-none small">Support</a>
            </div>
          </div>

          <div class="col-md-4 text-center text-md-end">
            <div class="text-muted small">
              <i class="bi bi-shield-check text-success me-1"></i>
              SSL Encrypted Data
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Sticky Footer Logik */
#app {
  background-color: #f8f9fa; /* Einheitlicher Hintergrund für die gesamte App */
}

.navbar-brand {
  letter-spacing: 0.5px;
}

.nav-link {
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

/* Footer Styling */
footer {
  transition: all 0.3s ease;
}

footer a:hover {
  color: #0d6efd !important;
}
</style>
