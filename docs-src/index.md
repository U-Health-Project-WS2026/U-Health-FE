---
layout: home

hero:
  name: "U-Health Patient Interface"
  text: "Technical Documentation"
  tagline: "Guide for the Patient Interface Frontend components and logic."
  image:
    src: /HomePage.png
    alt: U-Health Home Page
  actions:
    - theme: brand
      text: View Components
      link: /components/DashboardPage
    - theme: alt
      text: API & Logic
      link: /core/api

features:
  - title: Vue 3 Architecture
    
  - title: Secure API Communication
    details: Centralized Axios instance with request/response interceptors for 401 redirection.
    
  - title: Dynamic Routing
    details: Navigation guards for authentication and dynamic route management for password resets.
    
  - title: Documented
    details: Every component is documented via JSDoc and automatically rendered through VitePress.
    
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #3498db 30%, #2ecc71);
}
</style>

## Quick Start

To get a deeper look into the code structure, navigate through the sidebar to explore individual components or the core logic folder.

### Project Structure
- **Components:** Visual elements and page logic (located in `src/components`).
- **API:** Centralized backend communication (located in `src/api.ts`).
- **Router:** Route definitions and security guards (located in `src/router/index.ts`).