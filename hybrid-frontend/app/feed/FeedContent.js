// src/feed/FeedContent.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const FeedContent = ({ activities }) => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => {
        if (item.type === 'review') {
          router.push(`/beers/${item.beer_id}`);
        } else if (item.type === 'event') {
          router.push(`/bars/${item.bar_id}/events/${item.event_id}`);
        }
      }}
    >
      <Text style={styles.activityText}>
        {item.user_name ? `${item.user_name} calificó` : 'Un amigo calificó'}{' '}
        {item.beer_name || 'una cerveza'} con {item.rating || 'N/A'} estrellas.
      </Text>
      {item.text && <Text style={styles.activityDetails}>{item.text}</Text>}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<Text style={styles.emptyText}>No hay actividades disponibles.</Text>}
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
  activityText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activityDetails: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
  },
});

export default FeedContent;
