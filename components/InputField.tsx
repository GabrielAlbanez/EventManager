import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { TouchableOpacity } from 'react-native';

export interface InputFieldProps extends TextInputProps {
  label: string;
  icon: React.ReactNode;
  inputType?: 'password' | 'text';
  fieldButtonLabel?: string;
  fieldButtonFunction?: () => void;
}

export default function InputField({
  label,
  icon,
  inputType,
  fieldButtonLabel,
  fieldButtonFunction,
  ...rest // <- inclui value, onChangeText, onBlur, etc
}: InputFieldProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ marginBottom: 5 }}>{label}</Text>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          alignItems: 'center',
        }}>
        {icon}
        <TextInput
          {...rest}
          style={{ flex: 1, paddingVertical: 8 }}
          secureTextEntry={inputType === 'password'}
        />
        {fieldButtonLabel && (
          <TouchableOpacity onPress={fieldButtonFunction}>
            <Text style={{ color: '#22c55e', fontWeight: '700' }}>{fieldButtonLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
