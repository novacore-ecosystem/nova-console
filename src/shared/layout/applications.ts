export interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
}

/**
 * The NovaCore ecosystem application switcher. Only Nova Console is implemented — do
 * not add nova-oms/nova-cms/nova-pms/nova-wms until they actually exist and expose a
 * real URL. See docs/decisions/README.md.
 */
export const applications: Application[] = [
  {
    id: "nova-console",
    name: "Nova Console",
    description: "Tenants, scopes, security, localization, platform configuration",
    url: "/",
  },
];
