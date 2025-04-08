import 'react-native-gesture-handler';  // Importando o Gesture Handler
// App.tsx
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AuthNavigator.tsx';
import "./global.css"; // Import global styles
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
