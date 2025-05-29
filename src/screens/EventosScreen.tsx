import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

const eventos = [
  {
    id: '1',
    titulo: 'Submundo',
    data: '15/06/2025',
    local: 'Campinas-Hall',
    imagem: 'https://res.cloudinary.com/htkavmx5a/image/upload/v1727302134/ussqcbdhtu2xoqhk9map.png',
    categoria: 'Funk',
  },
  {
    id: '2',
    titulo: 'Caos',
    data: '15/06/2025',
    local: 'Caos - mansoes santo antonio',
    imagem: 'https://th.bing.com/th/id/OIP.abTQMXxOnb0nPe3pySbmvAHaE8?rs=1&pid=ImgDetMain',
    categoria: 'Eletro-Funk',
  },
];

export default function EventosScreen() {
  const isSingle = eventos.length === 1;
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>Eventos Criados</Text>
      <ScrollView
        contentContainerStyle={[
          styles.list,
          isSingle && styles.singleList,
        ]}
      >
        {eventos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, isSingle && styles.singleCard, { backgroundColor: theme.colors.elevation?.level1 || '#fff' }]}
          >
            <Image source={{ uri: item.imagem }} style={styles.image} />
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.badgeText, { color: theme.colors.onPrimary }]}>{item.categoria}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.title, { color: theme.colors.onBackground }]}>{item.titulo}</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>📅</Text>
                  <Text style={[styles.infoText, { color: theme.colors.onBackground }]}>{item.data}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={[styles.infoText, { color: theme.colors.onBackground }]}>{item.local}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  singleList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: '100%',
  },
  singleCard: {
    width: '90%',
  },
  image: {
    width: '100%',
    height: 180,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 15,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
