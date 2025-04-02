// src/components/ScreenContent.tsx
import { View, Text } from 'react-native';

interface ScreenContentProps {
  readonly title: string;
  readonly path: string;
}

export function ScreenContent({ title, path }: ScreenContentProps) {
  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-blue-600">{title}</Text>
      <Text className="text-lg text-gray-600">{path}</Text>
    </View>
  );
}
