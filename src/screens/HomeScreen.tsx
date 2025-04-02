// src/screens/HomeScreen.tsx
import { Button } from 'components/Button';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-blue-600 items-center justify-center p-4">
      <Text className="text-white text-3xl font-bold mb-4">Bem-vindo à Home</Text>
      <Button title="Ir para o Login" onPress={() => {}} />
    </View>
  );
}
