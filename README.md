# U-Health – Patient Management System (Frontend)

**U-Health** is a professional-grade Single-Page Application (SPA) designed to digitize the patient experience. It allows users to securely manage medical appointments, track treatment histories, and access clinical reports through a modern, responsive interface.

---

## Project Metadata
* **Developed by:** [Christopher Herlitz, ...]
* **Submission Date:** 28th February 2026
* **University:** [Universität Tübingen]
* **Course:** [Praktische Informatik 4 - Teamprojekt]

---

## Technical Architecture

The application follows a modern decoupled architecture where the Frontend acts as a standalone client communicating with a RESTful API.

### Core Stack
* **Framework:** Vue 3 (Composition API) with Vite for optimized building.
* **Language:** TypeScript for strict typing and interface definitions.
* **Styling:** Bootstrap 5 for responsive UI components and customized CSS for medical branding.
* **State & Logic:** * **Vue Router:** Manages navigation and route-based access control.
    * **Axios:** Centralized HTTP client for asynchronous API requests.
    * **FullCalendar:** Integrated library for managing patient schedules.

### Security Implementation
Security is a core pillar of the U-Health interface:
1.  **Token-Based Authentication:** Uses Laravel Sanctum Opaque Tokens. Tokens are stored in `LocalStorage` and managed via an Axios Request Interceptor.
2.  **Navigation Guards:** Protected routes (Dashboard, Profile, History) are guarded. Unauthorized access attempts automatically redirect to the login page.
3.  **Data Sanitization:** Strict TypeScript interfaces ensure that only validated data structures are rendered in the UI.
4.  **Session Persistence:** Automatic cleanup of local session data upon logout or 401 (Unauthorized) server responses.

---

## Installation & Setup

To run the application locally, follow these steps to initialize both the database and the frontend.

### 1. Prerequisites
* **PHP** (v8.2+) & **Composer**
* **Node.js** (v18+) & **npm**
* **MySQL**

### 2. Backend Initialization (Laravel)
1.  Navigate to the backend directory.
2.  Install dependencies: `composer install`
3.  Configure your `.env` file with your MySQL credentials:
    ```env
    APP_URL=http://localhost:8000
    FRONTEND_URL=http://localhost:5173

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=u_health_db
    DB_USERNAME=root
    DB_PASSWORD=
    ```
4.  Run migrations and seed the database:
    ```sh
    php artisan migrate --seed
    ```
5.  Start the server:
    ```sh
    php artisan serve
    ```

### 3. Frontend Initialization (Vue.js)
1.  Navigate to the `vue-ui` folder.
2.  Install packages: `npm install`
3.  Run the development server:
    ```sh
    npm run dev
    ```
    *The app will be accessible at http://localhost:5173*

---

## User Guide



### 1. Account Access
* **Registration:** New users must sign up via the `/register` page. All fields (including demographic data) are required for medical record accuracy.
* **Authentication:** Log in to receive your session token. If you are already logged in, the system will automatically redirect you from the login page to your Dashboard.

### 2. Dashboard & Calendar
* The Dashboard provides an immediate overview of your medical schedule.
* **Blue Slots:** Represent your confirmed upcoming appointments.
* **Cancellation:** Click on an existing appointment in the calendar to remove it from your schedule.

### 3. Booking Appointments
* Navigate to the **"Book an Appointment"** section.
* The system filters and displays only available (Status: 0) time slots.
* Click **"Book Now"** to instantly reserve a slot. The view will refresh and redirect you to the Dashboard.



### 4. Treatment History & Reports
* **Archive:** View all past visits in the **"History"** tab. You can sort by date or diagnosis and use the search bar to find specific medications or symptoms.
* **Clinical Detail:** Open the detail view to read physician's notes and specific treatment plans.
* **Printing:** Use the **"Print Record"** button at the bottom of any treatment detail page to generate a physical copy for your records.

---

## Directory Structure
```text
src/
├── api/            # api.ts (Axios configuration & Interceptors)
├── components/     # Vue components (Auth, Dashboard, History, etc.)
├── router/         # index.ts (Route definitions & Navigation Guards)
└── App.vue         # Root component with dynamic Navigation Bar logic