import { z } from "zod";

/** Mirrors Auth.Domain's `TenantCode` value object exactly — lowercase snake_case, e.g. "acme_corp". */
const codePattern = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

export const createTenantSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(100, "Code must be 100 characters or fewer")
    .regex(codePattern, 'Use lowercase snake_case — start with a letter, e.g. "acme_corp"'),
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  logoUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  faviconUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

/**
 * Branding is a full replace on the backend (`UpdateTenant` overwrites Name/LogoUrl/
 * FaviconUrl wholesale, not a merge) — this form must always be seeded from the full
 * `TenantDetailDto`, never the lightweight list DTO, or an unedited field gets wiped.
 */
export const updateTenantSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  logoUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  faviconUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export type CreateTenantFormValues = z.infer<typeof createTenantSchema>;
export type UpdateTenantFormValues = z.infer<typeof updateTenantSchema>;
