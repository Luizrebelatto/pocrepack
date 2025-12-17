import React, { Suspense } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';

const MyButton = React.lazy(() => import('./Button'));

export default function RemoteButton() {
  return (
    <Suspense
      fallback={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando componente...</Text>
        </View>
      }
    >
      <MyButton />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
