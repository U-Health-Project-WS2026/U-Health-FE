<script setup lang="ts">
/**
 * @file TreatmentHistory.vue
 * @description Patient's medical record archive.
 * * This component provides an organized, searchable, and sortable overview of the patient's
 * medical history. Core features include:
 * 1. Historical Data Retrieval: Fetches treatment records from the backend.
 * 2. Dynamic Filtering: Real-time search functionality across all record fields.
 * 3. Multi-key Sorting: Allows users to sort records by date or diagnosis (ascending/descending).
 * 4. Detailed Navigation: Direct access to individual treatment summaries via route parameters.
 * * @author [Christopher Herlitz]
 * @version 1.1.0
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

/**
 * @interface Treatment
 * @description Defines the schema for a medical treatment record.
 * @property {number} id - Unique identifier for the treatment session.
 * @property {string} date - ISO date string of the consultation.
 * @property {string} diagnosis - The medical finding or condition identified.
 * @property {string} treatment - Description of the medical procedure or advice.
 * @property {string} medication - List of prescribed drugs or therapeutic agents.
 */
interface Treatment {
  id: number
  date: string
  diagnosis: string
  treatment: string
  medication: string
}

const router = useRouter()

/** @type {import('vue').Ref<Treatment[]>} Local state for all fetched treatment records. */
const treatments = ref<Treatment[]>([])

/** @type {import('vue').Ref<boolean>} State to manage the loading overlay for the table. */
const loading = ref(true)

/** @type {import('vue').Ref<string>} Reactive search string bound to the search input. */
const searchQuery = ref('')

/** @type {import('vue').Ref<string>} The active property name used for sorting the table. */
const sortKey = ref('date')

/** @type {import('vue').Ref<boolean>} Toggle state for sorting order (true = ASC, false = DESC). */
const sortAsc = ref(false)


/**
 * Loads the complete medical history for the authenticated patient.
 * * @async
 * @function loadTreatmentHistory
 * @returns {Promise<void>}
 */
async function loadTreatmentHistory(): Promise<void> {
  loading.value = true
  try {
    const response = await api.get('/v1/patients/treatments')
    treatments.value = response.data.data || response.data
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTreatmentHistory)


/**
 * Computed property that handles the complex logic of filtering and sorting.
 * * Logic:
 * 1. Filter: Checks if any value in the treatment object contains the search query.
 * 2. Sort: Applies alphabetical or chronological sorting based on current sortKey.
 * * @type {import('vue').ComputedRef<Treatment[]>}
 */
const filteredAndSorted = computed((): Treatment[] => {
  let items = [...treatments.value]

  // Filter logic: Case-insensitive search across all object properties
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter((t) =>
      Object.values(t).some((val) => String(val).toLowerCase().includes(query))
    )
  }

  // Sorting logic
  items.sort((a, b) => {
    const aVal = String(a[sortKey.value as keyof Treatment] ?? '')
    const bVal = String(b[sortKey.value as keyof Treatment] ?? '')
    return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })
  return items
})


/**
 * Updates the sort key or toggles the sort direction.
 * @function sortBy
 * @param {keyof Treatment} key - The object key to sort by.
 */
function sortBy(key: keyof Treatment): void {
  if (sortKey.value === key) { sortAsc.value = !sortAsc.value }
  else { sortKey.value = key; sortAsc.value = true }
}


/**
 * Navigates to the detailed view of a specific treatment.
 * @function viewDetails
 * @param {number} id - The ID of the treatment to view.
 */
function viewDetails(id: number): void {
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
/**
 * UI & Accessibility Styling
 */
.cursor-pointer { cursor: pointer; }

/* Table Header Polishing */
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

/* Row Hover Transitions */
.table tbody tr {
  transition: background-color 0.2s;
}

.table tbody tr:hover {
  background-color: #f8faff;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
