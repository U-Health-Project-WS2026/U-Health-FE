<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api' // WICHTIG: Nutzt deine api.ts Konfiguration

// Interfaces für Typsicherheit
interface UserInfo {
  user_id: number;
  username: string;
  email: string;
}

interface PatientData {
  patient_id: number;
  first_name: string;
  last_name: string;
  age: number;
  sex: number;
  location: string;
  user_info: UserInfo;
}

const router = useRouter()
const patient = ref<PatientData | null>(null)
const loading = ref(true)
const error = ref('')

// Passwort-Änderung State
const passwordData = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

// Geschlecht-Mapping (0=weiblich, 1=männlich, 2=divers)
const getSexLabel = (sex: number) => {
  const labels: Record<number, string> = { 1: 'Male', 0: 'Female', 2: 'Diverse' }
  return labels[sex] || 'Unknown'
}

const fetchProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    // Da wir 'api' nutzen, wird der Token-Header automatisch durch deinen Interceptor angehängt
    // Pfad ist relativ zur baseURL in api.ts (http://localhost:8000/api)
    const response = await api.get('/v1/patients/me')
    patient.value = response.data.data
    console.log("Profile loaded successfully:", patient.value)
  } catch (err: any) {
    console.error("Profile Fetch Error Details:", err.response || err)

    // Falls der Interceptor nicht schon umgeleitet hat, hier Fehler anzeigen
    if (err.response?.status === 401) {
      error.value = "Your session has expired. Please log in again."
    } else {
      error.value = err.response?.data?.message || 'Connection to server failed.'
    }
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const changePassword = async () => {
  if (passwordData.value.new_password !== passwordData.value.confirm_password) {
    alert('New passwords do not match!')
    return
  }

  try {
    // Beispiel-Aufruf für Passwortänderung (Endpoint muss im Backend existieren)
    // await api.post('/v1/user/change-password', passwordData.value)
    alert('Password change functionality would be called here.')
  } catch (err: any) {
    alert('Error changing password: ' + (err.response?.data?.message || 'Unknown error'))
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">

      <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 50vh;">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div class="alert alert-danger shadow-sm rounded-4 p-4">
            <i class="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
            <h4>Authentication Error</h4>
            <p>{{ error }}</p>
            <button class="btn btn-primary rounded-pill px-4 mt-2" @click="router.push('/login')">
              Back to Login
            </button>
          </div>
        </div>
      </div>

      <div v-else class="row g-4 justify-content-center">

        <div class="col-lg-7">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="card-header bg-primary p-4 border-0">
              <div class="d-flex align-items-center">
                <div class="icon-circle bg-white text-primary me-3">
                  <i class="bi bi-person-fill fs-2"></i>
                </div>
                <div class="text-white">
                  <h3 class="mb-0 fw-bold">{{ patient?.first_name }} {{ patient?.last_name }}</h3>
                  <p class="mb-0 opacity-75">Patient Account #{{ patient?.patient_id }}</p>
                </div>
              </div>
            </div>

            <div class="card-body p-4 bg-white">
              <h5 class="fw-bold mb-4 text-secondary text-uppercase small letter-spacing">Personal Information</h5>

              <div class="row g-4">
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Username</label>
                    <span class="fw-bold text-dark">@{{ patient?.user_info.username }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Email Address</label>
                    <span class="fw-bold text-dark">{{ patient?.user_info.email }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Age</label>
                    <span class="fw-bold text-dark">{{ patient?.age }} Years</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Sex</label>
                    <span class="fw-bold text-dark">{{ getSexLabel(patient?.sex || 0) }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3">
                    <label class="text-muted d-block small mb-1">Location</label>
                    <span class="fw-bold text-dark">{{ patient?.location }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-5 pt-3 border-top">
                <button @click="handleLogout" class="btn btn-outline-danger px-4 rounded-pill shadow-sm">
                  <i class="bi bi-box-arrow-right me-2"></i>Logout from U-Health
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-lg rounded-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center mb-4">
                <i class="bi bi-shield-lock-fill text-warning fs-3 me-2"></i>
                <h5 class="fw-bold mb-0">Security</h5>
              </div>

              <form @submit.prevent="changePassword">
                <div class="mb-3">
                  <label class="form-label small fw-bold">Current Password</label>
                  <input v-model="passwordData.old_password" type="password" class="form-control bg-light border-0 p-3 rounded-3" placeholder="••••••••">
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold">New Password</label>
                  <input v-model="passwordData.new_password" type="password" class="form-control bg-light border-0 p-3 rounded-3" placeholder="••••••••">
                </div>
                <div class="mb-4">
                  <label class="form-label small fw-bold">Confirm New Password</label>
                  <input v-model="passwordData.confirm_password" type="password" class="form-control bg-light border-0 p-3 rounded-3" placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-primary w-100 p-3 rounded-3 fw-bold">
                  Update Password
                </button>
              </form>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 mt-4 bg-info-subtle text-info-emphasis">
            <div class="card-body p-4">
              <h6 class="fw-bold"><i class="bi bi-info-circle-fill me-2"></i>Data Privacy</h6>
              <p class="small mb-0 text-secondary">
                Your medical data is encrypted and only visible to authorized healthcare providers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-circle {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.letter-spacing {
  letter-spacing: 1px;
}

.form-control:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border: 1px solid #0d6efd !important;
}

.card {
  transition: all 0.3s ease;
}

/* Hover-Effekt für Karten */
.card:hover {
  transform: translateY(-5px);
}
</style>
