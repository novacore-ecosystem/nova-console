function capitalize(segment: string): string {
  if (!segment) return segment;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

/** `"tenant:rotate-client"` → `{ moduleId: "tenant", moduleLabel: "Tenant", label: "Rotate client" }`. Shared between the interactive selector and any read-only permission-scope display — no permission-label dictionary exists elsewhere in the codebase. */
export function humanizePermissionKey(key: string): { moduleId: string; moduleLabel: string; label: string } {
  const [moduleId = key, leaf = ""] = key.split(":");
  return { moduleId, moduleLabel: capitalize(moduleId), label: capitalize(leaf) };
}
