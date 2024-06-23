import React from 'react';
import { StyleSheet, View } from 'react-native';
import MainStack from './navigation/MainStack';

export default function App() {
  return (
    <View style={styles.container}>
      <MainStack/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
