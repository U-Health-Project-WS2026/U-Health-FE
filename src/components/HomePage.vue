<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">

      <div class="row justify-content-center mb-5">
        <div class="col-lg-8 text-center">
          <div class="p-5 shadow-lg rounded-4 bg-white border-0">
            <h1 class="display-3 fw-bold text-primary mb-3">U‑Health</h1>
            <p class="lead text-muted fs-4 mb-4">
              Your health in digital hands — secure, fast, and transparent.
            </p>
            <button class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm hover-scale" @click="goToLogin">
              Get Started / Login
            </button>
          </div>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-md-5">
          <div class="card h-100 border-0 shadow-sm transition-card">
            <div class="card-body p-4 text-center">
              <div class="icon-box bg-primary-subtle text-primary mb-3 mx-auto">
                <i class="bi bi-calendar-check fs-2"></i>
              </div>
              <h3 class="card-title h4 fw-bold">Book an Appointment</h3>
              <p class="card-text text-secondary">
                Find the right time slot and book your next appointment in less than 2 minutes.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="card h-100 border-0 shadow-sm transition-card">
            <div class="card-body p-4 text-center">
              <div class="icon-box bg-success-subtle text-success mb-3 mx-auto">
                <i class="bi bi-clock-history fs-2"></i>
              </div>
              <h3 class="card-title h4 fw-bold">Treatment History</h3>
              <p class="card-text text-secondary">
                Keep track of your past diagnoses, prescribed medications, and medical reports.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Custom Styles for extra polish */

.icon-box {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
}

.transition-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.transition-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
</style>
