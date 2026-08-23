/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full API base including `/api/v1`. Required for staging/production builds. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
