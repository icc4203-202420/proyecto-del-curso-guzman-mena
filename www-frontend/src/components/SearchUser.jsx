// src/components/SearchUser.jsx
import React from 'react';
import { Typography, Container, TextField, Button } from '@mui/material';

function SearchUser() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Search User
      </Typography>
      <TextField label="Search by Handle" variant="outlined" fullWidth margin="normal" />
      <Button variant="contained" color="primary">
        Search
      </Button>
      {/* Results of user search will be displayed here */}
    </Container>
  );
}

export default SearchUser;
