import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  profile_image: string;
  id: string;
  name: string;
  email: string;
  providerType: string;
  provedorType : string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (user: User) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (newUser: User) => {
    try {
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  // Chama a função fetchUser uma única vez ao montar o componente
  useEffect(() => {
    fetchUser();
  }, []);  // Remova a dependência de `user`

  const contextValue = React.useMemo(() => ({ user, loading, updateUser }), [user, loading, updateUser]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
