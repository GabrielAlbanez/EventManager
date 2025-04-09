import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

export const customTheme = {
  ...DefaultTheme,
  custom: 'property',
  colors: {
    ...DefaultTheme.colors,
    primary: '#fff', // 👈 tira o ripple roxo
    
  },
};