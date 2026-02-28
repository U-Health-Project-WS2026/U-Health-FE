# Router & Navigation Guards

Central Routing Module for the U-Health Application.

This module defines the application's navigation structure and implements critical security features.

## Features

1. Route Definition: Mapping URLs to Vue components.
2. Meta-driven Layout: Controlling the visibility of Navbar and Profile elements.
3. Navigation Guards: Protecting private routes (Dashboard, Bookings, etc.) by verifying the presence of a session token.
4. Auth-State Redirects: Preventing logged-in users from accessing Login/Register pages.





## Source Code
<<< @/../src/router/index.ts