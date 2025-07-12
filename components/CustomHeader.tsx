import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
import { useState } from 'react';

export function CustomHeader() {
  // const router = useRouter();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    // TODO: Implement language switching logic
    Alert.alert('Language Selected', `Switched to ${language}`);
  };

  // const handleHistoryPress = () => {
  //   router.push('/history' as any);
  // };

  return (
    <View className="flex-row items-center space-x-4 pr-4">
      {/* Language Dropdown */}
      <View className="relative">
        <TouchableOpacity
          onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="p-2"
        >
          <Ionicons name="language" size={24} color="white" />
        </TouchableOpacity>
        
        {showLanguageDropdown && (
          <View className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-32 z-50">
            <TouchableOpacity
              onPress={() => handleLanguageSelect('English')}
              className={`p-3 border-b border-gray-200 ${selectedLanguage === 'English' ? 'bg-primary/10' : ''}`}
            >
              <Text className={`text-base ${selectedLanguage === 'English' ? 'text-primary font-semibold' : 'text-gray-800'}`}>
                English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleLanguageSelect('Kiswahili')}
              className={`p-3 ${selectedLanguage === 'Kiswahili' ? 'bg-primary/10' : ''}`}
            >
              <Text className={`text-base ${selectedLanguage === 'Kiswahili' ? 'text-primary font-semibold' : 'text-gray-800'}`}>
                Kiswahili
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      
    </View>
  );
}
