/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_RESEND_API_KEY: string;
  readonly VITE_CONTACT_EMAIL: string;
  // other environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}