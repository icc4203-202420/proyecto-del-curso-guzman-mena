import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../api/axios';

const SignupForm = () => {
  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string().required('El apellido es requerido'),
    email: Yup.string().email('Correo inválido').required('El email es requerido'),
    handle: Yup.string().required('El handle es requerido'),
    password: Yup.string().required('La contraseña es requerida').min(6, 'Mínimo 6 caracteres'),
  });

  const handleSignup = (values, { setSubmitting, setFieldError, setStatus }) => {
    api.post('/signup', {
      user: {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        handle: values.handle,
        password: values.password,
      },
    })
    .then(response => {
      setStatus({ success: 'Registro exitoso. ¡Ahora puedes iniciar sesión!' });
    })
    .catch(error => {
      console.error('Error en el registro:', error);
      setFieldError('general', 'Error al registrarse. Inténtalo de nuevo.');
    })
    .finally(() => setSubmitting(false));
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Regístrate</Typography>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', handle: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting, errors, touched, status }) => (
          <Form>
            <Box mb={2}>
              <Field
                name="firstName"
                as={TextField}
                label="Nombre"
                variant="outlined"
                fullWidth
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
              />
            </Box>
            <Box mb={2}>
              <Field
                name="lastName"
                as={TextField}
                label="Apellido"
                variant="outlined"
                fullWidth
                error={touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
              />
            </Box>
            <Box mb={2}>
              <Field
                name="email"
                as={TextField}
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
            </Box>
            <Box mb={2}>
              <Field
                name="handle"
                as={TextField}
                label="Handle (Ej. @usuario)"
                variant="outlined"
                fullWidth
                error={touched.handle && !!errors.handle}
                helperText={touched.handle && errors.handle}
              />
            </Box>
            <Box mb={2}>
              <Field
                name="password"
                as={TextField}
                type="password"
                label="Contraseña"
                variant="outlined"
                fullWidth
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
            </Box>
            {errors.general && <Typography color="error">{errors.general}</Typography>}
            {status?.success && <Typography color="success">{status.success}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignupForm;
