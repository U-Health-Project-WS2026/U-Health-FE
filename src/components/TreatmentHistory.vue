<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface Treatment {
  id: number
  date: string
  diagnosis: string
  treatment: string
  medication: string
}

const router = useRouter()

// treatment list aus API
const treatments = ref<Treatment[]>([])

// sort state
const sortKey = ref('')

const sortAsc = ref(true)

// search filter
const searchQuery = ref('')

// load data from backend
async function loadTreatmentHistory() {
  try {
    const response = await axios.get('/api/treatment-history')
    treatments.value = response.data
  } catch (error) {
    console.error('Failed to load treatment history:', error)
  }
}

onMounted(loadTreatmentHistory)

// sorted & filtered result
const filteredAndSorted = computed(() => {
  let items = [...treatments.value]

  // filter
  if (searchQuery.value) {
    items = items.filter((t) =>
      Object.values(t).some((val) =>
        String(val).toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
    )
  }

  // sort
  if (sortKey.value) {
    items.sort((a, b) => {
      const aVal = String(a[sortKey.value as keyof Treatment] ?? '')
      const bVal = String(b[sortKey.value as keyof Treatment] ?? '')
      if (aVal < bVal) return sortAsc.value ? -1 : 1
      if (aVal > bVal) return sortAsc.value ? 1 : -1
      return 0
    })
  }

  return items
})

// handle sort click
function sortBy(key: keyof Treatment) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

// show row details
function viewDetails(item: Treatment) {
  router.push({ name: 'TreatmentDetail', params: { id: item.id } })
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary mb-4">Treatment History</h2>

    <!-- Search / Filter -->
    <div class="row mb-3">
      <div class="col-md-4 mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Search treatments..."
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-light">
          <tr>
            <th @click="sortBy('date')" style="cursor: pointer">
              Date
              <span v-if="sortKey === 'date'">
                <i v-if="sortAsc" class="bi bi-arrow-down"></i>
                <i v-else class="bi bi-arrow-up"></i>
              </span>
            </th>
            <th @click="sortBy('diagnosis')" style="cursor: pointer">
              Diagnosis
              <span v-if="sortKey === 'diagnosis'">
                <i v-if="sortAsc" class="bi bi-arrow-down"></i>
                <i v-else class="bi bi-arrow-up"></i>
              </span>
            </th>
            <th @click="sortBy('treatment')" style="cursor: pointer">
              Treatment
              <span v-if="sortKey === 'treatment'">
                <i v-if="sortAsc" class="bi bi-arrow-down"></i>
                <i v-else class="bi bi-arrow-up"></i>
              </span>
            </th>
            <th @click="sortBy('medication')" style="cursor: pointer">
              Medication
              <span v-if="sortKey === 'medication'">
                <i v-if="sortAsc" class="bi bi-arrow-down"></i>
                <i v-else class="bi bi-arrow-up"></i>
              </span>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredAndSorted.length === 0">
            <td colspan="5" class="text-center text-muted">No matching treatments found.</td>
          </tr>
          <tr v-for="item in filteredAndSorted" :key="item.id">
            <td>{{ item.date }}</td>
            <td>{{ item.diagnosis }}</td>
            <td>{{ item.treatment }}</td>
            <td>{{ item.medication }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" @click="viewDetails(item)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
th {
  user-select: none;
}
</style>
