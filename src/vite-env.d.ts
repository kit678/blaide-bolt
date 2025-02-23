/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_RESEND_API_KEY: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ADMIN_EMAIL: string;
  // Add any other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};