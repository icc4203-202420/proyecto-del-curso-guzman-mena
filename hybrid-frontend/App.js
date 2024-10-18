import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import 'react-native-gesture-handler';

// Importa las pantallas
import MainIndex from './app/index';
import ProfileIndex from './app/profile/index';
import MapIndex from './app/map/index';
import BeersIndex from './app/beers/index';
import BeersShow from './app/beers/show';
import BarsIndex from './app/bars/index';
import BarsShow from './app/bars/show';
import EventsIndex from './app/events/index';
import EventsShow from './app/events/show';
import LoginScreen from './app/loginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainIndex} 
        options={{ title: 'Inicio' }}
      />
      <Stack.Screen 
        name="Beers" 
        component={BeersIndex} 
        options={{ title: 'Cervezas' }} 
      />
      <Stack.Screen 
        name="BeersShow" 
        component={BeersShow} 
        options={{ title: 'Detalle de Cerveza' }} 
      />
      <Stack.Screen 
        name="Bars" 
        component={BarsIndex} 
        options={{ title: 'Bares' }} 
      />
      <Stack.Screen 
        name="BarsShow" 
        component={BarsShow} 
        options={{ title: 'Detalle de Bar' }} 
      />
      <Stack.Screen 
        name="Events" 
        component={EventsIndex} 
        options={{ title: 'Eventos' }} 
      />
      <Stack.Screen 
        name="EventsShow" 
        component={EventsShow} 
        options={{ title: 'Detalle de Evento' }} 
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={MainStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileIndex}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapIndex}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}