<script setup lang="ts">
/**
 * @file HomePage.vue
 * @description The public landing page and main entry point of the U-Health application.
 * * This component serves as the initial touchpoint for users and is responsible for:
 * 1. Branding: Presenting the U-Health mission and value proposition.
 * 2. Navigation: Providing clear Call-to-Action (CTA) buttons to the authentication flow.
 * 3. Feature Overview: Highlighting core services (Booking & History) via professional feature cards.
 * 4. User Experience: Utilizing entrance animations and micro-interactions for high engagement.
 * * @author [Christopher Herlitz]
 * @version 1.2.0
 */

import { useRouter } from 'vue-router'

/** @type {import('vue-router').Router} Router instance for navigation. */
const router = useRouter()

/**
 * Triggers programmatic navigation to the login page.
 * Primary CTA for onboarding new users or returning patients.
 * * @function goToLogin
 * @returns {void}
 */
function goToLogin(): void {
  router.push('/login')
}

/**
 * Navigates the user to the registration interface.
 * * @function goToRegister
 * @returns {void}
 */
function goToRegister(): void {
  router.push('/register')
}
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">

      <div class="row justify-content-center mb-5 hero-card">
        <div class="col-lg-9 text-center">
          <div class="p-5 shadow-lg rounded-4 bg-white border-0">
            <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3 fw-bold">Healthcare Universität Tübingen</span>
            <h1 class="display-3 fw-bold text-primary mb-3">U‑Health</h1>
            <p class="lead text-secondary fs-4 mb-4">
              Empowering your wellness through digital innovation. <br class="d-none d-md-block">
              Access your medical journey — <strong>secure, seamless, and patient-centered.</strong>
            </p>
            <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
              <button class="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm hover-scale fw-bold" @click="goToLogin">
                Access Portal
              </button>
              <button class="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill fw-bold" @click="goToRegister">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-md-5">
          <div class="card h-100 border-0 shadow-sm transition-card" @click="goToLogin">
            <div class="card-body p-4 text-center">
              <div class="icon-box bg-primary-subtle text-primary mb-3 mx-auto">
                <i class="bi bi-calendar-plus fs-2"></i>
              </div>
              <h3 class="card-title h4 fw-bold">Smart Scheduling</h3>
              <p class="card-text text-secondary">
                Take control of your time. Browse available slots and book your next consultation instantly, without the wait.
              </p>
              <div class="text-primary fw-semibold small mt-2">Check Availability <i class="bi bi-arrow-right"></i></div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="card h-100 border-0 shadow-sm transition-card" @click="router.push('/history')">
            <div class="card-body p-4 text-center">
              <div class="icon-box bg-success-subtle text-success mb-3 mx-auto">
                <i class="bi bi-shield-check fs-2"></i>
              </div>
              <h3 class="card-title h4 fw-bold">Health Archive</h3>
              <p class="card-text text-secondary">
                Your medical integrity is our priority. Securely access your past diagnoses, medications, and reports anytime, anywhere.
              </p>
              <div class="text-success fw-semibold small mt-2">View Records <i class="bi bi-arrow-right"></i></div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <p class="text-muted small">
          <i class="bi bi-lock-fill me-1"></i> Data protected by industry-standard encryption.
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/**
 * UI Enhancements
 */

 /* Container for feature icons with rounded corners */
.icon-box {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
}

/** * Animation: Entrance
 * slide-down and fade-in for the main hero element.
 */
.hero-card {
  animation: fadeInDown 0.8s ease-out;
}

/**
 * Interactive State: Feature Cards
 * Using a cubic-bezier for a "bouncy" and modern feel on hover.
 */
.transition-card {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
  cursor: pointer;
}

.transition-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 1.5rem 3rem rgba(0,0,0,.08) !important;
}

/* Micro-interaction for CTA buttons */
.hover-scale {
  transition: transform 0.2s ease, background-color 0.2s ease;
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
