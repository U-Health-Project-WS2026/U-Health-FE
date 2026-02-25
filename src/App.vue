<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div id="app">
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
          class="btn btn-light d-flex align-items-center rounded-pill px-3"
          @click="$router.push('/profile')"
        >
          <i class="bi bi-person-circle me-2"></i>
          Profile
        </button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>

.navbar-brand {
  letter-spacing: 0.5px;
}

.nav-link {
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}
</style>
