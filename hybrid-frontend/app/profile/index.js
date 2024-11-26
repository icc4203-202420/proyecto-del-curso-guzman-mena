import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Avatar, Card, Button, Title } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
// import { useRouter } from 'expo-router';
import axios from 'axios';
import { REACT_APP_API_URL } from '@env';

export default function ProfileIndex() {
  // const router = useRouter();
  const apiUrl = REACT_APP_API_URL;

  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    reviews: [],
    friends: [],
    eventAtendances: [],
  });

  const [searchHandle, setSearchHandle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        const response = await axios.get(`${apiUrl}/api/v1/users/${storedUserId}`);
        if (response.status === 200) {
          const data = response.data;
          
          setUser({
            id: data.id,
            name: `${data.first_name} ${data.last_name}`,
            email: data.email,
            age: data.age,
            reviews: data.reviews || [],
            friends: data.friendships?.map(friendship => ({
              ...friendship.friend,
              first_shared_event: friendship.first_shared_event
            })) || [],
          });
        } else {
          console.error('Error al obtener datos del usuario:', response.status);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud de datos del usuario:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const searchUserByHandle = async (handle) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/users/search?handle=${handle}`);
      if (response.status === 200) {
        setSearchResults(response.data.users);
        setError('');
      } else {
        setSearchResults([]);
        setError('No se encontraron usuarios.');
      }
    } catch (error) {
      console.error('Error en la búsqueda de usuario:', error);
      setError('Error al buscar usuario.');
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchHandle.length > 0) {
        searchUserByHandle(searchHandle);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchHandle]);

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/friendships`, {
        user_id: user.id,
        friend_id: friendId,
      });
  
      if (response.status === 201) {
        alert('Amigo agregado exitosamente.');
        fetchUserData(); // Refresca la lista de amigos después de agregar uno nuevo
      } else if (response.status === 200 && response.data.message === 'Ya eres amigo de este usuario') {
        alert(response.data.message); // Muestra el mensaje de que ya son amigos
      } else {
        setError('Error al agregar amigo.');
      }
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      setError('Error al agregar amigo.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user.name[0]} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Lista de Amigos */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Amigos</Title>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {user.friends.length > 0 ? (
              user.friends.map((friend, index) => (
                <View key={index} style={styles.friendCard}>
                  <Text>{`${friend.first_name} ${friend.last_name}`}</Text>
                  {friend.first_shared_event ? (
                    <Text style={styles.eventInfo}>
                      Primer evento compartido: {friend.first_shared_event.name} - {friend.first_shared_event.date}
                    </Text>
                  ) : (
                    <Text style={styles.noEventInfo}>No tienen eventos compartidos.</Text>
                  )}
                </View>
              ))
            ) : (
              <Text>No tienes amigos agregados.</Text>
            )}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Sección de Búsqueda de Amigos */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Buscar amigos por handle</Title>
          <TextInput
            style={styles.input}
            placeholder="Ingrese handle"
            value={searchHandle}
            onChangeText={setSearchHandle}
          />
          <ScrollView>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <View key={result.id} style={styles.friendCard}>
                  <Text>{result.first_name} {result.last_name}</Text>
                  <Button mode="outlined" onPress={() => addFriend(result.id)} style={styles.addButton}>
                    Agregar amigo
                  </Button>
                </View>
              ))
            ) : (
              <Text>No se encontraron resultados.</Text>
            )}
          </ScrollView>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Card.Content>
      </Card>

      {/* Reseñas */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Reseñas</Title>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {user.reviews.length > 0 ? (
              user.reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <Text style={styles.reviewTitle}>{`Reseña para: ${review.beer.name}`}</Text>
                  <Button 
                    mode="contained" 
                    onPress={() => router.push(`/beers/${review.beer_id}`)} 
                    style={styles.button}
                  >
                    Ver Cerveza
                  </Button>
                  <Text style={styles.reviewRating}>{`Calificación: ${review.rating}`}</Text>
                  <Text style={styles.reviewContent}>{review.text}</Text>
                </View>
              ))
            ) : (
              <Text>No hay reseñas disponibles.</Text>
            )}
          </ScrollView>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  friendCard: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  eventInfo: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  noEventInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
});
