import { getTenantPermissionScope, setTenantPermissionScope } from "@/services/tenant-permission";

export const tenantPermissionService = {
  async getScope(tenantId: string): Promise<string[]> {
    return getTenantPermissionScope(tenantId);
  },
  async setScope(tenantId: string, keys: string[]): Promise<string[]> {
    return setTenantPermissionScope(tenantId, keys);
  },
};
