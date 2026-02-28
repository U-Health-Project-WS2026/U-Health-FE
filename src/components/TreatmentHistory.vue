<script setup lang="ts">
/**
 * @module TreatmentHistory
 * @description Patient's medical record archive with advanced relational data mapping.
 * * This component provides an organized, searchable, and sortable overview of the patient's
 * medical history. Functionality includes:
 * 1. Nested Data Mapping: Extracts disease and medication names from relational arrays.
 * 2. Hybrid Filtering: Client-side search for treatment types and server-side querying for specific dates.
 * 3. Simplified View: Integrated all clinical details (diseases/medications) directly into the list view.
 * 4. Relational Integrity: Handles many-to-many relationships for diseases and medications.
 * * @author [Christopher Herlitz]
 * @version 2.0.0
 */

import { ref, computed, onMounted } from 'vue'
import api from '@/api'

/**
 * @interface Disease
 * @description Relational schema for medical conditions linked to a treatment.
 */
interface Disease {
  name: string;
  icd_code: string
}

/**
 * @interface Medication
 * @description Relational schema for prescribed medications with pivot data.
 */
interface Medication {
  name: string;
  pivot: {
    dosis: number;
    amount: number;
  };
}

/**
 * @interface Treatment
 * @description Comprehensive treatment record reflecting the backend's relational structure.
 */
interface Treatment {
  treatment_id: number
  date_of_treatment: string
  type_of_treatment: string
  diseases: Disease[]
  medications: Medication[]
}

/** @type {import('vue').Ref<Treatment[]>} Local state storage for fetched treatment records. */
const treatments = ref<Treatment[]>([])

/** @type {import('vue').Ref<boolean>} UI state for the loading spinner. */
const loading = ref(true)

/** @type {import('vue').Ref<string>} Reactive search string for filtering treatment types. */
const searchQuery = ref('')

/** @type {import('vue').Ref<string>} Bound to the date picker for server-side date filtering. */
const selectedDate = ref('')

/** @type {import('vue').Ref<string>} The active property name used for sorting. */
const sortKey = ref('date_of_treatment')

/** @type {import('vue').Ref<boolean>} Toggle state for sorting order (true = ASC, false = DESC). */
const sortAsc = ref(false)


/**
 * Loads the complete medical history for the authenticated patient.
 * Fetches data from the global '/v1/patients/treatments' endpoint.
 * * @async
 * @function loadTreatmentHistory
 * @returns {Promise<void>}
 */
