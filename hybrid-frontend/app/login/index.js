import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para guardar los datos del usuario

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Realiza la solicitud POST al backend
      const response = await axios.post('http://127.0.0.1:3001/api/v1/login', {
        email,
        password,
      });

      // Si la autenticación es exitosa
      const { data } = response.data.status;

      if (response.data.status.code === 200) {
        console.log('Login success:', data);

        // Guardar los datos del usuario en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        // Navegar a la pantalla principal (ajusta la ruta según sea necesario)
        navigation.navigate('Home');
      } else {
        // Si el código de estado no es 200, muestra un error
        setError(response.data.status.message || 'Error desconocido.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Iniciar Sesión</Text>

          {/* Campo de Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Campo de Contraseña */}
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Mostrar errores de autenticación */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Botón de Login */}
          <Button mode="contained" onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar Sesión'}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
