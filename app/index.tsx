import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { StatusBar } from 'expo-status-bar';

export default function IndexPage() {
  const { user, isAuthenticated, isInitialized, checkTermsAcceptance } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && user) {
      // Check if user has accepted terms
      const hasAcceptedTerms = checkTermsAcceptance();
      
      if (hasAcceptedTerms) {
        // User is authenticated and has accepted terms, redirect to main tabs
        router.replace('/(tabs)');
      } else {
        // User is authenticated but hasn't accepted terms, redirect to terms screen
        router.replace('/terms-conditions');
      }
    } else {
      // User is not authenticated, redirect to login
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, user, isInitialized, router, checkTermsAcceptance]);

  // Show loading screen while determining where to redirect
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#008000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
