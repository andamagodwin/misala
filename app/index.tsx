import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function IndexPage() {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      // User is authenticated, redirect to main tabs
      router.replace('/(tabs)');
    } else {
      // User is not authenticated, redirect to login
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, user, isInitialized, router]);

  // Show loading screen while determining where to redirect
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
