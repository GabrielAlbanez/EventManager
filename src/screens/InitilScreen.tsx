import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import Animated, { ZoomIn, FadeIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '~/global/urlReq';
import { useUser } from 'context/UserContext';
import { NavigationProp } from 'types/TypeRoute';

export default function InitilScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { updateUser } = useUser();

  useEffect(() => {
    const checkTokens = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
          return navigation.navigate('Login');
        }

        // Verifica validade do access token
        const verifyResponse = await fetch(`${apiUrl}/auth/verify-access-token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let finalAccessToken = accessToken;

        if (!verifyResponse.ok) {
          // Tenta refresh
          const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!refreshResponse.ok) {
            return navigation.navigate('Login');
          }

          const refreshData = await refreshResponse.json();
          finalAccessToken = refreshData.access_token;

          console.log("Novo access token:", finalAccessToken);

          // Atualiza os tokens
          await AsyncStorage.setItem('access_token', refreshData.access_token);
        }

        // Busca dados do usuário com token válido
        const userResponse = await fetch(`${apiUrl}/auth/get-user-data`, {
          
          method: 'GET',
          headers: {
            Authorization: `Bearer ${finalAccessToken}`,
          },
        });

        if (!userResponse.ok) {
          return navigation.navigate('Login');
        }

        const userData = await userResponse.json();
        console.log("Dados do usuário:", userData);
        updateUser(userData.user);
        await AsyncStorage.setItem('user', JSON.stringify(userData.user));

        navigation.replace('Root'); // ou 'AppTabs' dependendo da sua rota
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        navigation.navigate('Login');
      }
    };

    checkTokens();
  }, []);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(1000)}>
      <Animated.View entering={ZoomIn.duration(800)}>
        <Avatar.Image size={130} source={require('../../assets/LogoIcon.png')} />
      </Animated.View>
      <Text style={styles.text}>Conectando você aos melhores rolês...</Text>
      <ActivityIndicator animating={true} size="large" color="#1b1b1b" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    color: '#6200ea',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
});
