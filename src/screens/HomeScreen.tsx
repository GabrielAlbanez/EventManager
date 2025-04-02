import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { ProgressBar } from 'react-native-paper';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000); // Redireciona após 3 segundos

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    color: 'purple',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    width: '80%',
    height: 6,
  },
});