/** Mirrors Auth.API's `TenantSummaryResponse` — deliberately excludes Metadata/Version/FaviconUrl (backend doesn't send them). */
export interface TenantSummaryDto {
  id: string;
  code: string;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
}

/** Mirrors Auth.API's `TenantClientSummaryResponse` — embedded on `TenantDetailDto.clients`, never fetched standalone. */
export interface TenantClientSummaryDto {
  id: string;
  name: string;
  publicKey: string;
  status: string;
  expiresAt: string | null;
  revokedAt: string | null;
}

/** Mirrors Auth.API's `TenantLocaleResponse` — raw, unmerged per-locale content. `languageCode: null` is the fallback/default resource. */
export interface TenantLocaleDto {
  languageCode: string | null;
  configuration: unknown;
  dictionary: unknown;
}

/** Mirrors Auth.API's `EffectiveTranslationResponse` — fallback merged with one language's override, override wins on conflicting keys. */
export interface EffectiveTranslationDto {
  configuration: unknown;
  dictionary: unknown;
}

/** Mirrors Auth.API's `TenantDetailResponse` — the Tenant Management editing payload, never used for listing. */
export interface TenantDetailDto {
  id: string;
  code: string;
  name: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  isActive: boolean;
  version: number;
  locales: TenantLocaleDto[];
  translations: Record<string, EffectiveTranslationDto>;
  supportedLanguages: string[];
  clients: TenantClientSummaryDto[];
  createdAt: string;
  updatedAt: string;
}

/** Mirrors Auth.API's `TenantClientRotationResponse` — the new key only, the revoked one is never returned. */
export interface TenantClientRotationDto {
  clientId: string;
  publicKey: string;
  expiresAt: string | null;
}
