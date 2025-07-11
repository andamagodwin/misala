import { Stack, router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { account } from '../../lib/appwriteConfig';

export default function Home() {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Logging out...');
              await account.deleteSession('current');
              console.log('Logout successful');
              clearAuth();
              router.replace('/(auth)/login');
            } catch (error: any) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Misala!</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.welcome}>Hello, {user.name}!</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.userId}>User ID: {user.$id}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
