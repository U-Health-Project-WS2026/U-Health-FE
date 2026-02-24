import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import RegisterUserPage from "@/components/RegisterUserPage.vue"
import HomePage from '@/components/HomePage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import TreatmentHistory from '@/components/TreatmentHistory.vue'
import TreatmentDetail from '@/components/TreatmentDetail.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: "/register", component: RegisterUserPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/history', component: TreatmentHistory },
  { path: '/history/:id', name: 'TreatmentDetail', component: TreatmentDetail },
  //    { path: '/book-appointment', component: BookAppointment },
  //    { path: '/cancel-appointment', component: CancelAppointment },
  //    { path: '/profile', component: ProfilePage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
