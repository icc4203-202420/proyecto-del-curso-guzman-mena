import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import consumer from './consumer';
import FeedContent from './FeedContent';
import { REACT_APP_API_WL } from '@env';

const ActivitySubscriber = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchFriendActivities = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in AsyncStorage');
        return;
      }

      const response = await axios.get(`${REACT_APP_API_WL}/api/v1/reviews/recent_reviews`, {
        params: { user_id: userId },
      });

      if (response.status === 200) {
        setActivities(response.data.activities || []);
        setFilteredActivities(response.data.activities || []);
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
              const isDuplicate = prevActivities.some((activity) => activity.id === data.activity.id);
              if (!isDuplicate) {
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

  useEffect(() => {
    const lowerCaseFilter = filterText.toLowerCase();
    const filtered = activities.filter((activity) => {
      return (
        (activity.user_name && activity.user_name.toLowerCase().includes(lowerCaseFilter)) ||
        (activity.beer_name && activity.beer_name.toLowerCase().includes(lowerCaseFilter)) ||
        (activity.bar_name && activity.bar_name.toLowerCase().includes(lowerCaseFilter)) ||
        (activity.bar_country && activity.bar_country.toLowerCase().includes(lowerCaseFilter)) ||
        (activity.text && activity.text.toLowerCase().includes(lowerCaseFilter))
      );
    });
    setFilteredActivities(filtered);
  }, [filterText, activities]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.filterInput}
        placeholder="🔍 Filtrar publicaciones..."
        value={filterText}
        onChangeText={setFilterText}
        placeholderTextColor="#888"
      />
      <FeedContent activities={filteredActivities} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    margin: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default ActivitySubscriber;
