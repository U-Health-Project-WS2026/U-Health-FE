<script setup lang="ts">
/**
 * @file HomePage.vue
 * @description The public landing page and main entry point of the U-Health application.
 * * This component serves as the initial touchpoint for users and is responsible for:
 * 1. Branding: Presenting the U-Health mission and value proposition.
 * 2. Navigation: Providing clear Call-to-Action (CTA) buttons to the authentication flow.
 * 3. Feature Overview: Highlighting the core services (Booking & History) through visual cards.
 * 4. User Experience: Implementing smooth hover transitions and entrance animations to engage users.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Triggers programmatic navigation to the login page.
 * This is the primary CTA (Call to Action) for new and returning users.
 * * @function goToLogin
 * @returns {void}
 */
function goToLogin(): void {
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
/**
 * UI Enhancements
 * Focusing on Affordance.
 */

.icon-box {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
}

/** * Hero Card Animation
 * subtle entrance to draw user's eye
 */
.hero-card {
  animation: fadeInDown 0.8s ease-out;
}

/**
 * Card Interaction Logic
 * Provides feedback that the cards are clickable navigation elements.
 */
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

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
