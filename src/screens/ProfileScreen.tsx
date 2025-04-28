import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from 'hooks/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';

export default function ProfileScreen() {
  const { user, loading, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation<NavigationProp>(); // Hook de navegação

  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Você precisa permitir acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      console.log('Usuário cancelou a seleção da imagem');
      return;
    }

    const asset = result.assets[0];
    setIsUploading(true);

    const formData = new FormData();

    formData.append('file', {
      uri: asset.uri,
      type: 'image/jpeg', // Você pode mudar baseado no asset.type
      name: asset.fileName || `photo_${Date.now()}.jpg`,
    } as any);

    try {
      const res = await fetch(`http://172.16.6.11:5000/upload/profile_image/${user!.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          // **IMPORTANTE:** NÃO definir 'Content-Type' manualmente
          // fetch + FormData nativo montam o boundary automaticamente
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Imagem de perfil atualizada');

        const updatedUser = {
          ...user,
          id: user?.id || '',
          profile_image: data.image_name,
          name: user?.name || '',
          email: user?.email || '',
          provedorType: user?.provedorType || '',
          providerType: user?.providerType || '',
        };
        updateUser(updatedUser);
      } else {
        Alert.alert('Erro', data.error || 'Falha ao atualizar a imagem');
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      Alert.alert('Erro', 'Falha ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Remover token e dados do usuário
      await AsyncStorage.removeItem('user');
      // Navegar para a tela de login após o logout
      navigation.navigate('Login'); // Alterar 'Login' para o nome da sua tela de login
    } catch (error) {
      Alert.alert('Erro', 'Falha ao deslogar');
    }
  };

  if (loading || !user) {
    return <Text>Carregando...</Text>;
  }

  console.log('User:', user.profile_image);
   


  return (
    <View style={styles.container}>
      {/* Envolvendo Avatar com TouchableOpacity para torná-lo clicável */}
      <TouchableOpacity onPress={handleImageUpload}>
        <Avatar.Image
          size={100}
          source={{
            uri: user.profile_image
              ? `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`
              : 'https://via.placeholder.com/100', // Uma imagem padrão caso não tenha ainda
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.provider}>Provedor: {user.providerType}</Text>

      <Button mode="contained" style={styles.uploadButton} onPress={handleLogout}>
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
  avatar: {
    marginBottom: 16, // Adiciona um pouco de espaço abaixo da imagem
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
  uploadButton: {
    backgroundColor: '#3f51b5',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
