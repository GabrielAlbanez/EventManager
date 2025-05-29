import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  InitilScreenen: undefined;
  Home: undefined;
  VerifyEmailScreen: { email: string, showDialog : boolean };
  Root: undefined;
  ForgotPassword : undefined;
  ResetPassword : undefined;
  VerifyCodeScreen : { email: string };
  Eventos  :  undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
