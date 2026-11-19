"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dictionary, type DictKey, type Lang } from "@/lib/i18n/dict";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: DictKey) => string;
};

const I18nContext = createContext<Ctx>({
  lang: "bn",
  setLang: () => {},
  toggle: () => {},
  t: (key) => dictionary[key]?.bn ?? key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = window.localStorage.getItem("rgpi-lang") as Lang | null;
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("rgpi-lang", l);
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => setLang(lang === "bn" ? "en" : "bn"), [lang, setLang]);

  const t = useCallback((key: DictKey) => dictionary[key]?.[lang] ?? key, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, toggle, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
