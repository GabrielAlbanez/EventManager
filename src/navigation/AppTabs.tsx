import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';

import HomeScreen from '~/screens/Home';
import ProfileScreen from '~/screens/ProfileScreen';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useUser } from 'context/UserContext';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabBarButton = (props: BottomTabBarButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={1}
      style={[props.style, { flex: 1 }]}
    >
      {props.children}
    </TouchableOpacity>
  );
};

export default function AppTabs() {
  const { user } = useUser();

  const getProfileImageUri = () => {
    if (!user?.profile_image) {
      return 'https://via.placeholder.com/100';
    }

    const isUrl = user.profile_image.startsWith('http');
    if (user.providerType === 'google') {
      return isUrl
        ? user.profile_image
        : `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`;
    }

    return `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`;
  };

  const profileImageUri = getProfileImageUri();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarButton: CustomTabBarButton,
        tabBarIcon: ({ focused }) => {
          const isHome = route.name === 'Home';

          return (
            <View style={styles.iconWrapper}>
              {isHome ? (
                <MaterialCommunityIcons
                  name={focused ? 'home' : 'home-outline'}
                  size={28}
                  color={focused ? '#1b1b1b' : '#A0AEC0'}
                />
              ) : (
                <Avatar.Image
                  size={28}
                  source={{ uri: profileImageUri }}
                />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    height: 65,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    top: 5,
  },
});
