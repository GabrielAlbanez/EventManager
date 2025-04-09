import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  InitilScreenen : undefined;
  Home : undefined;
  Root : undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
