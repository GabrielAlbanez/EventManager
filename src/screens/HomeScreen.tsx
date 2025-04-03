import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from 'types/TypeRoute';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import Animated, { ZoomIn, FadeIn } from 'react-native-reanimated';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(1000)}>
      <Animated.View entering={ZoomIn.duration(800)}>
        <Avatar.Image size={130} source={require('../../assets/LogoIcon.png')} />
      </Animated.View>
      <Text style={styles.text}>Conectando você aos melhores rolês...</Text>
      <ActivityIndicator animating={true} size="large" color="#1b1b1b" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    color: '#6200ea',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
});
