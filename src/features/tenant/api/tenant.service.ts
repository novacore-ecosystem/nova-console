import {
  createTenant,
  getTenantById,
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

async function ensureSeeded(): Promise<void> {
  if (!isSeeded()) seedTenants(await listTenants());
}

export const tenantService = {
  /** Seeds the dev adapter from the real endpoint on first call — see docs/decisions/README.md. */
  async list(): Promise<TenantRecord[]> {
    await ensureSeeded();
    return getTenants();
  },
  async getById(id: string): Promise<TenantRecord | null> {
    await ensureSeeded();
    return getTenantById(id);
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
