import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    profile_image: string;
    id: string;
    name: string;
    email: string;
    provedorType: string;
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Função para buscar os dados do usuário
    const fetchUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Failed to fetch user from AsyncStorage:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para atualizar o usuário após upload ou mudanças
    const updateUser = async (updatedUser: User) => {
        try {
            // Atualizando o usuário no estado
            setUser(updatedUser);

            // Salvando as novas informações no AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, updateUser }; // Retorna a função de atualização
};
