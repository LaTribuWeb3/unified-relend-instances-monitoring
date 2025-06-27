/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_L1_RPC_URL: string
  readonly VITE_L1_API_ENDPOINT: string
  readonly VITE_L2_API_ENDPOINT: string
  readonly VITE_REFRESH_INTERVAL: string
  readonly VITE_ENABLE_AUTO_REFRESH: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 