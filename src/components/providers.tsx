"use client";

import { Toaster } from "sonner";
import { I18nProvider } from "./i18n-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </I18nProvider>
  );
}
