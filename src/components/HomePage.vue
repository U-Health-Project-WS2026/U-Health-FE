<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<!-- Altes Design -->
<!-- <template>
  <div class="home">
    <h1>Welcome to U‑Health!</h1>
    <p>
      Visit
      <a href="https://vuejs.org/" target="_blank" rel="noopener">
        vuejs.org
      </a>
      to read the documentation.
    </p>

    <button @click="goToLogin">Go to Login</button>
  </div>
</template> -->

<template>
  <div class="container text-center mt-5">
    <!-- Hero‑Bereich -->
    <div class="p-5 bg-light rounded shadow-sm">
      <h1 class="display-4 text-primary">Welcome to U‑Health!</h1>
      <p class="lead text-secondary">
        Keep track of your health — easily, digitally, and conveniently.
      </p>

      <button class="btn btn-primary btn-lg" @click="goToLogin">To log in</button>
    </div>

    <!-- Feature‑Sektion -->
    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card border-info mb-3">
          <div class="card-body">
            <h5 class="card-title">Book an appointment</h5>
            <p class="card-text">Book your next appointment quickly and easily online.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-success mb-3">
          <div class="card-body">
            <h5 class="card-title">Find a doctor</h5>
            <p class="card-text">Find the right doctors and specialties.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-warning mb-3">
          <div class="card-body">
            <h5 class="card-title">Health information</h5>
            <p class="card-text">Get valuable tips on all aspects of your health.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 2rem;
}

button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
}
</style>
