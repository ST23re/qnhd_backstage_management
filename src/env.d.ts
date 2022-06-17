/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REQUEST_BASE_URL: string | undefined
  readonly VITE_IMAGE_BASE_URL: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
