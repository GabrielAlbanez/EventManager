import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from 'hooks/user';

export default function ProfileScreen() {
  const { user, loading, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);

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
    const file = {
      uri: asset.uri,
      name: asset.fileName || 'default.jpg',
      type: asset.type || 'image/jpeg',
    };

    formData.append('file', file as any);

    try {
      const res = await fetch(`http://seu-servidor.com/profile_image/${user?.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Imagem de perfil atualizada');
        const updatedUser = {
          ...user,
          id: user?.id || '',
          profile_image: data.image_url,
          name: user?.name || '',
          email: user?.email || '',
          provedorType: user?.provedorType || '',
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

  if (loading || !user) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={{
          uri: user.profile_image || 'https://via.placeholder.com/100',
        }}
      />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.provider}>Provedor: {user.provedorType}</Text>

      <Button
        mode="contained"
        onPress={handleImageUpload}
        style={styles.uploadButton}
        loading={isUploading}
      >
        Atualizar Imagem
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
  uploadButton: {
    backgroundColor: '#3f51b5',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
