// src/feed/ActivitySubscriber.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_API_WL } from '@env';

const ActivitySubscriber = () => {
  const [activities, setActivities] = useState([]);

  // Llamar al backend para obtener las reseñas de amigos
  const fetchFriendReviews = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Obtener el ID del usuario actual
      if (!userId) {
        console.error('No se encontró el ID del usuario.');
        return;
      }

      const response = await axios.get(`${REACT_APP_API_WL}/api/v1/reviews/all_reviews`, {
        params: { user_id: userId }, // Enviar el ID del usuario como parámetro
      });

      if (response.status === 200) {
        setActivities(response.data.reviews || []);
      } else {
        console.error('Error al obtener reseñas de amigos:', response.status);
      }
    } catch (error) {
      console.error('Error al obtener reseñas de amigos:', error);
    }
  };

  useEffect(() => {
    fetchFriendReviews();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed de Reseñas de Amigos</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>
              {item.user_name} calificó {item.beer_name}
            </Text>
            <Text style={styles.reviewRating}>Calificación: {item.rating}</Text>
            <Text style={styles.reviewContent}>{item.text}</Text>
          </View>
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
  reviewCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  reviewTitle: {
    fontWeight: 'bold',
  },
  reviewRating: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  reviewContent: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
  },
});

export default ActivitySubscriber;
