import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { apiUrl } from '~/global/urlReq';
import { Dialog, ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useUser } from 'context/UserContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ConfigScreen = () => {
  const { user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(user?.biometric ?? false);
  const [isPending, startTransition] = useTransition();

  const handleToggleBiometric = async (value: boolean) => {
    const accessToken = await AsyncStorage.getItem('access_token');

    setIsBiometricEnabled(value);

    startTransition(() => {
      fetch(`http://172.16.6.11:5000/auth/user/settings/biometric`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ biometric: value }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message ?? 'Erro ao salvar preferência');
          } else {
            // const updatedUser = { ...user, biometric: value };

            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Sucesso',
              textBody: "Preferência atualizada com sucesso",
            });
          }
        })
        .catch((error) => {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Erro',
            textBody: error.message,
          });
          setIsBiometricEnabled((prev) => !prev); // desfaz alteração
        });
    });
  };

  const handleToggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    // Integrar com ThemeContext ou AsyncStorage se necessário
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
        <MaterialCommunityIcons
          name="account-cog-outline"
          size={32}
          color="#1b1b1b"
          style={{ marginRight: 8 }}
        />
      </View>

      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'}
            size={24}
            color="#14532d"
          />
        </View>
        <Text style={styles.label}>Modo Escuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleToggleDarkMode}
          thumbColor={isDarkMode ? '#16a34a' : '#ccc'}
        />
      </View>

      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="fingerprint" size={24} color="#14532d" />
        </View>
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
    padding: 30,
    paddingTop: 70,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    color: '#14532d',
    marginBottom: 24,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 17,
    backgroundColor: '#ffffff',
    shadowColor: '#38a169',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 12, // sombra Android
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    elevation: 4, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
