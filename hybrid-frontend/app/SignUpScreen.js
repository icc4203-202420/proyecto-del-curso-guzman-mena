import { Text, View, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { REACT_APP_API_URL } from '@env';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const apiUrl = REACT_APP_API_URL;

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !handle) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return false;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
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

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/v1/signup`, {
        user: {
          email,
          password,
          password_confirmation: confirmPassword,
          first_name: firstName,
          last_name: lastName,
          handle,
        },
      });

      if (response.data.status.code === 200) {
        setMessage('You have signed up successfully');
        setMessageType('success');
        setTimeout(() => {
          router.push('/loginScreen'); // Cambiar a la ruta /profile
        }, 2000);
      } else {
        setMessage(response.data.status.message || 'Error during sign up');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error || 'Error during sign up'
          : 'An unexpected error occurred. Please try again.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {message && typeof message === 'string' && (
        <Text style={[styles.message, messageType === 'error' ? styles.error : styles.success]}>
          {message}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Handle (Username)"
        value={handle}
        onChangeText={setHandle}
        autoCapitalize="none"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title={loading ? 'Signing up...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />
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
