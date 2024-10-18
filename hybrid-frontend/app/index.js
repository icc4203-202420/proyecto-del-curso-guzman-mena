import React, { useEffect, useReducer, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

const reviewsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_REVIEW':
      return { ...state, data: [action.payload, ...state.data] };
    default:
      return state;
  }
};

export default function BeersShow() {
  const beerId = 1;
  const userId = 1;
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [reviewsState, dispatch] = useReducer(reviewsReducer, {
    data: [],
    loading: true,
    error: null
  });

  const fetchBeerDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`);
      setBeer(response.data.beer || response.data);
      setLoading(false);
      dispatch({ type: 'FETCH_START' });
      const reviewsResponse = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}/reviews`);
      const sortedReviews = reviewsResponse.data.sort((a, b) => 
        a.user_id === userId ? -1 : b.user_id === userId ? 1 : 0
      );
      dispatch({ type: 'FETCH_SUCCESS', payload: sortedReviews });
    } catch (error) {
      console.error('Error fetching beer details:', error);
      setError('Error al cargar los detalles de la cerveza');
      setLoading(false);
      dispatch({ type: 'FETCH_ERROR', payload: 'Error al cargar las reseñas' });
    }
  }, [beerId, userId]);

  useEffect(() => {
    fetchBeerDetails();
  }, [fetchBeerDetails]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBeerDetails();
    setRefreshing(false);
  }, [fetchBeerDetails]);

  const handleSubmitReview = async () => {
    const wordCount = newReview.trim().split(/\s+/).length;
    if (wordCount < 15) {
      setReviewError('La reseña debe contener al menos 15 palabras.');
      return;
    }

    const rating = parseFloat(newRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      setReviewError('El rating debe ser un número entre 1 y 5.');
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:3001/api/v1/beers/${beerId}/reviews`, {
        review: {
          text: newReview,
          rating: rating,
          user_id: userId,
        }
      });
      dispatch({ type: 'ADD_REVIEW', payload: response.data });
      setSuccessMessage('Reseña agregada exitosamente.');
      setNewReview('');
      setNewRating('');
      setReviewError('');
      await fetchBeerDetails(); // Recargar las reseñas después de agregar una nueva
    } catch (error) {
      setReviewError('Error al enviar la reseña.');
      console.error('Error submitting review:', error);
    }
  };

  const renderReviewItem = ({ item }) => (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <Paragraph>Usuario: {item.user_id === userId ? 'Tú' : item.user_id}</Paragraph>
        <Paragraph>Calificación: {item.rating}</Paragraph>
        <Paragraph>{item.text}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!beer) {
    return <Text>Cerveza no encontrada</Text>;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card>
        <Card.Content>
          <Title>{beer.name}</Title>
          <Paragraph>Estilo: {beer.style}</Paragraph>
          <Paragraph>Lúpulo: {beer.hop}</Paragraph>
          <Paragraph>Levadura: {beer.yeast}</Paragraph>
          <Paragraph>Maltas: {beer.malts}</Paragraph>
          <Paragraph>IBU: {beer.ibu}</Paragraph>
          <Paragraph>Alcohol: {beer.alcohol}</Paragraph>
          <Paragraph>BLG: {beer.blg}</Paragraph>
          <Title>Rating Promedio: {beer.avg_rating ? beer.avg_rating.toFixed(2) : 'N/A'}</Title>
          {beer.brewery && (
            <Paragraph>
              Cervecería: {beer.brewery.name} (Establecida en {beer.brewery.estdate})
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Bares que sirven esta cerveza</Title>
          {beer.bars && beer.bars.length > 0 ? (
            beer.bars.map((bar) => (
              <Paragraph key={bar.id}>
                {bar.name} (Latitud: {bar.latitude}, Longitud: {bar.longitude})
              </Paragraph>
            ))
          ) : (
            <Text>No se encontraron bares que sirvan esta cerveza.</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Agregar Reseña</Title>
          {reviewError ? <Text style={styles.errorText}>{reviewError}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Escribe tu reseña (mínimo 15 palabras)"
            value={newReview}
            onChangeText={setNewReview}
          />

          <TextInput
            style={styles.input}
            placeholder="Calificación (1 - 5)"
            keyboardType="numeric"
            value={newRating}
            onChangeText={setNewRating}
          />

          <Button mode="contained" onPress={handleSubmitReview}>
            Enviar Reseña
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Reseñas</Title>
          {reviewsState.loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : reviewsState.error ? (
            <Text style={styles.errorText}>{reviewsState.error}</Text>
          ) : (
            <FlatList
              data={reviewsState.data}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text>No hay reseñas disponibles.</Text>}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              windowSize={21}
              nestedScrollEnabled
            />
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginTop: 20,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
  reviewCard: {
    marginBottom: 10,
  },
});