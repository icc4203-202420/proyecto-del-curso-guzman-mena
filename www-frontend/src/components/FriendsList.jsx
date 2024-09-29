import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container, CircularProgress, Box } from '@mui/material';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  
  // Datos del usuario actual desde localStorage
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail'); // Si tienes email almacenado
  const userHandle = localStorage.getItem('userHandle'); // Si tienes handle almacenado

  useEffect(() => {
    // Fetch the user's friends
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/users/${userId}/friendships`);
        setFriends(response.data);
        setLoadingFriends(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [userId]);

  if (loadingFriends) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6">Cargando amigos...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      {/* Información del usuario actual */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Mi Perfil</Typography>
        <Typography variant="h6">Nombre: {userName}</Typography>
        {userEmail && <Typography variant="h6">Email: {userEmail}</Typography>}
        {userHandle && <Typography variant="h6">Handle: {userHandle}</Typography>}
      </Box>

      {/* Lista de amigos */}
      <Typography variant="h4" gutterBottom>Lista de Amigos</Typography>
      <List>
        {friends.map((friendData) => (
          <ListItem key={friendData.friend.id}>
            <ListItemText 
              primary={`${friendData.friend.first_name} ${friendData.friend.last_name}`} 
              secondary={`Handle: ${friendData.friend.handle}`} 
            />
            {friendData.first_shared_event ? (
              <Typography variant="body2" color="text.secondary">
                Primer evento compartido: {friendData.first_shared_event.name} - {new Date(friendData.first_shared_event.date).toLocaleDateString()}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay eventos compartidos
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FriendsList;
