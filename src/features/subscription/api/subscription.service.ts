import type { PaginatedResult } from "@novacore/frontend-foundation";
import {
  createGroup,
  createPackage,
  createTag,
  deleteGroup,
  deleteTag,
  getPackage,
  listGroups,
  listPackages,
  listTags,
  updateGroup,
  updatePackage,
  updateTag,
  type CreatePackageInput,
  type ListPackagesParams,
  type PackageDetailDto,
  type PackageGroupDto,
  type PackageSummaryDto,
  type PackageTagDto,
  type UpdatePackageInput,
  type UpsertGroupInput,
  type UpsertTagInput,
} from "@/services/subscription";

export const subscriptionService = {
  async listPackages(params: ListPackagesParams): Promise<PaginatedResult<PackageSummaryDto>> {
    return listPackages(params);
  },
  async getPackage(id: string): Promise<PackageDetailDto> {
    return getPackage(id);
  },
  async createPackage(input: CreatePackageInput): Promise<string> {
    return createPackage(input);
  },
  async updatePackage(id: string, input: UpdatePackageInput): Promise<void> {
    return updatePackage(id, input);
  },
  async listGroups(): Promise<PackageGroupDto[]> {
    return listGroups();
  },
  async createGroup(input: UpsertGroupInput): Promise<PackageGroupDto> {
    return createGroup(input);
  },
  async updateGroup(id: string, input: UpsertGroupInput): Promise<PackageGroupDto> {
    return updateGroup(id, input);
  },
  async deleteGroup(id: string): Promise<void> {
    return deleteGroup(id);
  },
  async listTags(): Promise<PackageTagDto[]> {
    return listTags();
  },
  async createTag(input: UpsertTagInput): Promise<PackageTagDto> {
    return createTag(input);
  },
  async updateTag(id: string, input: UpsertTagInput): Promise<PackageTagDto> {
    return updateTag(id, input);
  },
  async deleteTag(id: string): Promise<void> {
    return deleteTag(id);
  },
};
