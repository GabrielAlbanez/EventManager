import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInputProps,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  User,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useUser } from 'context/UserContext';
import LoginSvg from '../../assets/login.svg';
import GoogleSvg from '../../assets/google.svg';
import CustomButton from 'components/CustomButton';
import InputField from 'components/InputField';
import { NavigationProp } from 'types/TypeRoute';

WebBrowser.maybeCompleteAuthSession();

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  Senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;



export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<null | User>(null);
  const { updateUser } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [submiting, setIsSubmiting] = useState(false);

  const showError = (message: string) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Erro no Login',
      textBody: message,
      button: 'OK',
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmiting(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const user = response.data;
        const res = await fetch('http://172.16.6.11:5000/auth/googlee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.user.email,
            token: user.idToken,
            providerType: 'google',
          }),
        });

        const data = await res.json();

        if (res.ok) {
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          updateUser(data.user);
          setIsAuthenticated(data.user);

          navigation.reset({
            index: 0,
            routes: [{ name: 'Root', params: { screen: 'Home' } }],
          });
        } else {
          showError(data.message ?? 'Tente novamente mais tarde');
        }
      } else {
        showError('Erro ao fazer login com o Google');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log('Login em andamento...');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Serviços do Google não disponíveis');
            break;
          default:
            console.log('Erro desconhecido no Google Sign-In:', error);
        }
      } else {
        console.log('Erro inesperado:', error);
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmiting(true);
      const res = await fetch('http://172.16.6.11:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.Senha,
          providerType: 'credentials',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        updateUser(result.user);
        setIsAuthenticated(result.user);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Root', params: { screen: 'Home' } }],
        });
      } else {
        showError(result.message ?? 'Erro no login, tente novamente');
      }
    } catch (err) {
      showError('Erro inesperado. Verifique sua conexão.');
      console.log(err);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <LoginSvg height={300} width={300} style={{ transform: [{ rotate: '-5deg' }] }} />
        </View>

        <Text style={styles.title}>Login</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email"
              defaultValue=""
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              icon={
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color="#22c55e"
                  style={{ marginRight: 5 }}
                />
              }
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="Senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Senha"
              defaultValue=""
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              inputType="password"
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#22c55e"
                  style={{ marginRight: 5 }}
                />
              }
              fieldButtonLabel="Forgot?"
              fieldButtonFunction={() => {}}
            />
          )}
        />
        {errors.Senha && <Text style={styles.errorText}>{errors.Senha.message}</Text>}

        <CustomButton label="Login" onPress={handleSubmit(onSubmit)} />

        <Text style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
          Ou entre com...
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            style={{
              borderColor: '#22c55e',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <GoogleSvg height={24} width={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Novo no app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}> Registre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: '#14532d', // verde escuro
    marginBottom: 30,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  signupText: {
    fontSize: 14,
    color: '#64748b',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
  },
});
