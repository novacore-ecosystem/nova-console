/** Mirrors Auth.API's `TenantSummaryResponse` — deliberately excludes Metadata/Version/FaviconUrl (backend doesn't send them). */
export interface TenantSummaryDto {
  id: string;
  code: string;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
}
