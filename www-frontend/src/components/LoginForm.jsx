import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Importamos el hook para usar el tema

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const theme = useTheme(); // Usamos el tema de la aplicación

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Aquí iría la lógica para manejar la autenticación
    console.log('Iniciar sesión con:', { email, password });
    setError('');  // Limpiar el error si todo está bien
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 400, 
        margin: 'auto', 
        mt: 4, 
        p: 3, 
        bgcolor: theme.palette.background.paper,  // Usamos el color de fondo del tema
        color: theme.palette.text.primary,  // Usamos el color de texto del tema
        borderRadius: 2,  // Opcional: redondeamos los bordes
        boxShadow: 3  // Agregamos una sombra suave para dar profundidad
      }}
    >
      <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputProps={{ style: { color: theme.palette.text.primary } }}  // Color del texto en el campo
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}  // Color del label
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputProps={{ style: { color: theme.palette.text.primary } }}  // Color del texto en el campo
          InputLabelProps={{ style: { color: theme.palette.text.secondary } }}  // Color del label
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Iniciar Sesión
        </Button>
      </form>
    </Box>
  );
}

export default LoginForm;
