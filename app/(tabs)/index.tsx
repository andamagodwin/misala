import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="flex-1 justify-center items-center p-5 bg-gray-100">
        <Text className="text-3xl font-bold text-gray-800 mb-8">Welcome to Misala!</Text>
        
        {user && (
          <View className="items-center mb-8 p-6 bg-white rounded-lg shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-2">Hello, {user.name}!</Text>
            <Text className="text-base text-gray-600">{user.email}</Text>
          </View>
        )}

        <View className="items-center">
          <Text className="text-base text-gray-600 text-center leading-6">
            This is your main dashboard. You can access your profile from the Profile tab.
          </Text>
        </View>
      </View>
    </>
  );
}
