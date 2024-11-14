import React from 'react';
import { SafeAreaView } from 'react-native';
import ActivitySubscriber from './ActivitySubscriber';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ActivitySubscriber />
    </SafeAreaView>
  );
};

export default App;
