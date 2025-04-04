import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  Home : undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
