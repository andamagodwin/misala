import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
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
        { text: 'OK', onPress: () => router.replace('/') }
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
    <View className="flex-1 justify-center p-5 bg-white">
      {/* Signup Image */}
      <View className="items-center mb-6">
        <Image 
          source={require('../../assets/signup.png')} 
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>

      <Text className="text-3xl font-bold text-center mb-3 text-gray-800" style={{ fontFamily: 'Poppins-Bold' }}>Hello! Register to get started</Text>
      <Text className="text-base text-center mb-8 text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>Sign up to get started</Text>

      <View className="space-y-4 flex-col justify-center gap-4">
        <TextInput
          className="border border-black p-4 rounded-lg text-base bg-white"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          style={{ fontFamily: 'Poppins-Regular' }}
        />

        <TextInput
          className="border border-black p-4 rounded-lg text-base bg-white"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ fontFamily: 'Poppins-Regular' }}
        />

        <TextInput
          className="border border-black p-4 rounded-lg text-base bg-white"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          style={{ fontFamily: 'Poppins-Regular' }}
        />

        <TextInput
          className="border border-black p-4 rounded-lg text-base bg-white"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          style={{ fontFamily: 'Poppins-Regular' }}
        />

        <TouchableOpacity 
          className={`bg-primary p-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" className="items-center mt-4">
          <Text className="text-primary text-base" style={{ fontFamily: 'Poppins-Regular' }}>Already have an account? Sign in</Text>
        </Link>
      </View>
    </View>
  );
}
