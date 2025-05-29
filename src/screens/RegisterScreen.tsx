import React, { useState, useTransition } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import RegistrationSVG from '../../assets/registration.svg';
import GoogleSVG from '../../assets/google.svg';
import InputField from 'components/InputField';
import CustomButton from 'components/CustomButton';
import {
  GoogleSignin,
  User,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useUser } from 'context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '~/global/urlReq';

const registerSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const [isAuthenticated, setIsAuthenticated] = useState<null | User>(null);
  const { updateUser } = useUser();

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
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const user = response.data;
        const res = await fetch(`${apiUrl}/auth/googlee`, {
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
    } 
  };

  const onSubmit = async (data: RegisterForm) => {
    const dataWithProviderType = {
      ...data,
      providerType: 'credentials',
    };

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithProviderType),
      });

      const result = await response.json();

      if (!response.ok) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Opss...',
          textBody: result.message ?? 'Erro ao cadastrar. Tente novamente.',
        });
        return;
      }

      navigation.navigate('VerifyEmailScreen', {
        email: data.email,
        showDialog: true,
      });
    } catch (error) {
      console.log(error)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro de conexão',
        textBody: 'Não foi possível conectar ao servidor.',
      });
    }
  };

  const handleFormSubmit = () => {
    startTransition(() => {
      handleSubmit(onSubmit)();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <RegistrationSVG height={300} width={300} style={{ transform: [{ rotate: '-5deg' }] }} />
        </View>

        <Text style={styles.title}>Register</Text>

        <View style={styles.socialLogin}>
          <TouchableOpacity onPress={handleGoogleSignIn} style={styles.socialButton}>
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Or, register with email ...</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Full Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              icon={
                <Ionicons name="person-outline" size={20} color="#666" style={{ marginRight: 5 }} />
              }
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              icon={
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color="#666"
                  style={{ marginRight: 5 }}
                />
              }
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              inputType="password"
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={{ marginRight: 5 }}
                />
              }
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              inputType="password"
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={{ marginRight: 5 }}
                />
              }
            />
          )}
        />

        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <CustomButton label={isPending ? "Registrando..."  : "Registre-se"} disabled={isPending} onPress={handleFormSubmit} />

        <View style={styles.footer}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: 28,
    fontWeight: '500',
    color: '#333',
    marginBottom: 30,
  },
  subtitle: {
    textAlign: 'left',
    color: '#666',
    marginBottom: 30,
  },
  socialLogin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  loginLink: {
    color: '#16a34a',
    fontWeight: '700',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
});
