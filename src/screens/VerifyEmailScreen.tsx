import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import {
  Portal,
  Dialog,
  Paragraph,
  Button,
  Provider as PaperProvider,
} from 'react-native-paper';
import {ALERT_TYPE } from 'react-native-alert-notification';

const otpSchema = z.object({
  otp: z.string().min(6, 'Código deve ter 6 dígitos'),
});

type FormData = z.infer<typeof otpSchema>;

export default function VerifyEmailScreen() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
  });

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { email, showDialog } = route.params as any;

  const [visible, setVisible] = useState(showDialog);
  const [verified, setVerified] = useState(false);
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  const hideSuccessDialog = () => {
    setSuccessDialogVisible(false);
    navigation.navigate('Login');
  };




  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('http://172.16.6.11:5000/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: data.otp }),
      });

      if (response.status === 200) {
        setVerified(true);
        setSuccessDialogVisible(true);
        Keyboard.dismiss();
      } else {
        const result = await response.json();
        Alert.alert('Erro', result.message || 'Falha na verificação');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível verificar o código');
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch('http://172.16.6.11:5000/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Código reenviado com sucesso');
      }

      if (!response.ok) {
        const result = await response.json();
        Alert.alert('Erro', result.message || 'Erro ao reenviar código');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao reenviar o código');
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Conta criada com sucesso! 🎉</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Enviamos um código para <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Verifique
              seu e-mail para ativar sua conta.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={successDialogVisible} onDismiss={hideSuccessDialog}>
          <Dialog.Title>Verificação bem-sucedida! ✅</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Sua conta foi verificada com sucesso. Você já pode fazer login.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideSuccessDialog}>Ir para Login</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.container}>
        <Text style={styles.title}>Verificação de E-mail</Text>

        {!verified ? (
          <>
            <Text style={styles.description}>
              Um código de 6 dígitos foi enviado para: <Text style={styles.bold}>{email}</Text>
            </Text>

            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="Digite o código"
                    value={value}
                    onChangeText={onChange}
                  />
                  {error && <Text style={styles.error}>{error.message}</Text>}
                </>
              )}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resend}>Reenviar código</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resend: {
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
