<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Loading + Error States
const loading = ref(true)
const error = ref('')


// Treatment detail state
const treatment = ref({
  id: null as number | null,
  date: '',
  diagnosis: '',
  treatment: '',
  medication: '',
  notes: ''
})


// Load Treatment from API
async function loadTreatmentDetail() {

  loading.value = true
  error.value = ''

  try {

    const id = route.params.id

    const response = await axios.get(
      `http://localhost:8000/api/treatments/${id}`
    )

    treatment.value = response.data

  } catch (e) {

    console.error(e)
    error.value = 'Could not load treatment details.'

  } finally {

    loading.value = false

  }
}

//async function loadTreatmentDetail() {
//  try {
//    const id = route.params.id
//    // API call to fetch detail for this treatment
//    const response = await axios.get(`/api/treatment-history/${id}`)
//    treatment.value = response.data
//  } catch (e) {
//    error.value = 'Could not load treatment details.'
//    console.error(e)
//  }
//}

// Back Button
function goBack() {
  router.back()
}


// Date Formatting
function formatDate(dateString: string) {

  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}



onMounted(loadTreatmentDetail)
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary mb-4">Treatment Detail</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center">

      <div class="spinner-border text-primary"></div>
      <p>Loading treatment...</p>

    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>


    <!-- Treatment Card -->
    <div v-else class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">{{ formatDate(treatment.date) }}</h5>
        <p class="card-text"><strong>Diagnosis:</strong> {{ treatment.diagnosis }}</p>
        <p class="card-text"><strong>Treatment:</strong> {{ treatment.treatment }}</p>
        <p class="card-text"><strong>Medication:</strong> {{ treatment.medication || '-' }}</p>
        <p class="card-text"><strong>Notes:</strong> {{ treatment.notes || '-' }}</p>
      </div>
    </div>

    <!-- Back Button -->
    <div class="text-center mt-4">
      <button class="btn btn-secondary" @click="goBack">
        Back to History
      </button>
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styling here if needed */
.container {
  max-width: 700px;
}

.card {
  border-radius: 10px;
}
</style>
