import 'react-native-url-polyfill/auto';
import '../global.css';

import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const { initialize } = useAuthStore();
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeApp();
  }, [initialize]);

  if (initError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center', marginBottom: 10 }}>
          App Failed to Start
        </Text>
        <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center' }}>
          {initError}
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#6cf16b" style="auto" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen 
          name="add-remedy" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#6cf16b',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
