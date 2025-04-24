import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from 'hooks/user';

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    console.log("Logout");
    try {
      await GoogleSignin.signOut(); // Deslogar do Google
      await AsyncStorage.clear();   // Limpar o armazenamento local
      navigation.navigate('Login'); // Navegar para a tela de login
    } catch (error) {
      console.log('Erro ao sair:', error);
    }
  };

  if (loading || !user) {
    return <Text>Carregando...</Text>;
  }

  console.log(user)

  return (
    <View style={styles.container}>
      <Avatar.Image size={100} source={{ uri: user.profile_image }} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.provider}>Provedor : -|- {user.provedorType}</Text>
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
    marginBottom: 8,
  },
  provider: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
