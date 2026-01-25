<script setup lang="ts">
//import { useRouter } from 'vue-router'
//
//const router = useRouter()
//
//function goToLogin() {
//  router.push('/login')
//}
</script>

<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div class="container-fluid">
        <!-- Links left -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>

        <!-- Profil-Button oben rechts -->
        <button
          class="btn btn-outline-primary d-flex align-items-center"
          @click="$router.push('/profile')"
        >
          <i class="bi bi-person-square me-1"></i>
          Profile
        </button>
      </div>
    </nav>

    <!-- Hier zeigt der Router die jeweils passende View an -->
    <router-view />
  </div>
</template>

<style scoped>
/* einfache Styles für die Navigation */
nav {
  padding: 1rem;
  background-color: #f0f0f0;
  display: flex;
  gap: 1rem;
}

router-link {
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
}

router-link.router-link-active {
  text-decoration: underline;
}
</style>
