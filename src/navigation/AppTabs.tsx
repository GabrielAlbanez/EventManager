import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '~/screens/Home';
import ProfileScreen from '~/screens/ProfileScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Avatar } from 'react-native-paper';
import { useUser } from 'hooks/user';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// ✅ Componente seguro para sobrescrever o tabBarButton
const CustomTabBarButton = (props: BottomTabBarButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={1}
      delayLongPress={props.delayLongPress ?? undefined} // Ensure delayLongPress is not null
      disabled={props.disabled ?? undefined} // Ensure disabled is not null
      onBlur={props.onBlur ?? undefined} // Ensure onBlur is not null
      style={[props.style, { flex: 1 }]} // mantém o layout correto
    >
      {props.children}
    </TouchableOpacity>
  );
};

export default function AppTabs() {
  const { user, loading, updateUser } = useUser();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarButton: CustomTabBarButton,
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconWrapper}>
            {route.name === 'Home' ? (
              <MaterialCommunityIcons
                name={focused ? 'home' : 'home-outline'}
                size={28}
                color={focused ? '#1b1b1b' : '#A0AEC0'}
              />
            ) : user?.profile_image ? (
              <Avatar.Image
                size={28}
                source={{
                  uri: `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`,
                }}
              />
            ) : (
              <Avatar.Icon size={28} icon="account" />
            )}
          </View>
        ),
      })}>
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
