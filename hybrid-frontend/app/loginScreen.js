import React, { useState } from 'react';
import { Text, View, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL } from '@env';
import { saveItem, getItem, deleteItem } from "../util/Storage";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const apiUrl = REACT_APP_API_URL;

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

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/v1/login`, {
        user: { email, password },
      });

      if (response.data.status.code === 200) {
        const currentUser = response.data.status.data.user.id;
        await saveItem("userId",  currentUser.toString());
        // await AsyncStorage.setItem('@user_id', currentUser.toString());
        setMessage('You have logged in successfully');
        setMessageType('success');
        navigation.navigate('index');
      } else {
        setMessage(response.data.status.message || 'Invalid credentials');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error || 'Invalid credentials'
          : 'An unexpected error occurred. Please try again.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {message && typeof message === 'string' && (
        <Text style={[styles.message, messageType === 'error' ? styles.error : styles.success]}>
          {message}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    textAlign: 'center',
    marginBottom: 10,
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
});
