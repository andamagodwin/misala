import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { account } from '../../lib/appwriteConfig';
import { Models } from 'react-native-appwrite';

export default function EditProfileScreen() {
  const { user, setAuth } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Models.User<Models.Preferences> | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setInitialData(user);
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      // Update name
      if (name !== initialData?.name) {
        await account.updateName(name);
      }

      // Update email (this might require verification)
      if (email !== initialData?.email) {
        try {
          await account.updateEmail(email, user?.email || '');
        } catch {
          Alert.alert('Email Update', 'Email update requires verification. Please check your email.');
        }
      }

      // Update phone (this might require verification)
      if (phone !== initialData?.phone) {
        try {
          await account.updatePhone(phone, user?.phone || '');
        } catch {
          Alert.alert('Phone Update', 'Phone update requires verification. Please check your phone.');
        }
      }

      // Get updated user data
      const updatedUser = await account.get();
      setAuth(updatedUser);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);

    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    Alert.alert(
      'Change Password',
      'This will send a password reset email to your registered email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Reset Email',
          onPress: async () => {
            try {
              await account.createRecovery(user?.email || '', 'https://your-app.com/reset-password');
              Alert.alert('Success', 'Password reset email sent!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to send reset email');
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#6cf16b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              <Text className={`text-white font-semibold ${loading ? 'opacity-50' : ''}`}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView className="flex-1">
        <View className="p-5 space-y-6">
          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">Full Name</Text>
            <TextInput
              className="border border-gray-300 p-4 rounded-lg text-base bg-white"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 p-4 rounded-lg text-base bg-white"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text className="text-sm text-gray-500 mt-1">
              Changing email will require verification
            </Text>
          </View>

          <View>
            <Text className="text-base font-semibold text-gray-700 mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 p-4 rounded-lg text-base bg-white"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            <Text className="text-sm text-gray-500 mt-1">
              Changing phone will require verification
            </Text>
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-800 mb-3">Security</Text>
            <TouchableOpacity 
              className="bg-primary p-4 rounded-lg items-center"
              onPress={handlePasswordChange}
            >
              <Text className="text-white font-semibold">Change Password</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-800 mb-3">Account Info</Text>
            <View className="bg-white p-4 rounded-lg space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">User ID</Text>
                <Text className="text-gray-800 font-medium">{user?.$id}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Account Created</Text>
                <Text className="text-gray-800 font-medium">
                  {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
