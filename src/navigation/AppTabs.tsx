// src/navigation/AppTabs.tsx
import HomeScreen from '~/screens/Home';
import { Avatar } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/lib/typescript/react-navigation';
const Tab = createMaterialBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Profile"
        // component={ProfileScreen}
        options={{
          tabBarIcon: ({ size }: { size: number }) => (
            <Avatar.Image
              size={size}
              source={{ uri: 'https://i.pravatar.cc/100' }} // <-- imagem de exemplo
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
