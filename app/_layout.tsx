import 'react-native-url-polyfill/auto';
import '../global.css';
import '../i18n/config'; // Initialize i18n

import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { StatusBar } from 'expo-status-bar';
import { loadFonts } from '../utils/fonts';

export default function RootLayout() {
  const { initialize } = useAuthStore();
  const [initError, setInitError] = useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load fonts first
        await loadFonts();
        setFontsLoaded(true);
        
        // Then initialize the app
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
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center', marginBottom: 10, fontFamily: 'Poppins-Medium' }}>
          App Failed to Start
        </Text>
        <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', fontFamily: 'Poppins-Regular' }}>
          {initError}
        </Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: 'gray' }}>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#008000" style="auto" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="terms-conditions" />
        <Stack.Screen name="chatbot" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen 
          name="profile" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#008000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="add-remedy" 
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#008000',
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
