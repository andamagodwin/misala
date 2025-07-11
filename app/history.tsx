import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function HistoryScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'History',
          headerStyle: {
            backgroundColor: '#6cf16b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl font-bold text-gray-800 mb-4">History Screen</Text>
        <Text className="text-base text-gray-600 text-center px-4">
          This screen will show your prediction history.
        </Text>
      </View>
    </>
  );
}
