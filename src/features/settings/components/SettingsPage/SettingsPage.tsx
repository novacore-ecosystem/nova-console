"use client";

import Link from "next/link";
import {
  AdminBreadcrumb,
  Button,
  FormActions,
  FormField,
  FormSection,
  PageContainer,
  PageHeader,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type ThemeMode,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useSettingsPage } from "@/features/settings/components/SettingsPage/useSettingsPage";

export function SettingsPage() {
  const { t } = useAppTranslation();
  const { mode, setMode, isDirty, save, cancel } = useSettingsPage();

  const modeOptions: { value: ThemeMode; label: string }[] = [
    { value: "light", label: t("settings.appearance.modeLight", "Light") },
    { value: "dark", label: t("settings.appearance.modeDark", "Dark") },
    { value: "system", label: t("settings.appearance.modeSystem", "Match system") },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={t("settings.title", "Settings")}
        description={t("settings.description", "Manage how NovaCore Console looks and behaves for you.")}
        breadcrumb={<AdminBreadcrumb items={[{ label: t("settings.title", "Settings") }]} />}
      />
      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">{t("settings.tabAppearance", "Appearance")}</TabsTrigger>
          <TabsTrigger value="language">{t("settings.tabLanguage", "Language")}</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <FormSection
            title={t("settings.appearance.title", "Theme")}
            description={t(
              "settings.appearance.description",
              "Choose how the content area looks. Navigation stays on the NovaCore brand theme regardless of this setting.",
            )}
          >
            <FormField label={t("settings.appearance.modeLabel", "Mode")} htmlFor="settings-appearance-mode">
              <Select
                value={mode}
                onValueChange={(value) => setMode(value as ThemeMode)}
                options={modeOptions}
              />
            </FormField>
            <FormActions>
              <Button variant="outline" onClick={cancel} disabled={!isDirty}>
                {t("common.actions.cancel", "Cancel")}
              </Button>
              <Button onClick={save} disabled={!isDirty}>
                {t("common.actions.save", "Save")}
              </Button>
            </FormActions>
          </FormSection>
        </TabsContent>

        <TabsContent value="language">
          <FormSection
            title={t("settings.language.title", "Console language")}
            description={t(
              "settings.language.description",
              "Browse and override translation values used across the console.",
            )}
          >
            <Button variant="outline" asChild>
              <Link href="/localization">{t("settings.language.goTo", "Open Console Language")}</Link>
            </Button>
          </FormSection>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
