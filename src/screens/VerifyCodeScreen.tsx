import React, { useState, useTransition } from 'react';
import { View, Text, Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { apiUrl } from '~/global/urlReq';
import InputField from 'components/InputField';
import CustomButton from 'components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';

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
  const { email } = route.params as any;

  const [verified, setVerified] = useState(false);
  const [isPending, startTransition] = useTransition();

  const showError = (message: string) => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Erro',
      textBody: message,
      button: 'OK',
    });
  };

  const showSuccess = (message: string) => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Sucesso',
      textBody: message,
      button: 'OK',
      onPressButton: () => navigation.navigate('Login'),
    });
  };

  const onSubmit = (data: FormData) => {
    startTransition(() => {
      fetch(`${apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: data.otp }),
      })
        .then(async (response) => {
          if (response.status === 200) {
            setVerified(true);
            Keyboard.dismiss();
            showSuccess('E-mail verificado com sucesso!');
          } else {
            const result = await response.json();
            showError(result.message ?? 'Falha na verificação');
          }
        })
        .catch(() => {
          showError('Não foi possível verificar o código');
        });
    });
  };

  const resendOtp = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Código reenviado',
          textBody: 'Verifique seu e-mail.',
          button: 'OK',
        });
      } else {
        const result = await response.json();
        showError(result.message || 'Erro ao reenviar código');
      }
    } catch (error: any) {
      showError('Falha ao reenviar o código');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifique seu e-mail</Text>
      <Text style={styles.description}>
        Um código de 6 dígitos foi enviado para <Text style={styles.email}>{email}</Text>
      </Text>

      {!verified && (
        <>
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <InputField
                  label="Código de verificação"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                  editable={!isPending}
                  icon={
                    <MaterialIcons
                      name="pin"
                      size={20}
                      color="#22c55e"
                      style={{ marginRight: 5 }}
                    />
                  }
                />
                {error && <Text style={styles.error}>{error.message}</Text>}
              </>
            )}
          />

          <CustomButton
            label={isPending ? 'Verificando...' : 'Verificar'}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          />

          <TouchableOpacity onPress={resendOtp} style={{ marginTop: 16 }}>
            <Text style={styles.resendText}>Reenviar código</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  email: {
    fontWeight: 'bold',
    color: '#16a34a',
  },
  resendText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});
