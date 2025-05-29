import 'react-native-gesture-handler'; // Importando o Gesture Handler
// App.tsx
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import './global.css'; // Import global styles
import { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AuthNavigator from '~/navigation/AuthNavigator';
import { PaperProvider } from 'react-native-paper';
import { customTheme } from 'provider/PaperTheme';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { UserProvider } from 'context/UserContext';
import { ThemeProvider } from 'context/ThemeProvider';
import * as NavigationBar from 'expo-navigation-bar';
export default function App() {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden'); // ou 'hidden'
    GoogleSignin.configure({
      iosClientId: '911018498691-p25344q35mgofevt2gtpq8djvdhh6b0p.apps.googleusercontent.com',
      webClientId: '911018498691-akj2ohut3f9brilpdsnosvca66aifudp.apps.googleusercontent.com',
      profileImageSize: 150,
      offlineAccess: true,
    });
  });

  return (
    <ThemeProvider>
      <UserProvider>
        <AlertNotificationRoot>
            <NavigationContainer>
              <AuthNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
        </AlertNotificationRoot>
      </UserProvider>
    </ThemeProvider>
  );
}
