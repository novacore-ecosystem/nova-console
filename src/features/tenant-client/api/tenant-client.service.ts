import {
  createTenantClient,
  getTenantClients,
  revokeTenantClient,
  rotateTenantClient,
  type CreateTenantClientInput,
  type TenantClientRecord,
} from "@/services/tenant-client";

export const tenantClientService = {
  async list(tenantId: string | null): Promise<TenantClientRecord[]> {
    return getTenantClients(tenantId);
  },
  async create(input: CreateTenantClientInput): Promise<TenantClientRecord> {
    return createTenantClient(input);
  },
  async rotate(id: string): Promise<TenantClientRecord> {
    return rotateTenantClient(id);
  },
  async revoke(id: string, reason: string): Promise<TenantClientRecord> {
    return revokeTenantClient(id, reason);
  },
};
