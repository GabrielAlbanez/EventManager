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
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
      setIsChecking(false);
    };
    checkToken();
  }, []);

  if (isChecking) {
    return <InitilScreen />; // só mostra enquanto verifica
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
