import type { PaginatedResult } from "@novacore/frontend-foundation";

import {
  createTenant,
  deleteTenant,
  disableTenant,
  getTenant,
  listTenants,
  rotateTenantClient,
  updateTenant,
  updateTenantConfig,
  updateTenantDictionary,
  upsertTenantTranslation,
  type CreateTenantInput,
  type ListTenantsParams,
  type TenantClientRotationDto,
  type TenantDetailDto,
  type TenantSummaryDto,
  type UpdateTenantInput,
  type UpsertTenantTranslationInput,
} from "@/services/tenant";

export const tenantService = {
  async list(params: ListTenantsParams): Promise<PaginatedResult<TenantSummaryDto>> {
    return listTenants(params);
  },
  async getById(id: string): Promise<TenantDetailDto> {
    return getTenant(id);
  },
  async create(input: CreateTenantInput): Promise<string> {
    return createTenant(input);
  },
  async update(id: string, input: UpdateTenantInput): Promise<void> {
    return updateTenant(id, input);
  },
  async disable(id: string): Promise<void> {
    return disableTenant(id);
  },
  async delete(id: string): Promise<void> {
    return deleteTenant(id);
  },
  async rotateClient(id: string, name?: string): Promise<TenantClientRotationDto> {
    return rotateTenantClient(id, name);
  },
  async updateConfig(id: string, language: string | null, config: unknown): Promise<void> {
    return updateTenantConfig(id, language, config);
  },
  async updateDictionary(id: string, language: string, dictionary: unknown): Promise<void> {
    return updateTenantDictionary(id, language, dictionary);
  },
  async upsertTranslation(id: string, input: UpsertTenantTranslationInput): Promise<void> {
    return upsertTenantTranslation(id, input);
  },
};
