import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
}

export default function CustomButton({label, onPress}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#22c55e',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}