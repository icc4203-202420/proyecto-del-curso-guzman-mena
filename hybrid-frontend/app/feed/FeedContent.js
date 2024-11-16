// src/feed/FeedContent.js
import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const FeedContent = () => {
  return (
    <FlatFeed
      notify
      feedGroup="timeline" // Cambia "timeline" si usas otro grupo de feed en Stream
      options={{ limit: 25 }} // Configura el límite de actividades a obtener
      Activity={(props) => (
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            {props.activity.actor} calificó {props.activity.object} con {props.activity.rating} estrellas.
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  activityText: {
    fontSize: 16,
  },
});

export default FeedContent;
