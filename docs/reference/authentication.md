# Authentication

As implemented in AdminPortal, the existing reference app — replicate this pattern in
nova-consoles rather than inventing a new one.

## Model

HTTP-only cookie auth. No access/refresh tokens stored client-side. A single shared
`frontend-foundation` http client instance (`shared/lib/api/client.ts` in AdminPortal) is
configured with `withCredentials: true`.

## Request/response pipeline

- Request interceptor adds `X-Correlation-Id` and `Accept-Language` headers.
- Response interceptor unwraps the backend's unified envelope
  (`{ success, message, messageCode, data, details }`). `success: false` rejects with a
  typed `ApiError` even when the HTTP status is 200 — check the envelope, not just the
  status code.
- On a 401: a single in-flight refresh request is queued (concurrent 401s don't trigger
  multiple refreshes), the failed request retries once, and on refresh failure the session
  store is cleared and the app redirects to login.

This matches `frontend-foundation`'s `TokenProvider.refreshAccessToken()` contract — see
reference/frontend-foundation.md.

## Session state

The current session is the one deliberate exception to "server state lives in Query, not
Zustand" (see rules/state-and-data.md): AdminPortal caches it in a `session.store.ts`
Zustand store, since it's read synchronously in many places (route guards, headers) where
a Query hook's loading state would be awkward. Treat it as a cache of a query result, not
a second source of truth — don't write session fields anywhere except from the
auth/refresh flow itself.
