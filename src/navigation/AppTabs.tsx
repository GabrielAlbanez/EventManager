import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '~/screens/Home';
import ProfileScreen from '~/screens/ProfileScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { View } from 'react-native';

const Tab = createMaterialBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#1b1b1b"
      inactiveColor="#cccccc"
      barStyle={{
        backgroundColor: '#ffff',
        borderTopColor: '#1b1b1b',
        borderTopWidth: 20,   
        elevation: 5,
        height: 60,
        justifyContent: 'center',
      }}
      shifting={false}>
      <Tab.Screen
        name="Home"
        
        component={HomeScreen}
        options={{
          tabBarLabel: '',
          tabBarRippleColor: 'transparent',
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="home-outline" size={28} color="gray" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
          tabBarRippleColor: '#ffff',

          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person-circle-outline" size={28} color="gray" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
