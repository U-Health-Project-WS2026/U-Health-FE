<script setup lang="ts">
/**
 * @file TreatmentDetail.vue
 * @description In-depth view of a specific medical treatment record.
 * * This component retrieves and displays granular details of a past medical session.
 * Core features:
 * 1. Dynamic Routing: Uses the URL ':id' parameter to fetch the correct record.
 * 2. Data Presentation: Displays diagnoses, procedures, medications, and clinical notes.
 * 3. Error Handling: Provides feedback if a record is not found or inaccessible.
 * 4. Document Utility: Offers a "Print Record" function for physical filing or sharing.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()

/** @type {import('vue').Ref<boolean>} Loading state for the specific record fetch. */
const loading = ref(true)

/** @type {import('vue').Ref<string>} Error message for invalid IDs or connectivity issues. */
const error = ref('')

/** @type {import('vue').Ref<any>} Holds the detailed treatment object from the backend. */
const treatment = ref<any>(null)


/**
 * Fetches the specific treatment details based on the ID provided in the route.
 * * @async
 * @function loadTreatmentDetail
 * @returns {Promise<void>}
 */
async function loadTreatmentDetail(): Promise<void> {
  loading.value = true
  try {
    const id = route.params.id
    // GET request to the treatment resource
    const response = await api.get(`/v1/treatments/${id}`)
    treatment.value = response.data.data || response.data
  } catch (err) {
    error.value = 'Could not load treatment details. The record might not exist.'
    console.error("Detail Fetch Error:", err)
  } finally {
    loading.value = false
  }
}

/**
 * Formats an ISO date string into a localized, user-friendly long format.
 * @function formatDate
 * @param {string} dateString - The raw date from the API.
 * @returns {string} Formatted date (e.g., "Monday, October 12, 2023").
 */
const formatDate = (dateString: string): string => {
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
/**
 * Visual Polish for Medical Documents
 */

.bg-yellow-light {
  background-color: #fffdf0; /* Soft background for notes */
}

label {
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 5px;
}

/** * Animation for data entrance
 * Gives the application a fluid, modern feel
 */
.card {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/**
 * Print Optimization
 */
@media print {
  .btn, .btn-link {
    display: none !important; /* Hide navigation and print buttons when printing */
  }
  .card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
}
</style>
