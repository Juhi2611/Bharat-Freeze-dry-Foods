import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Plugin to strip dev-only `data-tsd-source` attributes injected by TanStack DevTools,
// eliminating React dev hydration mismatch warnings on element source tags.
function stripTsdSourcePlugin() {
  return {
    name: "strip-tsd-source",
    enforce: "post" as const,
    transform(code: string, id: string) {
      if (id.includes("/src/") && (id.endsWith(".tsx") || id.endsWith(".jsx") || id.endsWith(".ts") || id.endsWith(".js"))) {
        if (code.includes("data-tsd-source")) {
          return {
            code: code.replace(/\s+data-tsd-source="[^"]*"/g, ""),
            map: null,
          };
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [stripTsdSourcePlugin()],
});
