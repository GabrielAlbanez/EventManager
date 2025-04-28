// src/navigation/MainNavigator.tsx
import AuthNavigator from './AuthNavigator';
import AppTabs from './AppTabs';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import InitilScreen from '~/screens/InitilScreen';

export default function MainNavigator() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const user = await AsyncStorage.getItem('user');
      setIsAuthenticated(!!user);
      setIsChecking(false);
    };
    checkToken();
  }, []);

  if (isChecking) {
    return <InitilScreen />; // só mostra enquanto verifica
  }

  // Deep linking configuration
  const linking = {
    prefixes: ['myapp://'], // URL scheme que irá abrir seu app
    config: {
      screens: {
        ResetPassword: 'reset-password/:resetToken', // Mapeia a URL de deep link para a tela de redefinir senha
        // Defina outras rotas aqui, se necessário
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <AppTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
