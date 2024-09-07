import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import api from '../api/axios';

function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    handle: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios y formato de email
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.handle || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Formato de correo electrónico inválido');
      return;
    }

    try {
      const response = await api.post('/signup', {
        user: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          handle: formData.handle,
          password: formData.password,
        },
      });
      setSuccess('Registro exitoso. ¡Ahora puedes iniciar sesión!');
      setError('');
      setFormData({ firstName: '', lastName: '', email: '', handle: '', password: '' });
    } catch (err) {
      setError('Error al registrarse. Inténtalo de nuevo.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Regístrate</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Handle (Ej. @usuario)"
          name="handle"
          value={formData.handle}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Registrarse
        </Button>
      </form>
    </Box>
  );
}

export default SignupForm;
