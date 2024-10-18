import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import axios from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validación del formulario
  const validateForm = () => {
    console.log('Validating form');
    if (!email || !password) {
      console.log('Validation failed: Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Validation failed: Invalid email format');
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    console.log('Validation passed');
    return true;
  };

  // Función para manejar el login
  const handleLogin = async () => {
    console.log('Login button pressed');

    // Validamos el formulario
    if (!validateForm()) {
      console.log('Form validation failed, stopping login');
      return;
    }

    setLoading(true);
    console.log('Starting login request, loading set to true');

    try {
      // Llamada a la API para hacer login
      console.log('Sending login request to the API');
      const response = await axios.post('http://127.0.0.1:3001/api/v1/login', {
        user: { email, password },
      });

      console.log('Response received:', response.data);

      if (response.data.status.code === 200) {
        console.log('Login successful');
        Alert.alert('Success', 'You have logged in successfully.');
        // Aquí navegarías a la pantalla principal, si fuera necesario
        // navigation.navigate('Home');
      } else {
        console.log('Login failed: Invalid credentials');
        Alert.alert('Login Failed', response.data.status.message);
      }
    } catch (error) {
      // Capturamos errores en la solicitud o en la API
      console.log('Error during login request:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error response from API:', error.response.data);
        Alert.alert('Login Failed', error.response.data.error || 'Invalid credentials');
      } else {
        console.log('Unexpected error occurred');
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      console.log('Login request finished, loading set to false');
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Login</Text>

      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={(value) => {
          setEmail(value);
          console.log('Email input changed:', value);
        }}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        placeholder="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        onChangeText={(value) => {
          setPassword(value);
          console.log('Password input changed:', value);
        }}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
