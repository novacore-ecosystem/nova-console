import { z } from "zod";

/** `groupId`/`tagIds`/`status` are kept outside this schema and managed as plain hook state — same pattern as `ScopeFormDialog`'s `parentScopeId` (see useScopeFormDialog.ts): non-text-input fields don't need zod validation, so they stay out of the RHF-bound form entirely. */
export const packageSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  description: z.string().max(1000, "Description must be 1000 characters or fewer").optional().or(z.literal("")),
});

export const groupSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
});

export type PackageFormValues = z.infer<typeof packageSchema>;
export type GroupFormValues = z.infer<typeof groupSchema>;
export type TagFormValues = z.infer<typeof tagSchema>;
