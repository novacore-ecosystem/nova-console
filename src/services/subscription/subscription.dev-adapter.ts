import type { PaginatedResult } from "@novacore/frontend-foundation";
import type {
  PackageDetailDto,
  PackageGroupDto,
  PackageHistoryEntryDto,
  PackageStatus,
  PackageSummaryDto,
  PackageTagDto,
} from "@/services/subscription/types";

/**
 * DEV ADAPTER — isolated by design, same pattern as `services/scope/scope.dev-adapter.ts`
 * and `services/tenant-permission/tenant-permission.dev-adapter.ts`. There is no
 * Subscription/Package backend at all (domain model or API) — this is a pure UI-architecture
 * placeholder per the brief's explicit instruction to build against mock data behind hooks.
 * MUST be replaced with real service calls once the backend exists.
 */

interface PackageRecord extends Omit<PackageDetailDto, "history"> {
  history: PackageHistoryEntryDto[];
}

let groups: PackageGroupDto[] = [
  { id: "grp-core", name: "Core Platform", description: "Base capabilities every tenant can subscribe to." },
  { id: "grp-addons", name: "Add-ons", description: "Optional capability packs layered on top of core." },
];

let tags: PackageTagDto[] = [
  { id: "tag-popular", name: "Popular" },
  { id: "tag-beta", name: "Beta" },
  { id: "tag-enterprise", name: "Enterprise" },
];

const now = new Date().toISOString();

let packages: PackageRecord[] = [
  {
    id: "pkg-standard",
    name: "Standard",
    groupId: "grp-core",
    tagIds: ["tag-popular"],
    status: "active",
    description: "Core tenant management, permission scope, and localization.",
    createdAt: now,
    updatedAt: now,
    history: [{ id: "hist-1", changedAt: now, changedBy: "system", summary: "Package created." }],
  },
  {
    id: "pkg-enterprise",
    name: "Enterprise",
    groupId: "grp-core",
    tagIds: ["tag-enterprise"],
    status: "active",
    description: "Standard plus dedicated support and audit trail.",
    createdAt: now,
    updatedAt: now,
    history: [{ id: "hist-2", changedAt: now, changedBy: "system", summary: "Package created." }],
  },
  {
    id: "pkg-analytics",
    name: "Advanced Analytics",
    groupId: "grp-addons",
    tagIds: ["tag-beta"],
    status: "active",
    description: "Usage dashboards and export tooling.",
    createdAt: now,
    updatedAt: now,
    history: [{ id: "hist-3", changedAt: now, changedBy: "system", summary: "Package created." }],
  },
  {
    id: "pkg-legacy-sso",
    name: "Legacy SSO",
    groupId: "grp-addons",
    tagIds: [],
    status: "archived",
    description: "Superseded single sign-on integration.",
    createdAt: now,
    updatedAt: now,
    history: [
      { id: "hist-4", changedAt: now, changedBy: "system", summary: "Package created." },
      { id: "hist-5", changedAt: now, changedBy: "system", summary: "Archived — superseded by platform SSO." },
    ],
  },
];

function toSummary(record: PackageRecord): PackageSummaryDto {
  return { id: record.id, name: record.name, groupId: record.groupId, tagIds: record.tagIds, status: record.status };
}

export interface ListPackagesParams {
  search?: string;
  page: number;
  pageSize: number;
}

export async function listPackages(params: ListPackagesParams): Promise<PaginatedResult<PackageSummaryDto>> {
  const term = params.search?.trim().toLowerCase();
  const filtered = term ? packages.filter((pkg) => pkg.name.toLowerCase().includes(term)) : packages;
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize).map(toSummary);

  return {
    items,
    pageNumber: params.page,
    pageSize: params.pageSize,
    totalCount: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / params.pageSize)),
    hasNextPage: start + params.pageSize < filtered.length,
    hasPreviousPage: params.page > 1,
  };
}

export async function getPackage(id: string): Promise<PackageDetailDto> {
  const record = packages.find((pkg) => pkg.id === id);
  if (!record) throw new Error(`Package "${id}" not found.`);
  return record;
}

export interface CreatePackageInput {
  name: string;
  groupId: string | null;
  tagIds: string[];
  description?: string | null;
}

export async function createPackage(input: CreatePackageInput): Promise<string> {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  packages = [
    ...packages,
    {
      id,
      name: input.name,
      groupId: input.groupId,
      tagIds: input.tagIds,
      status: "active",
      description: input.description ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [{ id: crypto.randomUUID(), changedAt: timestamp, changedBy: "you", summary: "Package created." }],
    },
  ];
  return id;
}

export interface UpdatePackageInput {
  name: string;
  groupId: string | null;
  tagIds: string[];
  description?: string | null;
  status: PackageStatus;
}

export async function updatePackage(id: string, input: UpdatePackageInput): Promise<void> {
  const timestamp = new Date().toISOString();
  packages = packages.map((pkg) =>
    pkg.id === id
      ? {
          ...pkg,
          name: input.name,
          groupId: input.groupId,
          tagIds: input.tagIds,
          description: input.description ?? null,
          status: input.status,
          updatedAt: timestamp,
          history: [
            ...pkg.history,
            { id: crypto.randomUUID(), changedAt: timestamp, changedBy: "you", summary: "Package updated." },
          ],
        }
      : pkg,
  );
}

export async function listGroups(): Promise<PackageGroupDto[]> {
  return groups;
}

export interface UpsertGroupInput {
  name: string;
  description?: string | null;
}

export async function createGroup(input: UpsertGroupInput): Promise<PackageGroupDto> {
  const group: PackageGroupDto = { id: crypto.randomUUID(), name: input.name, description: input.description ?? null };
  groups = [...groups, group];
  return group;
}

export async function updateGroup(id: string, input: UpsertGroupInput): Promise<PackageGroupDto> {
  let updated: PackageGroupDto | undefined;
  groups = groups.map((group) => {
    if (group.id !== id) return group;
    updated = { ...group, name: input.name, description: input.description ?? null };
    return updated;
  });
  if (!updated) throw new Error(`Package group "${id}" not found.`);
  return updated;
}

export async function deleteGroup(id: string): Promise<void> {
  groups = groups.filter((group) => group.id !== id);
  packages = packages.map((pkg) => (pkg.groupId === id ? { ...pkg, groupId: null } : pkg));
}

export interface UpsertTagInput {
  name: string;
}

export async function listTags(): Promise<PackageTagDto[]> {
  return tags;
}

export async function createTag(input: UpsertTagInput): Promise<PackageTagDto> {
  const tag: PackageTagDto = { id: crypto.randomUUID(), name: input.name };
  tags = [...tags, tag];
  return tag;
}

export async function updateTag(id: string, input: UpsertTagInput): Promise<PackageTagDto> {
  let updated: PackageTagDto | undefined;
  tags = tags.map((tag) => {
    if (tag.id !== id) return tag;
    updated = { ...tag, name: input.name };
    return updated;
  });
  if (!updated) throw new Error(`Package tag "${id}" not found.`);
  return updated;
}

export async function deleteTag(id: string): Promise<void> {
  tags = tags.filter((tag) => tag.id !== id);
  packages = packages.map((pkg) => ({ ...pkg, tagIds: pkg.tagIds.filter((tagId) => tagId !== id) }));
}
