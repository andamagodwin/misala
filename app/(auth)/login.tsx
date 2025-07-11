import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { account } from '../../lib/appwriteConfig';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    console.log('Attempting login with email:', email);

    try {
      // Create email session
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Login successful, session:', session);
      
      // Get user details
      const user = await account.get();
      console.log('User details:', user);
      
      // Update auth store
      setAuth(user);
      
      // Navigate to main app
      router.replace('/(tabs)');
      
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 401) {
        errorMessage = 'Invalid email or password';
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    console.log('Testing Appwrite connection...');
    try {
      const health = await account.get();
      console.log('Connection test result:', health);
      Alert.alert('Success', 'Connected to Appwrite successfully!');
    } catch (error: any) {
      console.error('Connection test error:', error);
      Alert.alert('Connection Error', error.message || 'Failed to connect to Appwrite');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={testConnection}>
          <Text style={styles.testButtonText}>Test Connection</Text>
        </TouchableOpacity>

        <Link href="/(auth)/signup" style={styles.link}>
          <Text style={styles.linkText}>Don&apos;t have an account? Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  link: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
