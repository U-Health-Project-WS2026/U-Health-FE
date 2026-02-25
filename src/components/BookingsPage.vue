<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

// Definiere, wie ein Slot aussieht
interface BookingSlot {
  booking_id: number;
  patient: any;
  time_slot_start: string;
  time_slot_end: string;
  status: number;
}

const router = useRouter()
const availableSlots = ref<BookingSlot[]>([])
const loading = ref(true)

const fetchAvailableSlots = async () => {
  try {
    const response = await api.get('/v1/patients/bookings')
    // Sicherstellen, dass wir auf response.data.data zugreifen (Postman-Struktur)
    const allSlots: BookingSlot[] = response.data.data || []
    availableSlots.value = allSlots.filter((s) => s.status === 0)
  } catch (err) {
    console.error("Error fetching slots", err)
  } finally {
    loading.value = false
  }
}

const bookSlot = async (id: number) => {
  try {
    await api.put(`/v1/patients/bookings/${id}`)
    alert("Appointment booked successfully!")
    router.push('/dashboard')
  } catch {
    alert("Booking failed. Please try again.")
  }
}

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
.transition-card {
  transition: transform 0.2s;
}
.transition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
}
</style>
