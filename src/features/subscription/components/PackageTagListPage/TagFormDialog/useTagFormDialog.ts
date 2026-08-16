"use client";

import { useAppForm } from "@/shared/forms";
import { useCreateTagMutation, useUpdateTagMutation } from "@/features/subscription/api/subscription.queries";
import { tagSchema, type TagFormValues } from "@/features/subscription/subscription.schema";
import type { PackageTagDto } from "@/services/subscription";

/** `tag` absent ⇒ create. Present ⇒ update — same shape as `useGroupFormDialog`. */
export function useTagFormDialog(tag: PackageTagDto | undefined, onClose: () => void) {
  const form = useAppForm(tagSchema, { defaultValues: { name: tag?.name ?? "" } });
  const createMutation = useCreateTagMutation();
  const updateMutation = useUpdateTagMutation(tag?.id ?? "");

  const onSubmit = async (values: TagFormValues) => {
    try {
      if (tag) await updateMutation.mutateAsync(values);
      else await createMutation.mutateAsync(values);
      onClose();
    } catch {
      // surfaced via errorMessage below
    }
  };

  const mutation = tag ? updateMutation : createMutation;

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
