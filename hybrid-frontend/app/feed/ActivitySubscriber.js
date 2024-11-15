// src/feed/ActivitySubscriber.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import consumer from './consumer';

const ActivitySubscriber = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Llamada inicial para obtener todas las reseñas
    const fetchAllReviews = async () => {
      try {
        const response = await fetch(`${REACT_APP_API_WL}/api/v1/reviews/all_reviews`);
        const data = await response.json();
        setActivities(data.reviews); // Suponiendo que `data.reviews` contiene un array de reseñas
      } catch (error) {
        console.error('Error fetching all reviews:', error);
      }
    };

    fetchAllReviews();

    // Crear la suscripción al canal "FriendActivityChannel" para recibir actualizaciones en tiempo real
    const subscription = consumer.subscriptions.create(
      { channel: 'FriendActivityChannel' },
      {
        connected() {
          console.log('Conectado al canal FriendActivityChannel');
        },
        disconnected() {
          console.log('Desconectado del canal FriendActivityChannel');
        },
        received(data) {
          console.log('Datos recibidos:', data);
          // Agregar la nueva actividad al principio de la lista
          setActivities((prevActivities) => [data.activity, ...prevActivities]);
        },
      }
    );

    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed de Reseñas de Usuarios</Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.activity}>
            {item.user_name} calificó {item.beer_name} con {item.rating} estrellas: "{item.text}"
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activity: {
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default ActivitySubscriber;
