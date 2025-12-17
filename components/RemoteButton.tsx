import React, { Suspense } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { ChunkManager } from '@callstack/repack/client';

// Configurar o resolver de chunks remotos
ChunkManager.configure({
  resolve: async (chunkId: string) => {
    // URL base do seu servidor (altere conforme necessário)
    const BASE_URL = 'http://localhost:3000/bundles';

    // Para desenvolvimento: use bundles locais
    // Para produção: mude isRemote para true
    const isRemote = false;

    if (isRemote) {
      // Carregar chunk de URL remota
      return {
        url: `${BASE_URL}/${chunkId}`,
        cache: false, // Para dev, desabilite cache
      };
    }

    // Fallback: carregar chunk local
    return {
      url: ChunkManager.getChunkURL(chunkId),
    };
  },
});

// Carregamento lazy do componente Button
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