async function loadTreatmentHistory(): Promise<void> {
  loading.value = true
  try {
    const response = await api.get('/v1/patients/treatments')
    treatments.value = response.data.data
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Performs a server-side search for treatments occurring on a specific date.
 * If the date is cleared, the full history is reloaded.
 * * @async
 * @function searchByDate
 * @returns {Promise<void>}
 */
async function searchByDate(): Promise<void> {
  if (!selectedDate.value) {
    loadTreatmentHistory() // Reset if date is cleared
    return
  }

  loading.value = true
  try {
    const response = await api.get(`/v1/patients/treatments/date?date_of_treatment=${selectedDate.value}`)
    // The date search returns a simplified structure,
    // but we map it to our treatment list based on ID.
    treatments.value = response.data.data
  } catch (error) {
    console.error('Date search failed:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTreatmentHistory)

/**
 * Computed property that handles client-side filtering and multi-key sorting.
 * * Logic:
 * 1. Filter: Searches against the 'type_of_treatment' string.
 * 2. Sort: Applies chronological or alphabetical sorting based on 'sortKey'.
 * * @type {import('vue').ComputedRef<Treatment[]>}
 */
const filteredAndSorted = computed((): Treatment[] => {
  let items = [...treatments.value]

  // Filter logic: Case-insensitive search on treatment type
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter((t) =>
      t.type_of_treatment.toLowerCase().includes(query)
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
 * Updates the active sort key or toggles direction if the key is already active.
 * * @function sortBy
 * @param {string} key - The Treatment property key to sort by.
 */
function sortBy(key: string): void {
  if (sortKey.value === key) { sortAsc.value = !sortAsc.value }
  else { sortKey.value = key; sortAsc.value = true }
}

/**
 * Utility function to transform an array of relational objects into a comma-separated string.
 * * @function formatList
 * @param {any[] | undefined} items - Array of objects (Diseases or Medications).
 * @returns {string} Comma-separated names or 'None'.
 */
const formatList = (items: any[] | undefined): string => {
  if (!items || items.length === 0) return 'None'
  return items.map(i => i.name).join(', ')
}
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <div class="row align-items-end mb-4 g-3">
        <div class="col-lg-4">
          <h2 class="fw-bold text-dark mb-1">Medical Records</h2>
          <p class="text-muted mb-0">Overview of your Treatment History</p>
        </div>

        <div class="col-md-4 col-lg-3">
          <label class="small fw-bold text-secondary mb-1">Filter by Treatment Type</label>
          <div class="input-group shadow-sm rounded-3 overflow-hidden">
            <span class="input-group-text bg-white border-0"><i class="bi bi-search"></i></span>
            <input v-model="searchQuery" type="text" class="form-control border-0 p-2" placeholder="e.g. Biopsy...">
          </div>
        </div>

        <div class="col-md-4 col-lg-3">
          <label class="small fw-bold text-secondary mb-1">Search by Date</label>
          <div class="input-group shadow-sm rounded-3 overflow-hidden">
            <input v-model="selectedDate" type="date" class="form-control border-0 p-2" @change="searchByDate">
            <button v-if="selectedDate" class="btn btn-white border-0" @click="selectedDate = ''; loadTreatmentHistory()">
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-primary text-white">
              <tr>
                <th @click="sortBy('date_of_treatment')" class="p-3 cursor-pointer">
                  Date <i class="bi" :class="sortKey === 'date_of_treatment' ? (sortAsc ? 'bi-sort-up' : 'bi-sort-down') : 'bi-hash'"></i>
                </th>
                <th @click="sortBy('type_of_treatment')" class="p-3 cursor-pointer">
                  Treatment Type <i class="bi" :class="sortKey === 'type_of_treatment' ? (sortAsc ? 'bi-sort-up' : 'bi-sort-down') : 'bi-hash'"></i>
                </th>
                <th class="p-3">Diagnosis (Diseases)</th>
                <th class="p-3">Medications</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4" class="text-center py-5"><div class="spinner-border text-primary"></div></td>
              </tr>
              <tr v-else-if="filteredAndSorted.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">No records found for the selection.</td>
              </tr>
              <tr v-for="item in filteredAndSorted" :key="item.treatment_id" class="border-bottom">
                <td class="p-3 fw-bold">{{ new Date(item.date_of_treatment).toLocaleDateString() }}</td>
                <td class="p-3">
                   <span class="badge bg-primary-subtle text-primary-emphasis px-3 rounded-pill">
                     {{ item.type_of_treatment }}
                   </span>
                </td>
                <td class="p-3">
                  <div class="d-flex flex-wrap gap-1">
                    <span v-for="d in item.diseases" :key="d.name" class="badge bg-info-subtle text-info-emphasis fw-normal">
                      {{ d.name }}
                    </span>
                    <span v-if="!item.diseases?.length" class="text-muted small">N/A</span>
                  </div>
                </td>
                <td class="p-3">
                  <small class="text-secondary">
                    <i class="bi bi-capsule me-1"></i>{{ formatList(item.medications) }}
                  </small>
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
.cursor-pointer {
  cursor: pointer;
}

/* Table Header Polishing */
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

/* Row Interaction */
.table tbody tr:hover {
  background-color: #f8faff;
}


.bg-primary-subtle {
  background-color: #e7f0ff;
  }
</style>
