import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  t: typeof translations.en;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedLanguage = await storage.get<Language>(StorageKeys.LANGUAGE);
        
        if (savedLanguage === 'en' || savedLanguage === 'ja') {
          setLanguageState(savedLanguage);
        } else {
          // Default to English
          setLanguageState('en');
        }
      } catch (error) {
        console.error('Failed to load language:', error);
        setLanguageState('en');
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.LANGUAGE, lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  if (loading) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

