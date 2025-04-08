import { createMaterialBottomTabNavigator } from 'react-native-paper/lib/typescript/react-navigation';
import HomeScreen from '../screens/Home';
import ProfileScreen from '~/screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
