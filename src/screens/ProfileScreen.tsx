import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Avatar, Button, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from 'context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { apiUrl } from '~/global/urlReq';

export default function ProfileScreen() {
  const { user, loading, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();

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
      const res = await fetch(`${apiUrl}/upload/profile_image/${user!.id}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Sucesso', 'Imagem de perfil atualizada');

        if (!user?.id) return; // Garante que user e id existem

        const updatedUser = {
          ...user,
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
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao deslogar');
    }
  };

  const getProfileImageUri = () => {
    if (!user?.profile_image) {
      return 'https://via.placeholder.com/100';
    }

    const isUrl = user.profile_image.startsWith('https');

    if (user.providerType ?? user.provedorType === 'google') {
      return isUrl
        ? user.profile_image
        : `${apiUrl}/upload/get_image/${user.profile_image}`;
    }

    return `${apiUrl}/upload/get_image/${user.profile_image}`;
  };

  if (loading || !user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity onPress={handleImageUpload} disabled={isUploading}>
        <Avatar.Image
          size={100}
          source={{ uri: getProfileImageUri() }}
          style={[
            styles.avatar,
          ]}
        />
      </TouchableOpacity>

      <Text style={[styles.name, { color: theme.colors.onBackground }]}>{user.name}</Text>
      <Text style={[styles.email, { color: theme.colors.onBackground }]}>{user.email}</Text>
      <Text style={[styles.provider, { color: theme.colors.onBackground }]}>
        Provedor: {user.providerType ?? user.provedorType}
      </Text>

      <Button
        mode="contained"
        style={[styles.uploadButton, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
        onPress={handleLogout}
        loading={isUploading}
        disabled={isUploading}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 4,
  },
  provider: {
    fontSize: 14,
    marginBottom: 24,
  },
  uploadButton: {
    width: '80%',
    borderRadius: 8,
    paddingVertical: 6,
  },
});
