import {
  createTenant,
  getTenants,
  isSeeded,
  listTenants,
  seedTenants,
  setTenantActive,
  updateTenant,
  type CreateTenantInput,
  type TenantRecord,
  type UpdateTenantInput,
} from "@/services/tenant";

export const tenantService = {
  /** Seeds the dev adapter from the real endpoint on first call — see docs/decisions/README.md. */
  async list(): Promise<TenantRecord[]> {
    if (!isSeeded()) seedTenants(await listTenants());
    return getTenants();
  },
  async create(input: CreateTenantInput): Promise<TenantRecord> {
    return createTenant(input);
  },
  async update(id: string, input: UpdateTenantInput): Promise<TenantRecord> {
    return updateTenant(id, input);
  },
  async setActive(id: string, isActive: boolean): Promise<TenantRecord> {
    return setTenantActive(id, isActive);
  },
};
