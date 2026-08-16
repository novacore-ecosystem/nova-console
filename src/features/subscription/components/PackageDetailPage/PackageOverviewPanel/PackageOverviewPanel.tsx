import { formatDateTime } from "@novacore/frontend-foundation";
import { Badge, PageSection } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { PackageDetailDto, PackageGroupDto, PackageTagDto } from "@/services/subscription";

export interface PackageOverviewPanelProps {
  pkg: PackageDetailDto;
  groups: PackageGroupDto[];
  tags: PackageTagDto[];
}

export function PackageOverviewPanel({ pkg, groups, tags }: PackageOverviewPanelProps) {
  const { t } = useAppTranslation();
  const groupName = groups.find((group) => group.id === pkg.groupId)?.name ?? t("subscription.form.noGroup", "No group");
  const packageTags = tags.filter((tag) => pkg.tagIds.includes(tag.id));

  return (
    <PageSection title={t("subscription.overview.title", "Identity")}>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm md:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">{t("subscription.form.group", "Group")}</dt>
          <dd>{groupName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("subscription.form.tags", "Tags")}</dt>
          <dd className="flex flex-wrap gap-1">
            {packageTags.length > 0 ? (
              packageTags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("subscription.overview.createdAt", "Created")}</dt>
          <dd>{formatDateTime(pkg.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("subscription.overview.updatedAt", "Updated")}</dt>
          <dd>{formatDateTime(pkg.updatedAt)}</dd>
        </div>
        <div className="col-span-2 md:col-span-3">
          <dt className="text-muted-foreground">{t("subscription.form.description", "Description")}</dt>
          <dd>{pkg.description ?? t("tenant.overview.none", "Not set")}</dd>
        </div>
      </dl>
    </PageSection>
  );
}
