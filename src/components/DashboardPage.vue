<script setup lang="ts">
/**
 * @file DashboardPage.vue
 * @description Central control panel for the patient.
 * * This component provides a visual overview of the user's medical schedule.
 * Key features:
 * 1. Interactive Calendar: Integration of FullCalendar to display personal appointments.
 * 2. Real-time Data Fetching: Retrieves booked slots from the backend and maps them to calendar events.
 * 3. Appointment Management: Allows users to cancel existing bookings directly via the calendar interface.
 * 4. Navigation Hub: Quick access to treatment history and the booking system for new appointments.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

/**
 * @interface Booking
 * @description Represents the data structure of an appointment returned by the API.
 */
interface Booking {
  booking_id: number;
  time_slot_start: string;
  time_slot_end: string;
  status: number;
  patient: any | null;
}

const router = useRouter()

/** @type {import('vue').Ref<boolean>} Loading state for the calendar and API request. */
const loading = ref(true)

/** * @type {import('vue').Ref<Object>} Configuration object for the FullCalendar component.
 * Includes plugin registration, styling options, and event click handlers.
 */
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  themeSystem: 'bootstrap5',
  height: 'auto',
  events: [] as any[],

  /**
   * Handler for clicking an event on the calendar.
   * Triggers a confirmation dialog to cancel the selected appointment.
   * @param {Object} info - Information about the clicked event provided by FullCalendar.
   */
  eventClick: (info: any) => {
    if(confirm(`Cancel appointment on ${info.event.start?.toLocaleString()}?`)) {
      cancelAppointment(info.event.id)
    }
  }
})

/**
 * Fetches all appointments assigned to the currently authenticated patient.
 * Filters the raw API data and transforms it into FullCalendar-compatible event objects.
 * * @async
 * @function fetchMyBookings
 * @returns {Promise<void>}
 */
const fetchMyBookings = async (): Promise<void> => {
  try {
    const response = await api.get('/v1/patients/bookings/booked')

    // Transform API data into FullCalendar event format
    const myEvents = response.data.data
      .filter((b: Booking) => b.status === 1 || b.patient !== null)
      .map((b: Booking) => ({
        id: b.booking_id,
        title: 'Your Appointment',
        start: b.time_slot_start,
        end: b.time_slot_end,
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd'
      }))

    calendarOptions.value.events = myEvents
  } catch (err) {
    console.error("Error fetching bookings", err)
  } finally {
    loading.value = false
  }
}

/**
 * Sends a cancellation request for a specific appointment to the backend.
 * Upon success, it refreshes the local calendar data.
 * * @async
 * @function cancelAppointment
 * @param {string} id - The unique ID (booking_id) of the appointment to be canceled.
 * @returns {Promise<void>}
 */
const cancelAppointment = async (id: string): Promise<void> => {
  try {
    await api.put(`/v1/patients/bookings/cancel/${id}`)
    alert("Appointment canceled.")
    fetchMyBookings() // Re-fetch data to sync UI
  } catch (err) {
    alert("Error canceling appointment.")
    console.error(err)
  }
}

/**
 * Lifecycle hook: Fetch initial booking data when the component is mounted.
 */
onMounted(fetchMyBookings)
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <div class="row mb-4 align-items-center">
        <div class="col">
          <h1 class="fw-bold text-dark">Welcome back!</h1>
          <p class="text-muted">Manage your health and upcoming appointments.</p>
        </div>
        <div class="col-auto">
          <button @click="router.push('/history')" class="btn btn-white shadow-sm rounded-pill px-4 me-2">
            <i class="bi bi-clock-history me-2 text-primary"></i>History
          </button>
          <button @click="router.push('/bookings')" class="btn btn-primary shadow rounded-pill px-4">
            <i class="bi bi-plus-lg me-2"></i>New Appointment
          </button>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-12">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-header bg-white p-4 border-0">
              <h5 class="fw-bold mb-0">Your Schedule</h5>
            </div>
            <div class="card-body p-4 pt-0">
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
              </div>
              <FullCalendar v-else :options="calendarOptions" />
              <div class="mt-3 small text-muted">
                <i class="bi bi-info-circle me-1"></i> Click on an event to cancel it.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

/* Global Calendar Overrides
  Customizing the FullCalendar default Bootstrap 5 theme to match U-Health branding.
*/
.fc .fc-button-primary {
  background-color: #0d6efd;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 600;
  transition: background-color 0.2s;
}
.fc .fc-button-primary:hover {
  background-color: #0b5ed7;
}
.fc .fc-toolbar-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #212529;
}
.fc-theme-bootstrap5 a {
  text-decoration: none;
  color: #212529;
}
.fc-daygrid-event {
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
