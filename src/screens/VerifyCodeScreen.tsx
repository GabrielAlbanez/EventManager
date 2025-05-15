import React, { useState, useTransition } from 'react';
import { View, Text, Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import InputField from 'components/InputField';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { apiUrl } from '~/global/urlReq';
import CustomButton from 'components/CustomButton';
import { set } from 'react-hook-form';

export default function VerifyCodeScreen() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const [isPending, setIsPending] = useState<boolean>(false);

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

  const handleVerifyCode = () => {
    if (!code || !password || !email) {
      return showError('Preencha todos os campos.');
    }

    setIsPending(true);

    fetch(`${apiUrl}/auth/verify-password-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: code, new_password: password }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? 'Erro ao verificar o código. Tente novamente.');
        }

        Keyboard.dismiss();
        showSuccess(data.message);
      })
      .catch((error: any) => {
        showError(error.message);
      });
    setIsPending(false);
  };

  const handleResendCode = async () => {
    setIsPending(true);
    try {
      await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Código reenviado',
        textBody: 'Verifique seu e-mail.',
        button: 'OK',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao reenviar o código.';
      showError(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifique seu e-mail</Text>
      <Text style={styles.description}>
        Um código de 6 dígitos foi enviado para <Text style={styles.email}>{email}</Text>
      </Text>

      <InputField
        label="Código de verificação"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        editable={!isPending}
        icon={<MaterialIcons name="pin" size={20} color="#22c55e" style={{ marginRight: 5 }} />}
      />

      <InputField
        label="Nova senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isPending}
        icon={
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#22c55e"
            style={{ marginRight: 5 }}
          />
        }
      />

      <CustomButton
        style={isPending ? { opacity: 0.5 } : {}}
        label={isPending ? 'Alterando...' : 'Alterar senha'}
        onPress={handleVerifyCode}
        disabled={isPending}
      />

      <TouchableOpacity
        disabled={isPending}
        onPress={handleResendCode}
        style={isPending ? { opacity: 0.5, marginTop: 16 } : { marginTop: 16 }}>
        <Text style={styles.resendText}>
          {isPending ? 'Reenviando o código...' : 'Reenviar código'}
        </Text>
      </TouchableOpacity>
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
});
