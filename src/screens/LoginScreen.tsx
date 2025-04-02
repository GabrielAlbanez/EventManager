import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Button, TextInput, Checkbox, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [rememberMe, setRememberMe] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <Animated.View style={styles.container1} entering={ZoomIn.duration(800)}>
          <Avatar.Image size={120} source={require('../../assets/irelia.jpg')} />
        </Animated.View>

        <Animated.View style={styles.card} entering={ZoomIn.duration(1000)}>
          <Text style={styles.title}>Faça login para continuar</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.email}
                style={styles.input}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Senha"
                mode="outlined"
                secureTextEntry
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.password}
                style={styles.input}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <View style={styles.optionsContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
              />
              <Text style={styles.rememberMeText}>Lembrar-me</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
            Entrar
          </Button>

          <Button
            mode="outlined"
            onPress={() => console.log('Login com Google')}
            style={styles.googleButton}
          >
            Entrar com Google
          </Button>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,    
  },
  card: {
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
  },
  signupContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  rememberMeText: {
    fontSize: 17,
    color: '#6B7280',
    marginLeft: 2,
  },
  forgotPassword: {
    fontSize: 17,
    color: '#2563EB',
    marginLeft: 'auto',
  },
  googleButton: {
    marginTop: 8,
    width: '100%',
    borderColor: '#4285F4',
  },
  container1: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 33,
    marginBottom: 30,
  },
});
