import { z } from "zod";

const codePattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export const createScopeSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(64, "Code must be 64 characters or fewer")
    .regex(codePattern, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export const updateScopeSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type CreateScopeFormValues = z.infer<typeof createScopeSchema>;
export type UpdateScopeFormValues = z.infer<typeof updateScopeSchema>;
