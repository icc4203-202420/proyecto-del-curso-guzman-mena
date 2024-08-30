// src/components/UserSearch.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, Container, AppBar, Toolbar, Typography } from '@mui/material';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/users');
        // Access the 'users' key from the response data
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on the search term
    setFilteredUsers(
      users.filter(user => user.handle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, users]);

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
          <ListItem key={user.id}>
            <ListItemText primary={user.handle} secondary={`User ID: ${user.id}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserSearch;
