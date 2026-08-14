import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";

export interface CreateTenantInput {
  code: string;
  name: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

/** `POST /auth/tenants` — real endpoint, `tenant:manage`. Code is immutable once created. */
export async function createTenant(input: CreateTenantInput): Promise<string> {
  const response = await httpClient.post<ApiResponse<string>>(BASE_PATH, input);
  return unwrapApiResponse(response);
}
