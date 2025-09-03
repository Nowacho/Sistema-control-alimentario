/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // más variables de entorno que uses...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}