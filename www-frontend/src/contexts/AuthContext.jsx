import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);  // Estado del usuario autenticado

  const login = (userData) => {
    setUser(userData);  // Guardar el usuario en el estado
    console.log('Usuario autenticado:', userData);  // Imprimir el usuario para ver que se guarda correctamente
  };

  const logout = () => setUser(null);  // Función para cerrar sesión

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
