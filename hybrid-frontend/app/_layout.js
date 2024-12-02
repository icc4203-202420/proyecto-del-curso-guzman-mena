import { Slot, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Layout() {
  const router = useRouter(); // Hook para manejar la navegación

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')} // Navega al Home
        >
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.homeText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Contenedor de vistas */}
      <View style={styles.content}>
        <Slot /> {/* Renderiza las vistas actuales aquí */}
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/beers')} // Navega a la vista de cervezas
        >
          <FontAwesome name="beer" size={24} color="#6200ee" />
          <Text style={styles.buttonText}>Cervezas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/bars')} // Navega a la vista de bares
        >
          <FontAwesome name="glass" size={24} color="#6200ee" />
          <Text style={styles.buttonText}>Bares</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/events')} // Navega a la vista de eventos
        >
          <FontAwesome name="calendar" size={24} color="#6200ee" />
          <Text style={styles.buttonText}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/profile')} // Navega a la vista de perfil
        >
          <FontAwesome name="user" size={24} color="#6200ee" />
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#6200ee',
    padding: 10,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  homeText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: '#6200ee',
    marginTop: 5,
  },
});
