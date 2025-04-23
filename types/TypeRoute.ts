import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  InitilScreenen: undefined;
  Home: undefined;
  VerifyEmailScreen: { email: string, showDialog : boolean };
  Root: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
