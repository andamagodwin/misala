import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { account } from '../../lib/appwriteConfig';
import { useAuthStore } from '../../store/authStore';
import { ID } from 'react-native-appwrite';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    console.log('Attempting signup with email:', email);

    try {
      // Create user account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      console.log('Account created:', user);

      // Create email session (auto login after signup)
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);

      // Get user details
      const userDetails = await account.get();
      console.log('User details:', userDetails);

      // Update auth store
      setAuth(userDetails);

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);

    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 409) {
        errorMessage = 'An account with this email already exists';
      }
      
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-gray-100">
      <Text className="text-3xl font-bold text-center mb-3 text-gray-800">Create Account</Text>
      <Text className="text-base text-center mb-8 text-gray-600">Sign up to get started</Text>

      <View className="space-y-4">
        <TextInput
          className="border border-gray-300 p-4 rounded-lg text-base bg-white"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          className="border border-gray-300 p-4 rounded-lg text-base bg-white"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          className="border border-gray-300 p-4 rounded-lg text-base bg-white"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          className="border border-gray-300 p-4 rounded-lg text-base bg-white"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity 
          className={`bg-blue-500 p-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">Create Account</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" className="items-center mt-4">
          <Text className="text-blue-500 text-base">Already have an account? Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
