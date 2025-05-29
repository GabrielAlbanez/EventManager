import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeIn, SlideInUp, Easing } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '~/global/urlReq';
import { useUser } from 'context/UserContext';
import { NavigationProp } from 'types/TypeRoute';

const { width } = Dimensions.get('window');

export default function InitilScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { updateUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokens = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
          navigation.replace('Login');
          return;
        }

        // Verifica validade do token
        const verifyResponse = await fetch(`${apiUrl}/auth/verify-access-token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let finalAccessToken = accessToken;

        if (!verifyResponse.ok) {
          // Token expirado, tenta o refresh
          const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!refreshResponse.ok) {
            navigation.replace('Login');
            return;
          }

          const refreshData = await refreshResponse.json();
          finalAccessToken = refreshData.access_token;

          await AsyncStorage.setItem('access_token', finalAccessToken);
        }

        // Busca dados do usuário
        const userResponse = await fetch(`${apiUrl}/auth/get-user-data`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${finalAccessToken}`,
          },
        });

        if (!userResponse.ok) {
          navigation.replace('Login');
          return;
        }

        const userData = await userResponse.json();
        updateUser(userData.user);
        await AsyncStorage.setItem('user', JSON.stringify(userData.user));

        navigation.replace('Root'); // ou AppTabs, conforme sua rota principal
      } catch (error) {
        console.error('Erro ao verificar tokens:', error);
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    };

    checkTokens();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <Animated.View
        style={styles.content}
        entering={FadeIn.duration(800).easing(Easing.ease)}
      >
        <Animated.View
          style={styles.textContainer}
          entering={SlideInUp.duration(700).delay(300)}
        >
          <Text style={styles.title}>Bem-vindo ao</Text>
          <Text style={styles.appName}>P-EVENT</Text>
        </Animated.View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating size="large" color="#16a34a" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 2,
  },
  circleTop: {
    position: 'absolute',
    top: -width * 0.4,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#4ade80',
    zIndex: 1,
  },
  circleBottom: {
    position: 'absolute',
    bottom: -width * 0.3,
    left: -width * 0.2,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: '#4ade80',
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#666',
    fontSize: 20,
    fontWeight: '300',
  },
  appName: {
    color: '#16a34a',
    fontSize: 36,
    fontWeight: 'bold',
  },
  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
});
