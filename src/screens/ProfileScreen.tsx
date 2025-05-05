import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Avatar, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from 'context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';

export default function ProfileScreen() {
  const { user, loading, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

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
      type: 'image/jpeg',
      name: asset.fileName || `photo_${Date.now()}.jpg`,
    } as any);

    try {
      const res = await fetch(`http://172.16.6.11:5000/upload/profile_image/${user!.id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Imagem de perfil atualizada');
        if (!user?.id) {
          throw new Error('User ID is undefined');
        }

        const updatedUser = {
          ...user,
          id: user.id, // Ensure id is explicitly set and non-optional
          profile_image: data.image_name,
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
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao deslogar');
    }
  };

  const getProfileImageUri = () => {
    if (!user?.profile_image) {
      return 'https://via.placeholder.com/100';
    }

    const isUrl = user.profile_image.startsWith('http');
    if (user.providerType === 'google') {
      return isUrl
        ? user.profile_image
        : `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`;
    }

    return `http://172.16.6.11:5000/upload/get_image/${user.profile_image}`;
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#38a169" /> {/* Verde mais suave */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImageUpload}>
        <Avatar.Image
          size={100}
          source={{ uri: getProfileImageUri() }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.provider}>Provedor: {user.providerType ?? user.provedorType}</Text>

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
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#38a169',  // Verde para borda do avatar
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#38a169',  // Cor verde para o nome
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
    backgroundColor: '#38a169', // Cor verde para o botão
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
