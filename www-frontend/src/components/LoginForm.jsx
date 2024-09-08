import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import useAxios from 'axios-hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Email no válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const initialValues = {
  email: '',
  password: '',
};

// Configuración de axios con axios-hooks
axios.defaults.baseURL = 'http://localhost:3001/api/v1';

const LoginForm = ({ tokenHandler }) => {
  const [serverError, setServerError] = useState(''); // Estado para manejar el error del servidor
  const [responseMessage, setResponseMessage] = useState(''); // Estado para manejar la respuesta del servidor
  const [sentData, setSentData] = useState(''); // Estado para manejar los datos enviados
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Definir el hook para la petición POST
  const [{ data, loading, error }, executePost] = useAxios(
    {
      url: '/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' } // Cambiado a application/json
    },
    { manual: true } // No ejecutar automáticamente, lo haremos manualmente al enviar el formulario
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formattedData = { user: values }; // Formatear los datos según lo que espera el backend
      setSentData(JSON.stringify(formattedData, null, 2)); // Guardar los datos enviados en el estado
  
      // Realizar la solicitud POST
      const response = await axios.post('http://localhost:3001/api/v1/login', formattedData, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Obtener el token del header Authorization
      const authHeader = response.headers['authorization']; // Accede al header Authorization
  
      let token = '';
      if (authHeader) {
        // Extraer el token del header Authorization (remover el prefijo 'Bearer ')
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }
  
      // Manejo de respuesta y estado
      const responseData = response.data.status; // Accede al objeto status
      setResponseMessage(JSON.stringify(responseData, null, 2)); // Guarda la respuesta en el estado
  
      if (responseData.code === 200) {
        if (token) {
          tokenHandler(token); // Maneja el token recibido
        } else {
          setServerError('Token no encontrado en la respuesta.');
        }
        setServerError(''); // Limpia el mensaje de error si el login es exitoso
        navigate('/'); // Redirige a la ruta raíz después de un login exitoso
      } else {
        setServerError(responseData.message); // Muestra el mensaje de error del servidor
      }
    } catch (err) {
      if (err.response) {
        setServerError(`Error en el servidor: ${JSON.stringify(err.response.data, null, 2)}`);
        console.error('Error en el envío del formulario:', err.response.data);
      } else {
        setServerError('Error en el servidor. Intenta nuevamente más tarde.',response.headers['authorization']);

        console.error('Error en el envío del formulario:', err);
      }
      setResponseMessage(''); // Limpiar la respuesta en caso de error
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              <Box sx={{ mt: 2 }}>
                <Field
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  type="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Field
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  label="Contraseña"
                  name="password"
                  type="password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Enviando...' : 'Iniciar Sesión'}
                </Button>
              </Box>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
              {responseMessage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" align="center">
                    <strong>Respuesta del Servidor:</strong>
                  </Typography>
                  <pre>{responseMessage}</pre>
                </Box>
              )}
              {sentData && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" align="center">
                    <strong>Datos Enviados:</strong>
                  </Typography>
                  <pre>{sentData}</pre>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default LoginForm;
