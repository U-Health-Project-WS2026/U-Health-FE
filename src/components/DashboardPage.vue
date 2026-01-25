<script setup lang="ts">
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ref } from 'vue'

const router = useRouter()

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  firstDay: 1, // Woche beginnt am Montag
  height: 450, // feste Höhe in Pixeln
  contentHeight: 400, // Höhe des Inhaltsbereichs
  events: [
    { title: 'Consultation', date: '2026-02-05' },
    { title: 'Session', date: '2026-02-12' },
  ],
})

function goToFullHistory() {
  router.push('/history')
}

function goToBookAppointment() {
  router.push('/book-appointment')
}

function goToCancelAppointment() {
  router.push('/cancel-appointment')
}

function goToUserProfile() {
  router.push('/profile')
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary mb-4">U‑Health Dashboard</h2>

    <!-- Quick Overview Row -->
    <div class="row g-4">
      <!-- Treatment History Summary -->
      <div class="col-md-6 col-lg-4">
        <div class="card border-info shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Treatment History</h5>
            <p class="card-text">A quick overview of your most recent treatments and sessions.</p>
            <button class="btn btn-outline-info w-100" @click="goToFullHistory">
              View Full History
            </button>
          </div>
        </div>
      </div>

      <!-- Appointment Calendar -->
      <div class="col-md-6 col-lg-4">
        <div
          class="card border-success shadow-sm"
          style="min-height: 500px; max-height: 70vh; overflow: hidden"
        >
          <div class="card-body d-flex flex-column h-100">
            <h5 class="card-title">Upcoming Appointments</h5>

            <!-- FullCalendar statt statischem Platzhalter -->
            <div class="flex-grow-1" style="min-height: 450px; overflow-y: auto">
              <FullCalendar :options="calendarOptions" />
            </div>

            <!-- Buttons -->
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-success flex-fill" @click="goToBookAppointment">
                Book Appointment
              </button>
              <button class="btn btn-outline-danger flex-fill" @click="goToCancelAppointment">
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="col-md-12 col-lg-4">
        <div class="card border-warning shadow-sm h-100">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">User Profile</h5>
            <p class="card-text">
              View and update your personal information, settings, and preferences.
            </p>
            <button class="btn btn-warning w-100" @click="goToUserProfile">Go To Profile</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Custom styles for spacing or text overrides*/
</style>
