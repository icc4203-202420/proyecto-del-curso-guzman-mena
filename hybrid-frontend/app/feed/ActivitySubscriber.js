import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import consumer from './consumer';
import FeedContent from './FeedContent';
import { REACT_APP_API_WL } from '@env';

const ActivitySubscriber = () => {
  const [activities, setActivities] = useState([]);

  const fetchFriendActivities = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Obtener el ID del usuario actual
      if (!userId) {
        console.error('User ID not found in AsyncStorage');
        return;
      }

      const response = await axios.get(`${REACT_APP_API_WL}/api/v1/reviews/all_reviews`, {
        params: { user_id: userId },
      });

      if (response.status === 200) {
        setActivities(response.data.reviews || []);
      } else {
        console.error('Error fetching activities:', response.status);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchFriendActivities();

    const subscription = consumer.subscriptions.create(
      { channel: 'FriendActivityChannel' },
      {
        connected() {
          console.log('Connected to FriendActivityChannel');
        },
        disconnected() {
          console.log('Disconnected from FriendActivityChannel');
        },
        received(data) {
          console.log('New activity received:', data);
          if (data.activity) {
            setActivities((prevActivities) => {
              // Verifica si la actividad ya está en la lista
              const isDuplicate = prevActivities.some((activity) => activity.id === data.activity.id);
              if (!isDuplicate) {
                // Solo agrega la actividad si no está duplicada
                return [data.activity, ...prevActivities];
              }
              return prevActivities;
            });
            
          }
        },
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FeedContent activities={activities} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ActivitySubscriber;
