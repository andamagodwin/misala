import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LanguageSwitcher from './LanguageSwitcher';

export function CustomHeader() {
  const router = useRouter();

  const handleChatbotPress = () => {
    router.push('/chatbot' as any);
  };

  const handleHerbalistPress = () => {
    router.push('/herbalists' as any);
  };

  return (
    <View className="flex-row items-center space-x-4 pr-4">
      {/* Language Switcher */}
      <LanguageSwitcher variant="header" />

      {/* Herbalist Directory Icon */}
      <TouchableOpacity
        onPress={handleHerbalistPress}
        className="p-2"
      >
        <Ionicons name="medical" size={24} color="white" />
      </TouchableOpacity>

      {/* AI Chatbot Icon */}
      <TouchableOpacity
        onPress={handleChatbotPress}
        className="p-2"
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
