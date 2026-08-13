import {
  createScope,
  getScopes,
  setScopeActive,
  updateScope,
  type CreateScopeInput,
  type ScopeRecord,
  type UpdateScopeInput,
} from "@/services/scope";

export const scopeService = {
  async list(tenantId: string): Promise<ScopeRecord[]> {
    return getScopes(tenantId);
  },
  async create(input: CreateScopeInput): Promise<ScopeRecord> {
    return createScope(input);
  },
  async update(tenantId: string, id: string, input: UpdateScopeInput): Promise<ScopeRecord> {
    return updateScope(tenantId, id, input);
  },
  async setActive(tenantId: string, id: string, isActive: boolean): Promise<ScopeRecord> {
    return setScopeActive(tenantId, id, isActive);
  },
};
