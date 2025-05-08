import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { apiUrl } from '~/global/urlReq';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { useUser } from 'context/UserContext';

export const ConfigScreen = () => {
  const { user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(user?.biometric ?? false);
  const [isPending, startTransition] = useTransition();

  const handleToggleBiometric = (value: boolean) => {
    setIsBiometricEnabled(value);

    startTransition(() => {
      fetch(`${apiUrl}/user/settings/${user?.id}/biometric`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ biometric: value }),
      })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Erro ao salvar preferência');
          }
        })
        .catch(error => {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Erro',
            textBody: error.message,
            button: 'OK',
          });
          setIsBiometricEnabled(prev => !prev); // desfaz alteração
        });
    });
  };

  const handleToggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    // Integrar com ThemeContext ou AsyncStorage se necessário
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Modo Escuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleToggleDarkMode}
          thumbColor={isDarkMode ? '#16a34a' : '#ccc'}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Usar digital para login</Text>
        <Switch
          value={isBiometricEnabled}
          onValueChange={handleToggleBiometric}
          disabled={isPending}
          thumbColor={isBiometricEnabled ? '#16a34a' : '#ccc'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 24,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
});
