// src/components/ActivitySubscriber.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import consumer from './consumer';

const ActivitySubscriber = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Crear la suscripción al canal "FriendActivityChannel"
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
          // Actualizar la lista de actividades con los datos recibidos
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
      <Text style={styles.title}>Actividades en Tiempo Real</Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.activity}>{item}</Text>}
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


