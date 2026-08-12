import {
  createHttpClient,
  HttpError,
  HttpErrorKinds,
  isErrorResponse,
  type ApiResponse,
} from "@novacore/frontend-foundation";

import { env } from "@/shared/lib/env";

/**
 * Single shared Axios-backed instance (see rules/state-and-data.md — API layering).
 * Auth is HTTP-only cookies, not bearer tokens (see docs/reference/authentication.md),
 * so no `tokenProvider` is configured here.
 */
export const httpClient = createHttpClient({
  baseUrl: env.apiBaseUrl,
  withCredentials: true,
  interceptors: [
    {
      onRequest(request) {
        return {
          ...request,
          headers: {
            ...request.headers,
            "Accept-Language":
              typeof document !== "undefined" ? document.documentElement.lang : "en",
          },
        };
      },
    },
  ],
});

/**
 * Unwraps the backend's unified envelope. `success: false` can arrive on an HTTP 200 —
 * the HttpClient only throws for non-2xx, so this boundary is required for every call.
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (isErrorResponse(response)) {
    throw new HttpError({
      kind: HttpErrorKinds.Api,
      message: response.message,
      code: response.messageCode ?? undefined,
      details: response.details,
    });
  }

  return response.data as T;
}
