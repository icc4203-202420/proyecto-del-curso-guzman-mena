import React from 'react';
import { Button } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';  // Usamos el contexto de autenticación

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.delete('/logout');
      logout();  // Limpiar el estado de autenticación
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  );
}

export default LogoutButton;
