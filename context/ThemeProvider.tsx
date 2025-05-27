import React, { createContext, useContext, useEffect, useState } from 'react';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app-theme';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#16a34a',         // verde link
    background: '#ffffff',      // fundo branco
    surface: '#ffffff',
    onSurface: '#000000',       // texto padrão
    text: '#000000',            // fallback
    title: '#14532d',           // verde escuro (título)
    error: '#dc2626',
    secondary: '#64748b',       // texto secundário
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4ade80',         // verde link claro
    background: '#0e0e0e',      // fundo preto
    surface: '#0e0e0e',
    onSurface: '#ffffff',       // texto padrão
    text: '#ffffff',            // fallback
    title: '#16a34a',           // verde mais vivo para título
    error: '#dc2626',
    secondary: '#cbd5e1',       // texto secundário
  },
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') setIsDark(true);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
