/**
 * @file router/index.ts
 * @description Central Routing Module for the U-Health Application.
 * * This module defines the application's navigation structure and implements
 * critical security features:
 * 1. Route Definition: Mapping URLs to Vue components.
 * 2. Meta-driven Layout: Controlling the visibility of Navbar and Profile elements.
 * 3. Navigation Guards: Protecting private routes (Dashboard, Bookings, etc.)
 * by verifying the presence of a session token.
 * 4. Auth-State Redirects: Preventing logged-in users from accessing Login/Register pages.
 * * @requires vue-router
 */

import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router'

//import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/components/LoginPage.vue'
import RegisterUserPage from "@/components/RegisterUserPage.vue"
import ResetPasswordPage from '@/components/ResetPasswordPage.vue'
import HomePage from '@/components/HomePage.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import ProfilePage from '@/components/ProfilePage.vue'
import TreatmentHistory from '@/components/TreatmentHistory.vue'
import TreatmentDetail from '@/components/TreatmentDetail.vue'
import BookingsPage from '@/components/BookingsPage.vue'


/**
 * Basic Token Presence Check.
 * Since the application uses Sanctum Opaque Tokens, full validity is verified
 * server-side via API interceptors. This function performs a client-side
 * pre-check to decide whether a user can stay on a protected route.
 * * @function isTokenValid
 * @returns {boolean} True if a token string exists in LocalStorage.
 */
function isTokenValid(): boolean {
  const token = localStorage.getItem("token")
  return !!token;
}

/**
 * Route Configuration Array.
 * Each route contains 'meta' properties used by App.vue to toggle UI elements.
 * @type {RouteRecordRaw[]}
 */
const routes: RouteRecordRaw[] = [
  { path: '/',
    name: 'Home',
    component: HomePage,
    meta: { showNav: true, showProfile: false }
  },
  { path: '/login',
    name: 'Login',
     component: LoginPage,
    meta: { showNav: false }
  },
  { path: "/register",
    name: 'Register',
    component: RegisterUserPage,
    meta: { showNav: false }
  },
  {
    path: '/password-reset/:token',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: { showNav: false, requiresAuth: false }
  },
  { path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: BookingsPage,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true, showNav: true, showProfile: false }
  },
  { path: '/history',
    name: 'History',
    component: TreatmentHistory,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
  { path: '/history/:id',
    name: 'TreatmentDetail',
    component: TreatmentDetail,
    meta: { requiresAuth: true, showNav: true, showProfile: true }
  },
]

/**
 * Router Instance Initialization.
 * Uses Web History mode for clean URLs without hashes.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global Before Guard.
 * Executed before every route transition to enforce security policies.
 * * @param {RouteLocationNormalized} to - The target route object.
 * @param {RouteLocationNormalized} from - The route being navigated from.
 * @param {NavigationGuardNext} next - Function to resolve the hook and move to the next state.
 */
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const tokenValid = isTokenValid()

  /**
   * Scenario: Unauthorized access to protected route.
   * If the route requires authentication and no token is present,
   * clear any residual local data and redirect to Login.
   */
  if (to.meta.requiresAuth && !tokenValid) {
    localStorage.removeItem("token")
    return next("/login")
  }

  /**
   * Scenario: Logged-in user tries to access Auth pages.
   * If a valid token exists, prevent access to Login/Register
   * and redirect to the Dashboard instead.
   */
  else if ((to.path === '/login' || to.path === '/register') && tokenValid) {
    next("/dashboard")
  }

  /**
   * Scenario: Default navigation for public routes or authorized states.
   */
  else {
    next()
  }

})


export default router
