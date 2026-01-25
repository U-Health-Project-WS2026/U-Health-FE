<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// treatment detail state
const treatment = ref({
  id: null,
  date: '',
  diagnosis: '',
  treatment: '',
  medication: '',
  notes: ''
})

const error = ref('')

async function loadTreatmentDetail() {
  try {
    const id = route.params.id
    // API call to fetch detail for this treatment
    const response = await axios.get(`/api/treatment-history/${id}`)
    treatment.value = response.data
  } catch (e) {
    error.value = 'Could not load treatment details.'
    console.error(e)
  }
}

function goBack() {
  router.back()
}

onMounted(loadTreatmentDetail)
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary mb-4">Treatment Detail</h2>

    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">{{ treatment.date }}</h5>
        <p class="card-text"><strong>Diagnosis:</strong> {{ treatment.diagnosis }}</p>
        <p class="card-text"><strong>Treatment:</strong> {{ treatment.treatment }}</p>
        <p class="card-text"><strong>Medication:</strong> {{ treatment.medication }}</p>
        <p class="card-text"><strong>Notes:</strong> {{ treatment.notes }}</p>
      </div>
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-secondary" @click="goBack">
        Back to History
      </button>
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styling here if needed */
</style>
