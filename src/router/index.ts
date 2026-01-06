import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/components/LoginPage.vue'
import HomePage from '@/components/HomePage.vue';

const routes = [

    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
  ]


const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
