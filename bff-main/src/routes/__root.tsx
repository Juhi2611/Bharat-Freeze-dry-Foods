import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  SiteFooter,
  SiteNav,
  TopUtilityBar,
  WhatsAppFloat,
} from "@/components/SiteChrome";
import { ScrollFrostLine } from "@/components/ScrollFrostLine";
import { ThemeToggle } from "@/components/ThemeToggle";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-7xl text-gradient-ice">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-frost-white">Page not found</h2>
        <p className="mt-2 text-sm text-steel-silver">
          Looks like this page melted away. Let's get you back to the cold chain.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary-cta px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-frost-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-steel-silver">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary-cta px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-frost-white"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BFF — Bharat Freeze Dry Foods · Sourcing the Best Quality, For You" },
      {
        name: "description",
        content:
          "Premium freeze-dried fruits, vegetables, gravies, spices, meals, superfoods & pet food from India. Frozen at the peak. Preserved for life. Export-grade cold chain.",
      },
      { name: "author", content: "Bharat Freeze Dry Foods" },
      { property: "og:title", content: "BFF — Bharat Freeze Dry Foods" },
      {
        property: "og:description",
        content: "Frozen at the peak. Preserved for life. Export-grade freeze-dried foods from Bharat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "@tanstack/react-router";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <main className="min-h-screen bg-background text-frost-white selection:bg-ice-blue selection:text-deep-navy">
          <Outlet />
        </main>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollFrostLine />
      <TopUtilityBar />
      <SiteNav />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
      <ThemeToggle />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
