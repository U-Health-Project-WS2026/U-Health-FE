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
  <p>Test – App läuft</p>

  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

  <div id="app">
    <!-- Navigation -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
    </nav>

    <!-- Hier zeigt der Router die jeweils passende View an -->
    <router-view />
  </div>

  <!-- Button -->
  <!-- <button @click="goToLogin">Login</button> -->
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
