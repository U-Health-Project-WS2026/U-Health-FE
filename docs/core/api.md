# API Configuration

This module initializes a custom Axios instance tailored for communication with the Laravel backend.

Central API configuration for the U-Health Frontend.


## Responsibilities
1. Base URL management for all API endpoints.
2. Automatic injection of Authentication Bearer tokens via Request Interceptors.
3. Centralized error handling via Response Interceptors (specifically managing 401 Unauthorized states).
4. Ensuring consistent header management (JSON Accept/Content-Type).





## Source Code
<<< @/../src/api.ts