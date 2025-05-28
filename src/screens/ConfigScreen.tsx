import React, { useTransition } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useUser } from 'context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { useThemeContext } from 'context/ThemeProvider';
import { MD3Theme } from 'react-native-paper';

export const ConfigScreen = () => {
  const { user } = useUser();
  const { isDark, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const [isBiometricEnabled, setIsBiometricEnabled] = React.useState<boolean>(user?.biometric ?? false);
  const [isPending, startTransition] = useTransition();

  const s = styles(theme); // estilos baseados no tema

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
          }
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Sucesso',
            textBody: 'Preferência atualizada com sucesso',
          });
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

  return (
    <View style={s.container}>
      <View style={s.iconHeader}>
        <MaterialCommunityIcons
          name="account-cog-outline"
          size={32}
          color={theme.colors.onSurface}
          style={{ marginRight: 8 }}
        />
      </View>

      <View style={s.item}>
        <View style={s.iconContainer}>
          <MaterialCommunityIcons
            name={isDark ? 'moon-waning-crescent' : 'white-balance-sunny'}
            size={24}
            color={theme.colors.onSurface}
          />
        </View>
        <Text style={s.label}>Modo Escuro</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? theme.colors.primary : '#ccc'}
        />
      </View>

      <View style={s.item}>
        <View style={s.iconContainer}>
          <MaterialCommunityIcons name="fingerprint" size={24} color={theme.colors.onSurface} />
        </View>
        <Text style={s.label}>Usar digital para login</Text>
        <Switch
          value={isBiometricEnabled}
          onValueChange={handleToggleBiometric}
          disabled={isPending}
          thumbColor={isBiometricEnabled ? theme.colors.primary : '#ccc'}
        />
      </View>
    </View>
  );
};



const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
      paddingTop: 70,
      backgroundColor: theme.colors.background,
    },
    iconHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      paddingHorizontal: 15,
      justifyContent: 'space-between',
      borderRadius: 20,
      paddingVertical: 17,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 7,
      elevation: 12,
      borderColor: theme.colors.outline ?? '#e5e7eb',
      borderWidth: 1,
    },
    label: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.onSurface,
      marginLeft: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
