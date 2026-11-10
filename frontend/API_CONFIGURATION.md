# API configuration

Copy `.env.example` to `.env` to override `REACT_APP_API_URL`, then restart the
development server (or rebuild for deployment). This URL is public frontend
configuration; never put passwords or private keys in `REACT_APP_` variables.

Use `publicApi` from `src/utils/api.js` for public reads and the contact form.
Use the `useAxios()` hook for protected requests. It supplies the current access
token, coordinates refresh, and retries a 401 once. Pass relative API paths such
as `lesson-progress/`. Do not attach Authorization headers in page components.

Login, registration, and token refresh use `apiUrl()` with fetch so they cannot
trigger the protected client's refresh interceptors recursively.
