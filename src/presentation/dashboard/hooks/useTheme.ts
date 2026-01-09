import { useState, useEffect } from 'react';
import { StorageKeys } from '@/application/config/StorageKeys';
import { useServices } from '../../context/ServiceContext';

export type Theme = 'light' | 'dark' | 'light-blue' | 'light-purple' | 'light-green' | 'light-pink' | 'light-white';

export function useTheme() {
  const services = useServices();
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storage = services.getStorage();
        const savedTheme = await storage.get<Theme>(StorageKeys.THEME);
        
        const validThemes: Theme[] = ['light', 'dark', 'light-blue', 'light-purple', 'light-green', 'light-pink', 'light-white'];
        if (savedTheme && validThemes.includes(savedTheme as Theme)) {
          setTheme(savedTheme as Theme);
          applyTheme(savedTheme as Theme);
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
  }, [services]);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setThemeValue = async (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);

    try {
      const storage = services.getStorage();
      await storage.set(StorageKeys.THEME, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    await setThemeValue(newTheme);
  };

  return { theme, toggleTheme, setThemeValue, loading };
}

