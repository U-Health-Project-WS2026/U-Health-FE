import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import HomePage from '@/components/HomePage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
//import TreatmentHistory from '@/components/TreatmentHistory.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/dashboard', component: DashboardPage },
  //    { path: '/history', component: TreatmentHistory },
  //    { path: '/book-appointment', component: BookAppointment },
  //    { path: '/cancel-appointment', component: CancelAppointment },
  //    { path: '/profile', component: ProfilePage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
