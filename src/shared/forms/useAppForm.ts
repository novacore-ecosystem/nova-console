"use client";

import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, z } from "zod";

/**
 * The one place business code touches react-hook-form/zod — see rules/coding-style.md.
 * The resolver cast is unavoidable: zodResolver's generics don't line up with a schema
 * type parameterized this way (RHF/zod4 generic variance), but the outer signature
 * stays fully typed to the caller's schema.
 */
export function useAppForm<TSchema extends ZodType<FieldValues>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">,
) {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema as never) as UseFormProps<z.infer<TSchema>>["resolver"],
  });
}
