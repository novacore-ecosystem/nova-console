/** Mirrors Auth.Domain's Scope entity — no backend endpoint exists yet, see docs/reference/domain-mapping.md. */
export interface ScopeRecord {
  id: string;
  tenantId: string;
  parentScopeId: string | null;
  code: string;
  name: string;
  description: string | null;
  path: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
}
