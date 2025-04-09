// src/navigation/AuthNavigator.tsx
import RegisterScreen from '../screens/RegisterScreen';
import InitilScreenen from '../screens/InitilScreen';
import LoginScreen from '../screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InitilScreenen" component={InitilScreenen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Root" component={AppTabs} />
    </Stack.Navigator>
  );
}
