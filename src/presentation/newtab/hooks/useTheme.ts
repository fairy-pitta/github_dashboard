import { useState, useEffect } from 'react';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedTheme = await storage.get<Theme>(StorageKeys.THEME);
        
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
          applyTheme(savedTheme);
        } else {
          // Default to light theme
          applyTheme('light');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        applyTheme('light');
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);

    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.THEME, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return { theme, toggleTheme, loading };
}

