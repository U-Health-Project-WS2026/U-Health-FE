<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')

const treatment = ref<any>(null)

async function loadTreatmentDetail() {
  loading.value = true
  try {
    const id = route.params.id
    // Konsistente URL mit api.ts baseURL
    const response = await api.get(`/v1/treatments/${id}`)
    treatment.value = response.data.data || response.data
  } catch {
    error.value = 'Could not load treatment details. The record might not exist.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

onMounted(loadTreatmentDetail)
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container" style="max-width: 800px;">

      <button @click="router.back()" class="btn btn-link text-decoration-none text-muted mb-4 p-0">
        <i class="bi bi-arrow-left"></i> Back to History
      </button>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger rounded-4 shadow-sm">
        <i class="bi bi-exclamation-octagon me-2"></i> {{ error }}
      </div>

      <div v-else class="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div class="card-header bg-white border-0 p-4 border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="badge bg-primary mb-2">Medical Record</span>
              <h2 class="fw-bold mb-0">{{ treatment.diagnosis }}</h2>
              <p class="text-muted mb-0"><i class="bi bi-calendar3 me-2"></i>{{ formatDate(treatment.date) }}</p>
            </div>
            <div class="text-end d-none d-md-block">
              <i class="bi bi-clipboard2-pulse fs-1 text-primary opacity-25"></i>
            </div>
          </div>
        </div>

        <div class="card-body p-4 p-md-5">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="small text-muted text-uppercase fw-bold">Treatment Performed</label>
              <p class="fs-5 fw-semibold">{{ treatment.treatment }}</p>
            </div>
            <div class="col-md-6">
              <label class="small text-muted text-uppercase fw-bold">Prescribed Medication</label>
              <p class="fs-5 fw-semibold text-primary">
                <i class="bi bi-capsule-pill me-2"></i>{{ treatment.medication || 'No medication prescribed' }}
              </p>
            </div>

            <div class="col-12 mt-4">
              <div class="p-4 bg-yellow-light rounded-4 border-start border-4 border-warning">
                <label class="small text-warning-emphasis text-uppercase fw-bold mb-2 d-block">
                  <i class="bi bi-journal-text me-2"></i>Physician's Clinical Notes
                </label>
                <p class="mb-0 lh-lg text-dark">
                  {{ treatment.notes || 'No additional clinical notes provided for this session.' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer bg-light p-4 border-0 text-center">
          <button class="btn btn-outline-secondary rounded-pill px-4" onclick="window.print()">
            <i class="bi bi-printer me-2"></i>Print Record
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-yellow-light {
  background-color: #fffdf0;
}
label {
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 5px;
}
.card {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
