import type { Metadata } from "next";
import "@novacore/frontend-next-shadcn/styles.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Nova Console",
  description:
    "NovaCore's central administration console for tenants, scopes, security, localization, and platform configuration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
