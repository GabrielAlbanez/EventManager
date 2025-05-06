import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import InputField from 'components/InputField';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'; // ajuste conforme lib usada
import { apiUrl } from 'global/urlReq';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<NavigationProp>();

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
    });
  };

  const handleSendCode = async () => {
    if (!email) {
      return showError('Por favor, preencha o email.');
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/forgot-password`, { email });

      showSuccess(response.data.message);
      navigation.navigate('VerifyCodeScreen', { email });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Erro ao enviar o código. Tente novamente.';
      showError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci minha senha</Text>

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
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

      <Button title="Enviar código" onPress={handleSendCode} />
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
});
