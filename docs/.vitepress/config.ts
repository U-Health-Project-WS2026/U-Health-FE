import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "U-Health Documentation",
  description: "Technical Documentation for the Patient Portal",
  base: '/U-Health-FE/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/components/DashboardPage' }
    ],
    sidebar: [
      {
        text: 'Core Logic',
        items: [
          { text: 'API & Interceptors', link: '/core/api' },
          { text: 'Routing & Guards', link: '/core/router' }
        ]
      },
      {
        text: 'UI Components',
        items: [
          { text: 'Dashboard', link: '/components/DashboardPage' },
          { text: 'Booking System', link: '/components/BookingPage' },
          { text: 'Treatment History', link: '/components/TreatmentHistory' },
          { text: 'Login', link: '/components/LoginPage' },
          { text: 'Registration', link: '/components/RegisterUserPage' },
          { text: 'Password Reset', link: '/components/ResetPasswordPage' },
          { text: 'Profile', link: '/components/ProfilePage' },
          { text: 'Landing Page', link: '/components/HomePage' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/U-Health-Project-WS2026/U-Health-FE' }
    ]
  }
})
