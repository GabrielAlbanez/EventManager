// src/components/Input.tsx
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

export function Input({ placeholder, secureTextEntry, style, ...rest }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={[styles.input, style]} // Combine o estilo do componente com o estilo passado como props
      {...rest} // Isso permite passar outras propriedades para o TextInput
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 16,
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
  },
});
