import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUserId = parseInt(localStorage.getItem('userId'), 10);  // Obtener el userId del usuario actual
  const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Realiza la petición GET para obtener todos los usuarios
        const response = await axios.get('http://localhost:3001/api/v1/users', {
          headers: {
            Authorization: token  // Usamos el token en el encabezado
          }
        });
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);  // Agrega el token como dependencia para que se use cuando esté disponible

  useEffect(() => {
    // Filtrar usuarios según el término de búsqueda
    setFilteredUsers(
      users.filter(user => user.handle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, users]);

  const handleAddFriend = async (friendId) => {
    try {
      // Realiza la petición POST para agregar una amistad
      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${currentUserId}/friendships`,
        {
          friendship: { friend_id: friendId, bar_id: 1 }  // El bar_id es opcional según tu lógica
        },
        {
          headers: {
            Authorization: token  // Incluye el token en el encabezado
          }
        }
      );

      if (response.status === 201) {
        alert('Amistad agregada con éxito');
      } else {
        console.error('Ocurrió un error al agregar la amistad.');
      }
    } catch (error) {
      console.error('Error al agregar amigo:', error);
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            User Search
          </Typography>
        </Toolbar>
      </AppBar>
      <TextField
        label="Search by handle"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List>
        {filteredUsers.map(user => (
          <ListItem key={user.id} button onClick={() => setSelectedUser(user)}>
            <ListItemText primary={user.handle} secondary={`User ID: ${user.id}`} />
          </ListItem>
        ))}
      </List>

      {selectedUser && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Seleccionado: {selectedUser.handle}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddFriend(selectedUser.id)}
          >
            Agregar como amigo
          </Button>
        </div>
      )}
    </Container>
  );
};

export default UserSearch;
