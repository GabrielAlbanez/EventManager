import { Button } from 'components/Button';
import { Input } from 'components/input';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importando a navegação
import { NavigationProp } from 'types/TypeRoute';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>(); // Usando o hook de navegação tipado

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>

        <Input
          placeholder="Email"
          style={styles.input}
        />
        <Input
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
        />

        <Button
          title="Entrar"
          onPress={() => {}}
          style={styles.button}
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Não tem uma conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  card: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
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
  button: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  signupContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontWeight: '500',
    color: '#2563EB',
  },
});
