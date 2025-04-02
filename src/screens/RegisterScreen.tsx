import { Button } from 'components/Button';
import { Input } from 'components/input';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from 'types/TypeRoute';
import { useNavigation } from '@react-navigation/native'; // Importando a navegação

export default function RegisterScreen() {

    const navigation = useNavigation<NavigationProp>(); // Usando o hook de navegação tipado

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>

        <Input placeholder="Nome" style={styles.input} />
        <Input placeholder="Email" style={styles.input} />
        <Input placeholder="Telefone" style={styles.input} />
        <Input placeholder="Data de Nascimento" style={styles.input} />
        <Input placeholder="Senha" secureTextEntry style={styles.input} />
        <Input placeholder="Confirmar Senha" secureTextEntry style={styles.input} />

        <Button title="Cadastrar" onPress={() => { }} style={styles.button} />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Entrar</Text>
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
    backgroundColor: '#F9FAFB', // Cor de fundo suave
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    elevation: 3, // Mais sombra para um visual mais profundo
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 36,
  },
  input: {
    width: '100%',
    paddingVertical: 14,
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
    marginTop: 24,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontWeight: '600',
    color: '#2563EB',
  },
});
