<script setup lang="ts">
/**
 * @file App.vue
 * @description The Root Component of the U-Health application.
 * * This component acts as the main layout wrapper and is responsible for:
 * 1. Global Layout Structure: Implementing a "Sticky Footer" using Flexbox (min-vh-100).
 * 2. Conditional Navigation: Rendering the Navbar based on route metadata (`showNav`).
 * 3. Authentication-Aware UI: Displaying specific links (Dashboard vs. Login) and the
 * Profile button based on the user's authentication state and route meta tags.
 * 4. Dynamic Content Rendering: Providing the main `<router-view />` for page transitions.
 * 5. Global Footer: Displaying consistent branding and legal links.
 * * @requires vue-router - For route-based conditional rendering and navigation.
 */

import { useRoute } from 'vue-router'

/** @type {Object} The current route object provided by Vue Router to access metadata. */
const route = useRoute()

/** @type {number} Dynamically calculated current year for the copyright notice in the footer. */
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
            <p class="text-muted small mb-0">&copy; {{ currentYear }} Universität Tübingen</p>
          </div>

          <div class="col-md-4 text-center my-3 my-md-0">
            <div class="d-flex justify-content-center gap-3">
              <a href="#" class="text-muted text-decoration-none small">Privacy Policy</a>
              <a href="#" class="text-muted text-decoration-none small">Terms of Service</a>
              <a href="#" class="text-muted text-decoration-none small">Support</a>
            </div>
          </div>


        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Sticky Footer Logic:
  The #app container uses min-vh-100 to ensure it always spans at least the full viewport height.
  The flex-grow-1 on <main> ensures it takes up all available space.
*/
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
