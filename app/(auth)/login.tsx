import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
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
      
      // Navigate to index to handle terms checking
      router.replace('/');
      
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

  // const testConnection = async () => {
  //   console.log('Testing Appwrite connection...');
  //   try {
  //     const health = await account.get();
  //     console.log('Connection test result:', health);
  //     Alert.alert('Success', 'Connected to Appwrite successfully!');
  //   } catch (error: any) {
  //     console.error('Connection test error:', error);
  //     Alert.alert('Connection Error', error.message || 'Failed to connect to Appwrite');
  //   }
  // };

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      {/* Login Image */}
      <View className="items-center mb-8">
        <Image 
          source={require('../../assets/secure-login.png')} 
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>

      <View>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-3xl text-start p-2 mb-3 text-gray-800">Welcome Back! Glad to See you, Again!</Text>
      </View>
      <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-base text-center mb-8 text-gray-600">Sign in to your account</Text>

      <View className="space-y-4">
        <TextInput
          className="border border-black p-4 rounded-lg text-base bg-white mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ fontFamily: 'Poppins-Regular' }}
        />

        <TextInput
          className="border border-black p-4 rounded-lg text-base bg-white mb-8"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          style={{ fontFamily: 'Poppins-Regular' }}
        />

        <TouchableOpacity 
          className={`bg-primary p-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity 
          className="bg-green-500 p-3 rounded-lg items-center mt-3"
          onPress={testConnection}
        >
          <Text className="text-white text-sm font-semibold">Test Connection</Text>
        </TouchableOpacity> */}

        {/* Button to home */}
        {/* <Link href="/(tabs)" className="items-center mt-4">
          <Text className="text-primary text-base">Go to Home</Text>
        </Link> */}

        <Link href="/(auth)/signup" className="items-center mt-4">
          <Text className="text-primary text-base" style={{ fontFamily: 'Poppins-Regular' }}>Don&apos;t have an account? Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
