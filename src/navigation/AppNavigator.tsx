// src/navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import InitilScreenen from '../screens/InitilScreen';
import LoginScreen from '~/screens/LoginScreen';
import HomeScreen from '~/screens/Home';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="InitilScreenen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InitilScreenen" component={InitilScreenen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
