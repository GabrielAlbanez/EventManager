import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar, useTheme } from 'react-native-paper';

import HomeScreen from '~/screens/Home';
import ProfileScreen from '~/screens/ProfileScreen';
import { useUser } from 'context/UserContext';
import { ConfigScreen } from '~/screens/ConfigScreen';
import { useThemeContext } from 'context/ThemeProvider';
import EventosScreen from '~/screens/EventosScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

interface CustomTabBarButtonProps {
  children: React.ReactNode;
  onPress: () => void;
}

const CustomTabBarButton = ({ children, onPress }: CustomTabBarButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.customButton} activeOpacity={0.2}>
    <View style={styles.fab}>{children}</View>
  </TouchableOpacity>
);

export default function AppTabs() {
  const { user } = useUser();
  const { isDark, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const getProfileImageUri = () => {
    if (!user?.profile_image) {
      return 'https://via.placeholder.com/100';
    }

    const isUrl = user.profile_image.startsWith('http');
    if (user.providerType ?? user.provedorType === 'google') {
      return isUrl
        ? user.profile_image
        : `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`;
    }

    return `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`;
  };

  const profileImageUri = getProfileImageUri();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: theme.colors.surface, left : 25 , right : 25 }, // adapta à cor do tema
        ],
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="home"
                size={28}
                color={focused ? theme.colors.primary : theme.colors.outline}
              />
              <Text style={{ color: focused ? theme.colors.primary : theme.colors.outline, fontSize: 12 }}>
                Início
              </Text>
            </View>
          ),
          tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1} />,
        }}
      />

      <Tab.Screen
        name="Eventos"
        component={EventosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="map-legend"
                size={28}
                color={focused ? theme.colors.primary : theme.colors.outline}
              />
              <Text style={{ color: focused ? theme.colors.primary : theme.colors.outline, fontSize: 12 }}>
                Eventos
              </Text>
            </View>
          ),
          tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1} />,
        }}
      />

      <Tab.Screen
        name="Find"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: () => (
            <MaterialCommunityIcons name="map-search-outline" size={32} color="#fff" />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={ConfigScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="cog"
                size={28}
                color={focused ? theme.colors.primary : theme.colors.outline}
              />
              <Text style={{ color: focused ? theme.colors.primary : theme.colors.outline, fontSize: 12 }}>
                Configs
              </Text>
            </View>
          ),
          tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1} />,
        }}
      />

      <Tab.Screen
        name="maps"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <Avatar.Image
                size={28}
                source={{ uri: profileImageUri }}
                style={{ backgroundColor: 'transparent' }}
              />
              <Text style={{ color: focused ? theme.colors.primary : theme.colors.outline, fontSize: 12 }}>
                Perfil
              </Text>
            </View>
          ),
          tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={1} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 0,

    borderRadius: 20,
    height: 80,
    shadowColor: '#38a169',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 12,
    borderTopWidth: 0,
  },
  icon: {
    width: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
    top: 20,
  },
  customButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2f855a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
