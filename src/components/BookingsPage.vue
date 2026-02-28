<script setup lang="ts">
/**
 * @module BookingsPage
 * @description Interface for discovering and booking new medical appointments.
 * * This component provides the following functionality:
 * 1. Data Retrieval: Fetches all available time slots from the backend.
 * 2. Data Filtering: Dynamically filters slots to display only those with a 'status: 0' (available).
 * 3. Appointment Booking: Executes a PUT request to associate the current patient with a selected slot.
 * 4. User Feedback: Provides visual loading states and feedback via alerts and navigation.
 * * @author [Christophr Herlitz]
 * @version 1.1.0
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

/**
 * @interface BookingSlot
 * @description Describes the structure of a single appointment time slot.
 * @property {number} booking_id - Unique identifier for the slot.
 * @property {any} patient - Patient data (null if available).
 * @property {string} time_slot_start - ISO date string of the start time.
 * @property {string} time_slot_end - ISO date string of the end time.
 * @property {number} status - 0 for available, 1 for booked.
 */
interface BookingSlot {
  booking_id: number;
  patient: any;
  time_slot_start: string;
  time_slot_end: string;
  status: number;
}

const router = useRouter()

/** @type {import('vue').Ref<BookingSlot[]>} Reactive array containing only available slots. */
const availableSlots = ref<BookingSlot[]>([])

/** @type {import('vue').Ref<boolean>} Tracks whether the data is currently being fetched. */
const loading = ref(true)

/**
 * Fetches the global list of booking slots and filters them for availability.
 * Maps the backend data structure (Postman-standard) to the local state.
 * * @async
 * @function fetchAvailableSlots
 * @returns {Promise<void>}
 */
const fetchAvailableSlots = async (): Promise<void> => {
  try {
    const response = await api.get('/v1/patients/bookings')

    // Fallback to empty array if no data is present
    const allSlots: BookingSlot[] = response.data.data || []

    // Logic: Only display slots that are not yet booked (Status 0)
    availableSlots.value = allSlots.filter((s) => s.status === 0)
  } catch (err) {
    console.error("Error fetching slots", err)
  } finally {
    loading.value = false
  }
}

/**
 * Executes the booking process for a specific slot ID.
 * On success, redirects the user to the dashboard to view the new schedule.
 * * @async
 * @function bookSlot
 * @param {number} id - The booking_id of the chosen slot.
 * @returns {Promise<void>}
 */
const bookSlot = async (id: number): Promise<void> => {
  try {
    // API endpoint for claiming a free slot
    await api.put(`/v1/patients/bookings/${id}`)

    alert("Appointment booked successfully!")
    router.push('/dashboard')
  } catch (err) {
    alert("Booking failed. The slot might have been taken just now.")
    console.error("Booking transaction failed:", err)
  }
}

/**
 * Initial load of available slots upon component mounting.
 */
onMounted(fetchAvailableSlots)
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <div class="mb-4">
        <button @click="router.back()" class="btn btn-link text-decoration-none p-0 text-muted mb-2">
          <i class="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <h2 class="fw-bold">Book an Appointment</h2>
        <p class="text-muted">Select an available time slot below.</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else class="row g-3">
        <div v-for="slot in availableSlots" :key="slot.booking_id" class="col-md-4 col-lg-3">
          <div class="card border-0 shadow-sm rounded-4 h-100 text-center transition-card">
            <div class="card-body p-4">
              <div class="bg-primary-subtle text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-calendar-event fs-4"></i>
              </div>
              <h6 class="fw-bold mb-1">{{ new Date(slot.time_slot_start).toLocaleDateString() }}</h6>
              <p class="text-muted small mb-3">
                {{ new Date(slot.time_slot_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }} -
                {{ new Date(slot.time_slot_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
              </p>
              <button @click="bookSlot(slot.booking_id)" class="btn btn-outline-primary w-100 rounded-pill fw-bold">
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div v-if="availableSlots.length === 0" class="col-12 text-center py-5">
          <i class="bi bi-calendar-x fs-1 text-muted"></i>
          <p class="mt-3 fs-5 text-muted">No available appointments at the moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * Hover effects for booking cards to improve interactivity (Affordance).
 */
.transition-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.transition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
}
</style>
