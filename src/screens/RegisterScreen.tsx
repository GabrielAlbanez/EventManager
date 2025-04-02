import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  address: z.string().min(5, 'Endereço inválido')
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const onSubmit = (data: RegisterForm) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Crie sua conta</Text>
          
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.name}
                style={styles.input}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirmar Senha"
                mode="outlined"
                secureTextEntry
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.confirmPassword}
                style={styles.input}
              />
            )}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}




          <View style={styles.optionsContainer}>
            <Checkbox
              status={agreeTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeTerms(!agreeTerms)}
            />
            <Text style={styles.rememberMeText}>Eu aceito os termos de uso</Text>
          </View>

          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
            Cadastrar
          </Button>

          <Button mode="outlined" onPress={() => console.log('Login com Google')} style={styles.googleButton}>
            Entrar com Google
          </Button>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
  googleButton: {
    marginTop: 8,
    width: '100%',
    borderColor: '#4285F4',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  rememberMeText: {
    fontSize: 17,
    color: '#6B7280',
    marginLeft: 2,
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
});

