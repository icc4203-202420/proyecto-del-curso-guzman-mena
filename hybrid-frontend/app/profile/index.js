import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, List, Button } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';
import {useRouter } from 'expo-router'


export default function ProfileIndex() {

  const router = useRouter()

  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    reviews: [],
    friends: [],
    eventAtendances: [],
  });

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('@user_id');
      
      if (storedUserId) {
        const response = await fetch(`http://localhost:3001/api/v1/users/${storedUserId}`);
        if (response.ok) {
          const data = await response.json();
          setUser({
            name: capitalizeFirstLetter(data.first_name) + " " + capitalizeFirstLetter(data.last_name),
            email: data.email,
            age: data.age,
            reviews: data.reviews || [],
          });
        } else {
          console.error('Error al obtener datos del usuario:', response.status);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud de datos del usuario:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
// visualisacion de la vista
  return (
    <View style={styles.container}>
      {/* Datos personales */}
      <View style={styles.header}>
        <Avatar.Text size={80} label={user.name[0]} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>


      <View style={styles.card}>
        <Text style={styles.title}>Review</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {user.reviews.length > 0 ? (
          user.reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>{`Reseña para: ${review.beer.name}`}</Text>
              <Button 
                mode="contained" 
                  onPress={() => router.push(`/beers/${review.beer_id}`)} style={styles.button}>
                  View Beer
              </Button>
              <Text style={styles.reviewRating}>{`Calificación: ${review.rating}`}</Text>
              <Text style={styles.reviewContent}>{review.text}</Text>
              
            </View>
          ))
        ) : (
          <Text>No hay reseñas disponibles.</Text> // Mensaje cuando no hay reseñas
        )}
        </ScrollView>
      </View>

      





      {/* Interaccion con la APP */}
      {/* Eventos asisistidos o por asistir */}
      {/* <List.Section>
        <List.Subheader>Event Atendances</List.Subheader>
        {user.eventAtendances.map((event, index) => ( 
          <List.Item key={index} title={beer} left={() => <List.Icon icon="beer" />} />
        ))}
      </List.Section> */}

      


      {/* Reseñas en la APP*/}
      {/* <List.Section>
        <List.Subheader>Review</List.Subheader>
        {user.favoriteBeers.map((review, index) => (
          <List.Item key={index} title={beer} left={() => <List.Icon icon="beer" />} />
        ))}
      </List.Section> */}

      {/* Amigos */}

      {/* <List.Section>
        <List.Subheader>friends</List.Subheader>
        {user.favoriteBars.map((bar, index) => (
          <List.Item key={index} title={bar} left={() => <List.Icon icon="glass-mug-variant" />} />
        ))}
      </List.Section> */}
    </View>
  );
}

// Estilos Frontend


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },


  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },

  card: {
    backgroundColor: '#fff',  // Fondo blanco
    padding: 20,              // Espaciado interno
    borderRadius: 10,         // Bordes redondeados
    shadowColor: '#000',      // Color de la sombra
    shadowOffset: { width: 0, height: 2 },  // Desplazamiento de la sombra
    shadowOpacity: 0.2,       // Opacidad de la sombra
    shadowRadius: 5,          // Difusión de la sombra
    elevation: 3,             // Sombra para Android
    marginVertical: 10,       // Separación entre tarjetas
    maxHeight: 200,
  },
  scrollContainer: {
    maxHeight: '100%', // Para permitir el desplazamiento dentro de la tarjeta
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
  reviewContent: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    paddingVertical: 0.3, // Ajusta el padding vertical
    paddingHorizontal: 0.2, // Ajusta el padding horizontal
    width: 200, // Ancho del botón
    alignSelf: 'flex-start', // Alinea el botón a la izquierda
    marginVertical: 3, // Espaciado vertical
  },

});