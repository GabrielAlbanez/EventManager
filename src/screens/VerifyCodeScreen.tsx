import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import InputField from 'components/InputField';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'; // ajuste conforme sua lib
import { apiUrl } from 'global/urlReq';

export default function VerifyCodeScreen() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { email } = route.params as { email: string };

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

  const handleVerifyCode = async () => {
    if (!code || !password) {
      return showError('Preencha todos os campos.');
    }

    try {
      const response = await axios.post(`${apiUrl}/atuh/verify-password-code`, {
        email,
        otp: code,
        new_password: password,
      });

      showSuccess(response.data.message);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Erro ao verificar o código. Tente novamente.';
      showError(message);
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Código reenviado',
        textBody: 'Verifique seu e-mail.',
        button: 'OK',
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Erro ao reenviar o código.';
      showError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar código</Text>

      <InputField
        label="Código recebido"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        icon={
          <MaterialIcons
            name="pin"
            size={20}
            color="#22c55e"
            style={{ marginRight: 5 }}
          />
        }
      />

      <InputField
        label="Nova senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        icon={
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#22c55e"
            style={{ marginRight: 5 }}
          />
        }
      />

      <Button title="Alterar senha" onPress={handleVerifyCode} />

      <TouchableOpacity onPress={handleResendCode} style={{ marginTop: 16 }}>
        <Text style={styles.signupLink}>Reenviar código</Text>
      </TouchableOpacity>
    </View>
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
    color: '#14532d',
    marginBottom: 30,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
  },
});
