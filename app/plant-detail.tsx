import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { usePlantInfoStore } from '../store/plantInfoStore';

export default function PlantDetailScreen() {
  const { className } = useLocalSearchParams();
  const router = useRouter();
  const { plantInfo, isLoading, error, getPlantByClassName, clearError } = usePlantInfoStore();
  
  useEffect(() => {
    if (className && typeof className === 'string') {
      getPlantByClassName(className);
    }
  }, [className, getPlantByClassName]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Custom Header */}
        <View className="bg-primary px-4 py-3 flex-row items-center shadow-sm">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xl flex-1">
            Plant Information
          </Text>
        </View>
        
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#008000" />
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">
            Loading plant information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plantInfo) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Custom Header */}
        <View className="bg-primary px-4 py-3 flex-row items-center shadow-sm">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2 -ml-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xl flex-1">
            Plant Information
          </Text>
        </View>
        
        <View className="flex-1 justify-center items-center p-5">
          <MaterialIcons name="info-outline" size={80} color="#ccc" />
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-600 mt-4 text-center">
            No Information Available
          </Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 mt-2 text-center">
            We don&apos;t have detailed information about this plant yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary px-6 py-3 rounded-lg mt-6"
          >
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View className="bg-primary px-4 py-3 flex-row items-center shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 -ml-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xl flex-1">
          Plant Information
        </Text>
      </View>
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-200">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mr-4">
                <MaterialIcons name="eco" size={32} color="white" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">
                  {plantInfo.common_name}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Italic' }} className="text-gray-600 text-base">
                  {plantInfo.scientific_name}
                </Text>
                {plantInfo.luhya_name && (
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-green-600 text-sm mt-1">
                    Local name: {plantInfo.luhya_name}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Ailments Treated */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-200">
          <View className="p-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="healing" size={24} color="#008000" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 ml-2">
                Ailments Treated
              </Text>
            </View>
            <View className="bg-blue-50 rounded-lg p-4">
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-blue-800 leading-6">
                {plantInfo.ailment_treated}
              </Text>
            </View>
          </View>
        </View>

        {/* Preparation Method */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-200">
          <View className="p-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="science" size={24} color="#008000" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 ml-2">
                Preparation Method
              </Text>
            </View>
            <View className="bg-green-50 rounded-lg p-4">
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-green-800 leading-6">
                {plantInfo.preparation_method}
              </Text>
            </View>
          </View>
        </View>

        {/* Dosage */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-200">
          <View className="p-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="medication" size={24} color="#008000" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 ml-2">
                Dosage & Usage
              </Text>
            </View>
            <View className="bg-orange-50 rounded-lg p-4">
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-orange-800 leading-6">
                {plantInfo.dosage}
              </Text>
            </View>
          </View>
        </View>

        {/* Warning */}
        <View className="bg-white mx-4 mt-4 mb-6 rounded-xl shadow-sm border border-gray-200">
          <View className="p-6">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="warning" size={24} color="#f59e0b" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 ml-2">
                Important Notice
              </Text>
            </View>
            <View className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-yellow-800 leading-6">
                ⚠️ This information is for educational purposes only. Always consult with a healthcare professional before using any plant for medicinal purposes, especially if you have existing health conditions or are taking medications.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
