"use client";

import { useAppForm } from "@/shared/forms";
import { useCreateGroupMutation, useUpdateGroupMutation } from "@/features/subscription/api/subscription.queries";
import { groupSchema, type GroupFormValues } from "@/features/subscription/subscription.schema";
import type { PackageGroupDto } from "@/services/subscription";

/** `group` absent ⇒ create. Present ⇒ update — same single-dialog-both-modes shape as the rest of this secondary CRUD surface (Groups/Tags are lightweight lookup data, not warranting the full action-param page pattern — see docs brief section 4/plan Phase 5). */
export function useGroupFormDialog(group: PackageGroupDto | undefined, onClose: () => void) {
  const form = useAppForm(groupSchema, {
    defaultValues: { name: group?.name ?? "", description: group?.description ?? "" },
  });
  const createMutation = useCreateGroupMutation();
  const updateMutation = useUpdateGroupMutation(group?.id ?? "");

  const onSubmit = async (values: GroupFormValues) => {
    try {
      const input = { name: values.name, description: values.description || undefined };
      if (group) await updateMutation.mutateAsync(input);
      else await createMutation.mutateAsync(input);
      onClose();
    } catch {
      // surfaced via errorMessage below
    }
  };

  const mutation = group ? updateMutation : createMutation;

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
