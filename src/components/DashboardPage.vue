<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const router = useRouter()
const loading = ref(true)

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth'
  },
  themeSystem: 'bootstrap5',
  height: 'auto',
  events: [],
  eventClick: (info) => {
    if(confirm(`Cancel appointment on ${info.event.start?.toLocaleString()}?`)) {
      cancelAppointment(info.event.id)
    }
  }
})

const fetchMyBookings = async () => {
  try {
    const response = await api.get('/v1/patients/bookings/booked')
    console.log("API Raw Data:", response.data.data) // Debugging, schauen was ankommt
    // Filtere nur Termine, die dem Patienten gehören (status 1 oder patient != null)
    // Hier passen wir das Mapping an deine API an
    const myEvents = response.data.data
      .filter((b: any) => b.status === 1 || b.patient !== null)
      .map((b: any) => ({
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

const cancelAppointment = async (id: string) => {
  try {
    await api.put(`/v1/patients/bookings/cancel/${id}`)
    alert("Appointment canceled.")
    fetchMyBookings()
  } catch {
    alert("Error canceling appointment.")
  }
}

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
/* Kalender Styling Anpassungen */
.fc .fc-button-primary {
  background-color: #0d6efd;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
}
.fc .fc-toolbar-title {
  font-weight: 700;
  font-size: 1.25rem;
}
.fc-theme-bootstrap5 a {
  text-decoration: none;
  color: #212529;
}
.fc-daygrid-event {
  border-radius: 4px;
  padding: 2px 4px;
}
</style>
