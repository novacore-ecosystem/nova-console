import type { Config } from "tailwindcss";

// nova-console's own Tailwind build — utilities only (see globals.css). The shared
// `@novacore/frontend-next-shadcn/styles.css` import already provides Preflight/base and
// every vendored component's own styles, precompiled from that package's own source only
// (it has no visibility into this app's source). Any Tailwind class written directly in
// `src/**` needs THIS build to actually emit CSS for it — without it, such classes are
// inert strings. Token mapping is copied verbatim from the shared package's own
// `tailwind.config.ts` (same `--nc-*` CSS variables, set globally by `<AdminProvider>`) so
// nova-console's own classes stay visually identical to the shared package's, never a
// second source of truth for color/radius values.
//
// The shared package's source is ALSO scanned here — not just this app's own `src/`.
// Two independently-compiled Tailwind stylesheets that happen to share a utility class
// name (e.g. both emit `.hidden{}`) collide: whichever file is concatenated last wins for
// *every* element using that class anywhere on the page, including the shared package's
// own responsive variants (`.hidden` + `.md:block` on `<AdminSidebar>`'s wrapping `<aside>`
// silently broke this way — this app's own `.hidden` rule, with no matching `md:block`
// override in its own build, ended up last in the cascade and won unconditionally).
// Scanning both content trees makes this build a self-consistent superset — Tailwind
// always emits unconditional utilities before responsive-variant ones within one build, so
// the last matching rule for any class combination is always the correct one, regardless
// of import order.
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "../common/frontend-nextjs/packages/shadcn/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--nc-border) / <alpha-value>)",
        input: "hsl(var(--nc-input) / <alpha-value>)",
        ring: "hsl(var(--nc-ring) / <alpha-value>)",
        background: "hsl(var(--nc-background) / <alpha-value>)",
        foreground: "hsl(var(--nc-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--nc-primary) / <alpha-value>)",
          foreground: "hsl(var(--nc-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--nc-secondary) / <alpha-value>)",
          foreground: "hsl(var(--nc-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--nc-destructive) / <alpha-value>)",
          foreground: "hsl(var(--nc-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--nc-muted) / <alpha-value>)",
          foreground: "hsl(var(--nc-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--nc-accent) / <alpha-value>)",
          foreground: "hsl(var(--nc-accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--nc-popover) / <alpha-value>)",
          foreground: "hsl(var(--nc-popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--nc-card) / <alpha-value>)",
          foreground: "hsl(var(--nc-card-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--nc-success) / <alpha-value>)",
          foreground: "hsl(var(--nc-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--nc-warning) / <alpha-value>)",
          foreground: "hsl(var(--nc-warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--nc-info) / <alpha-value>)",
          foreground: "hsl(var(--nc-info-foreground) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--nc-sidebar) / <alpha-value>)",
          foreground: "hsl(var(--nc-sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--nc-sidebar-border) / <alpha-value>)",
          accent: "hsl(var(--nc-sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--nc-sidebar-accent-foreground) / <alpha-value>)",
          primary: "hsl(var(--nc-sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--nc-sidebar-primary-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--nc-radius)",
        md: "calc(var(--nc-radius) - 2px)",
        sm: "calc(var(--nc-radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
