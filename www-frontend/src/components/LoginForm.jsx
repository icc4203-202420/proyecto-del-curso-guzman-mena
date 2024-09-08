import React, { useState } from 'react';

const LoginForm = () => {
  // Definir el estado para email, password y el token
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Función para manejar la llamada a la API de login
  const handleLogin = () => {
    // Datos de inicio de sesión
    const loginData = {
      user: {
        email,
        password
      }
    };

    // Realizar la llamada a la API
    fetch('http://localhost:3001/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => {
        // Obtener el token del header 'Authorization'
        const authorizationToken = response.headers.get('Authorization');
        return response.json().then(data => ({ data, authorizationToken }));
      })
      .then(({ data, authorizationToken }) => {
        if (authorizationToken) {
          // Guardar el token en localStorage
          localStorage.setItem('token', authorizationToken);
          setMessage(`Login exitoso. Token guardado: ${authorizationToken}`);
        } else {
          setMessage('Login exitoso, pero no se recibió un token.');
        }
        console.log('Usuario logueado:', data);
      })
      .catch(error => {
        console.error('Error en la llamada de login:', error);
        setMessage('Error al realizar el login');
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
