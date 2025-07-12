import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export const ProfileHeader = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePress = () => {
    router.push('/profile');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center px-4 py-2"
    >
      <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center mr-2">
        <Text className="text-white font-bold text-sm">
          {getInitials(user?.name || '')}
        </Text>
      </View>
      <Text className="text-white font-medium text-sm">
        {user?.name || 'Profile'}
      </Text>
    </TouchableOpacity>
  );
};
