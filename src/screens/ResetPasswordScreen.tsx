import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { useRoute } from '@react-navigation/native';
import { apiUrl } from '~/global/urlReq';


export default function ResetPasswordScreen() {
  const { control, handleSubmit } = useForm<{ password: string }>();
  const route = useRoute();
  const { resetToken } = route.params as { resetToken: string };


  const onSubmit = async ({ password }: { password: string }) => {
    try {
      const res = await fetch(`${apiUrl}/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Sucesso',
        textBody: 'Sua senha foi redefinida!',
        button: 'OK',
      });
    } catch (err: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro',
        textBody: err.message,
        button: 'OK',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
      <Text style={styles.subtitle}>Digite sua nova senha abaixo:</Text>

      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Redefinir senha" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    marginTop: 12,
  },
});
