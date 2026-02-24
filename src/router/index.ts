import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import RegisterUserPage from "@/components/RegisterUserPage.vue"
import HomePage from '@/components/HomePage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import TreatmentHistory from '@/components/TreatmentHistory.vue'
import TreatmentDetail from '@/components/TreatmentDetail.vue'


// Token Ablauf prüfen
function isTokenValid() {
  const token = localStorage.getItem("token")
  if (!token) return false

  try {
    const base64Payload = token.split(".")[1]
    if (!base64Payload) return false

    const payload = JSON.parse(atob(base64Payload))
    const expiresAt = payload.exp * 1000
    return Date.now() < expiresAt
  } catch {
    return false
  }
}


const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: "/register", component: RegisterUserPage },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/history', component: TreatmentHistory, meta: { requiresAuth: true } },
  { path: '/history/:id', name: 'TreatmentDetail', component: TreatmentDetail, meta: { requiresAuth: true } },
  //    { path: '/book-appointment', component: BookAppointment },
  //    { path: '/cancel-appointment', component: CancelAppointment },
  //    { path: '/profile', component: ProfilePage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  const tokenValid = isTokenValid()

  // Falls die Route Auth benötigt und der Token ungültig/abgelaufen ist
  if (to.meta.requiresAuth && !tokenValid) {
    // Kein gültiger Token → zur Login-Seite
    localStorage.removeItem("token")
    next("/login")
  }

  // Wenn eingeloggt, verhindere Zugriff auf Login/Register
  else if ((to.path === '/login' || to.path === '/register') && tokenValid) {
    next("/dashboard")
  }

  else {
    next()
  }
})


export default router
