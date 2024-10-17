import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import BottomTabNavigator from './BottomTabNavigator';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomTabNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}