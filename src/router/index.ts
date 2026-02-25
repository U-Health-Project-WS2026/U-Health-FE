import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import RegisterUserPage from "@/components/RegisterUserPage.vue"
import HomePage from '@/components/HomePage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import ProfilePage from '@/components/ProfilePage.vue'
import TreatmentHistory from '@/components/TreatmentHistory.vue'
import TreatmentDetail from '@/components/TreatmentDetail.vue'



// Token Ablauf Prüfung für Sanctum (Opaque Tokens)
function isTokenValid() {
  const token = localStorage.getItem("token")
  // Da es kein JWT ist, können wir nur prüfen, ob er da ist.
  // Die Gültigkeit prüft der Server bei jedem Request.
  return !!token;
}


const routes = [
  { path: '/',
    component: HomePage,
    meta: { showNav: true, showProfile: false }
  },
  { path: '/login',
     component: LoginPage,
    meta: { showNav: false }
  },
  { path: "/register",
    component: RegisterUserPage,
    meta: { showNav: false }
  },
  { path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
  {
    path: '/profile',
    component: ProfilePage,
    meta: {
      requiresAuth: true, showNav: true, showProfile: false
    }
  },
  { path: '/history',
    component: TreatmentHistory,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
  { path: '/history/:id',
    name: 'TreatmentDetail',
    component: TreatmentDetail,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
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
    return next("/login")
  }

  // Wenn eingeloggt und versucht /login oder /register aufzurufen
  else if ((to.path === '/login' || to.path === '/register') && tokenValid) {
    next("/dashboard")
  }

  else {
    next()
  }

})


export default router
