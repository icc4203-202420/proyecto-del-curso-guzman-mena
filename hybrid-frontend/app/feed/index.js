// src/feed/index.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ActivitySubscriber from './ActivitySubscriber';

const Feed = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivitySubscriber />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Feed;
