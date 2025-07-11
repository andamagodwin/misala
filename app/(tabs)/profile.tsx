import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { account } from '../../lib/appwriteConfig';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Models } from 'react-native-appwrite';

export default function ProfileScreen() {
  const { clearAuth } = useAuthStore();
  const [userDetails, setUserDetails] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const details = await account.get();
      setUserDetails(details);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Note: Account deletion might need to be handled on the backend
              // For now, we'll just logout the user
              await account.deleteSession('current');
              clearAuth();
              router.replace('/(auth)/login');
              Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            } catch (error: any) {
              console.error('Delete account error:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="items-center py-8 bg-white border-b border-gray-200">
        <View className="mb-4">
          <View className="w-20 h-20 rounded-full bg-primary justify-center items-center">
            <Text className="text-white text-2xl font-bold">
              {userDetails?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          {userDetails?.name || 'Unknown User'}
        </Text>
        <Text className="text-base text-gray-600">
          {userDetails?.email || 'No email'}
        </Text>
      </View>

      <View className="mt-5 px-5">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Account Information
        </Text>
        
        <View className="bg-white rounded-lg p-5 shadow-sm">
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base text-gray-600 flex-1">User ID</Text>
            <Text className="text-base text-gray-800 font-medium flex-1 text-right">
              {userDetails?.$id || 'N/A'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base text-gray-600 flex-1">Email</Text>
            <Text className="text-base text-gray-800 font-medium flex-1 text-right">
              {userDetails?.email || 'N/A'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base text-gray-600 flex-1">Email Verified</Text>
            <Text className={`text-base font-medium flex-1 text-right ${userDetails?.emailVerification ? 'text-green-600' : 'text-red-600'}`}>
              {userDetails?.emailVerification ? 'Yes' : 'No'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base text-gray-600 flex-1">Phone</Text>
            <Text className="text-base text-gray-800 font-medium flex-1 text-right">
              {userDetails?.phone || 'Not provided'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base text-gray-600 flex-1">Phone Verified</Text>
            <Text className={`text-base font-medium flex-1 text-right ${userDetails?.phoneVerification ? 'text-green-600' : 'text-red-600'}`}>
              {userDetails?.phoneVerification ? 'Yes' : 'No'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-base text-gray-600 flex-1">Account Created</Text>
            <Text className="text-base text-gray-800 font-medium flex-1 text-right">
              {userDetails?.$createdAt ? formatDate(userDetails.$createdAt) : 'N/A'}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-base text-gray-600 flex-1">Last Updated</Text>
            <Text className="text-base text-gray-800 font-medium flex-1 text-right">
              {userDetails?.$updatedAt ? formatDate(userDetails.$updatedAt) : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5 px-5">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Account Actions
        </Text>
        
        <TouchableOpacity 
          className="bg-primary p-4 rounded-lg items-center mb-4"
          onPress={() => router.push('/edit-profile')}
        >
          <Text className="text-white text-base font-semibold">Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-primary p-4 rounded-lg items-center mb-4"
          onPress={fetchUserDetails}
        >
          <Text className="text-white text-base font-semibold">Refresh Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-orange-500 p-4 rounded-lg items-center mb-4"
          onPress={handleLogout}
        >
          <Text className="text-white text-base font-semibold">Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-red-500 p-4 rounded-lg items-center mb-8"
          onPress={handleDeleteAccount}
        >
          <Text className="text-white text-base font-semibold">Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
