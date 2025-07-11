import 'react-native-url-polyfill/auto';
import '../global.css';

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
