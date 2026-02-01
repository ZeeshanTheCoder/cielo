'use client';
import {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import {
  translations,
  type Language,
  type Translations,
} from '@/lib/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('cielo-lang') as Language | null;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    }
  }, []);

  const setLanguageAndStore = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('cielo-lang', lang);
  };

  const t = useMemo(() => {
    const currentTranslations = translations[language];
    return (key: keyof Translations): string => {
      return currentTranslations[key] || translations.en[key] || String(key);
    };
  }, [language]);

  const value = {
    language,
    setLanguage: setLanguageAndStore,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
