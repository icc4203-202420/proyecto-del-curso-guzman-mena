// app/_layout.js
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // Pantalla principal (Home)
        options={{
          title: 'Home', // Etiqueta para la pestaña
        }}
      />
      <Tabs.Screen
        name="map/index" // Pantalla del índice del mapa
        options={{
          title: 'Map', // Etiqueta para la pestaña
        }}
      />
      <Tabs.Screen
        name="profile/index" // Pantalla del índice de usuario
        options={{
          title: 'User', // Etiqueta para la pestaña
        }}
      />
    </Tabs>
  );
}
