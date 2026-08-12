import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";
import type { TenantSummaryDto } from "@/services/tenant/types";

/** `GET /auth/tenants` — real endpoint, Root-only. See docs/reference/domain-mapping.md. */
export async function listTenants(): Promise<TenantSummaryDto[]> {
  const response = await httpClient.get<ApiResponse<TenantSummaryDto[]>>(BASE_PATH);
  return unwrapApiResponse(response);
}
