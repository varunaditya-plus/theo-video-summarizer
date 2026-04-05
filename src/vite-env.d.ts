/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical origin + optional path prefix, e.g. https://pages.dev/theo-summarizer */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
