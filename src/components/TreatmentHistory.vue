<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

interface Treatment {
  id: number
  date: string
  diagnosis: string
  treatment: string
  medication: string
}

const router = useRouter()
const treatments = ref<Treatment[]>([])
const loading = ref(true)
const searchQuery = ref('')
const sortKey = ref('date')
const sortAsc = ref(false) // Standardmäßig neueste zuerst

async function loadTreatmentHistory() {
  loading.value = true
  try {
    // Nutzt deinen api-Interceptor für automatischen Token & baseURL
    const response = await api.get('/v1/patients/treatments')
    treatments.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTreatmentHistory)

const filteredAndSorted = computed(() => {
  let items = [...treatments.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter((t) =>
      Object.values(t).some((val) => String(val).toLowerCase().includes(query))
    )
  }
  items.sort((a, b) => {
    const aVal = String(a[sortKey.value as keyof Treatment] ?? '')
    const bVal = String(b[sortKey.value as keyof Treatment] ?? '')
    return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })
  return items
})

function sortBy(key: keyof Treatment) {
  if (sortKey.value === key) { sortAsc.value = !sortAsc.value }
  else { sortKey.value = key; sortAsc.value = true }
}

function viewDetails(id: number) {
  router.push({ name: 'TreatmentDetail', params: { id } })
}
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Treatment History</h2>
          <p class="text-muted">Overview of your past medical records</p>
        </div>
        <div class="col-md-4">
          <div class="input-group shadow-sm rounded-pill overflow-hidden">
            <span class="input-group-text bg-white border-0"><i class="bi bi-search"></i></span>
            <input v-model="searchQuery" type="text" class="form-control border-0 p-2" placeholder="Search records...">
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-primary text-white">
              <tr>
                <th @click="sortBy('date')" class="p-3 cursor-pointer">Date <i class="bi" :class="sortKey === 'date' ? (sortAsc ? 'bi-sort-up' : 'bi-sort-down') : 'bi-hash'"></i></th>
                <th @click="sortBy('diagnosis')" class="p-3 cursor-pointer">Diagnosis</th>
                <th class="p-3">Treatment</th>
                <th class="p-3">Medication</th>
                <th class="p-3 text-end">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-5"><div class="spinner-border text-primary"></div></td>
              </tr>
              <tr v-else-if="filteredAndSorted.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">No records found.</td>
              </tr>
              <tr v-for="item in filteredAndSorted" :key="item.id" class="border-bottom">
                <td class="p-3 fw-bold">{{ new Date(item.date).toLocaleDateString() }}</td>
                <td class="p-3"><span class="badge bg-info-subtle text-info-emphasis rounded-pill px-3">{{ item.diagnosis }}</span></td>
                <td class="p-3 text-secondary">{{ item.treatment }}</td>
                <td class="p-3"><i class="bi bi-capsule me-2"></i>{{ item.medication || 'None' }}</td>
                <td class="p-3 text-end">
                  <button class="btn btn-sm btn-light rounded-pill px-3 shadow-sm border" @click="viewDetails(item.id)">
                    View <i class="bi bi-chevron-right ms-1"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.table thead th { font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }
.table tbody tr { transition: background-color 0.2s; }
.table tbody tr:hover { background-color: #f8faff; }
</style>
