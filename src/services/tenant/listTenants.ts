import type { ApiResponse, PaginatedResult } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/tenant/_base";
import type { TenantSummaryDto } from "@/services/tenant/types";

export interface ListTenantsParams {
  search?: string;
  page: number;
  pageSize: number;
}

/** `GET /auth/tenants?search&page&pageSize` — real endpoint, `tenant:view`. Search + pagination happen server-side. */
export async function listTenants(params: ListTenantsParams): Promise<PaginatedResult<TenantSummaryDto>> {
  const response = await httpClient.get<ApiResponse<PaginatedResult<TenantSummaryDto>>>(BASE_PATH, {
    query: { search: params.search || undefined, page: params.page, pageSize: params.pageSize },
  });
  return unwrapApiResponse(response);
}
