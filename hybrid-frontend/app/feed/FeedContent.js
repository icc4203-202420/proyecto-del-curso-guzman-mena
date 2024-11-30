import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const FeedContent = ({ activities }) => {
  const router = useRouter();

  const renderItem = ({ item }) => {
    console.log('Activity Item:', item); // Debug para verificar el contenido de `item`

    if (item.type === 'review') {
      // Renderizar reseñas
      return (
        <View style={styles.activityCard}>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => {
              if (item.beer_id) {
                router.push(`/beers/${item.beer_id}`);
              } else {
                console.error('Beer ID is missing or invalid:', item.beer_id);
              }
            }}
          >
            <Text style={styles.activityText}>
              {item.user_name
                ? `${item.user_name} calificó`
                : 'Un amigo calificó'}{' '}
              {item.beer_name || 'una cerveza'}{' '}
              {item.rating ? `con ${item.rating} estrellas.` : ''}
            </Text>
            {item.text && <Text style={styles.activityDetails}>{item.text}</Text>}
            <View style={styles.detailsContainer}>
              {item.bar_name && (
                <Text
                  style={styles.barText}
                  onPress={() => {
                    if (item.bar_id) {
                      router.push(`/bars/${item.bar_id}`);
                    } else {
                      console.error('Bar ID is missing or invalid:', item.bar_id);
                    }
                  }}
                >
                  {item.bar_name}
                </Text>
              )}
              <Text style={styles.detail}>
                <Text style={styles.label}>País:</Text>{' '}
                {item.bar_country || 'No especificado'}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.label}>Dirección:</Text>{' '}
                {item.bar_address || 'No especificada'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (item.type === 'photo') {
      // Renderizar publicaciones de fotos
      return (
        <View style={styles.activityCard}>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => {
              if (item.event_id) {
                router.push(`/events/${item.event_id}`);
              } else {
                console.error('Event ID is missing or invalid:', item.event_id);
              }
            }}
          >
            <Text style={styles.activityText}>
              {item.user_name
                ? `${item.user_name} publicó una foto en`
                : 'Un amigo publicó una foto en'}{' '}
              {item.event_name || 'un evento'}.
            </Text>
            {item.description && (
              <Text style={styles.activityDetails}>{item.description}</Text>
            )}
            {item.photo_url && (
              <Image source={{ uri: item.photo_url }} style={styles.photo} />
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.detail}>
                <Text style={styles.label}>Publicado el:</Text>{' '}
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return null; // En caso de tipo desconocido
  };

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No hay actividades disponibles.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardButton: {
    flex: 1,
  },
  activityText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  activityDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detail: {
    fontSize: 14,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  barText: {
    color: '#1e88e5',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  photo: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
  },
});

export default FeedContent;
