import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) {
        setUserData(JSON.parse(data));
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut(); // Deslogar do Google
      await AsyncStorage.clear();   // Limpar o armazenamento local
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }], // Voltar para a tela de login
      });
    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  };

  if (!userData) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Avatar.Image size={100} source={{ uri: userData.photo }} />
      <Text style={styles.name}>{userData.name}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
