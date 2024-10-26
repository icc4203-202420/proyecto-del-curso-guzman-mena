import React, { useState } from 'react';
import { TextField, Button, Alert, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'

  // Validación del formulario
  const validateForm = () => {
    if (!email || !password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }
    return true;
  };

  // Función para manejar el login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:3001/api/v1/login', {
        user: { email, password },
      });

      if (response.data.status.code === 200) {
        const currentUser = response.data.status.data.user.id;
        await AsyncStorage.setItem('@user_id', currentUser.toString());
        setMessage('You have logged in successfully');
        setMessageType('success');
        navigation.navigate('index');
        //////////
      } else {
        setMessage(response.data.status.message || 'Invalid credentials');
        setMessageType('error');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'Invalid credentials');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: 'auto', padding: '20px 5px' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {/* Mostrar mensaje de éxito o error */}
        {message && (
          <Alert severity={messageType} style={{ marginBottom: '20px' }}>
            {message}
          </Alert>
        )}

        {/* Campos de formulario */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón de Login */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          style={{ marginTop: '20px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </CardContent>
    </Card>
  );
}
