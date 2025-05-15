import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface CustomButtonProps {
  label: string;
  disabled?: boolean;
  onPress: () => void;
  style?: object;
}

export default function CustomButton({label, onPress, disabled, style}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: '#22c55e',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        ...style
        
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