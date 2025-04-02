import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
