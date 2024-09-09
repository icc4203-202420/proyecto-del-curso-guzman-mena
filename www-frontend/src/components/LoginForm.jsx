import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Correo inválido').required('El email es requerido'),
    password: Yup.string().required('La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
  });

  const handleLogin = (values, { setSubmitting, setFieldError }) => {
    axios.post('api/v1/login', {
      user: {
        email: values.email,
        password: values.password
      }
    })
    .then(response => {
      const authorizationToken = response.headers['authorization'];
      if (authorizationToken) {
        localStorage.setItem('token', authorizationToken);
        localStorage.setItem('userName', response.data.status.data.user.first_name);
        navigate('/'); // Redirigir al dashboard o página principal
      }
    })
    .catch(error => {
      console.error('Error en el login:', error);
      setFieldError('general', 'Error en el login');
    })
    .finally(() => setSubmitting(false));
  };

  return (
    <Box sx={{ width: 300, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Box mb={2}>
              <Field
                name="email"
                as={TextField}
                label="Email"
                variant="outlined"
                fullWidth
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
            </Box>
            <Box mb={2}>
              <Field
                name="password"
                as={TextField}
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
            </Box>
            {errors.general && <Typography color="error">{errors.general}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
