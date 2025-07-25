import { Stack, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useHistoryStore } from '../../store/historyStore';
import { FeedbackModal } from '../../components/FeedbackModal';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    class: string;
    confidence: number;
  } | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        t('permissions.required'),
        t('permissions.message')
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const makePrediction = async () => {
    if (!selectedImage) {
      Alert.alert(t('prediction.noImage.title'), t('prediction.noImage.message'));
      return;
    }
    
    setIsLoading(true);
    setPredictionResult(null);
    
    try {
      console.log('Making prediction on image:', selectedImage);
      
      // Create FormData
      const formData = new FormData();
      
      // Add the image file to form data
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);
      
      // Make the API request
      const response = await fetch('https://image-prediction-uzi7.onrender.com/predict', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Prediction result:', result);
      
      // Ensure the result has the expected structure
      if (!result.class || result.confidence === undefined) {
        throw new Error('Invalid prediction result format');
      }
      
      setPredictionResult(result);
      
      // Save to history - keep confidence as percentage
      const historyStore = useHistoryStore.getState();
      await historyStore.saveHistory(
        result.class,
        result.confidence, // Keep as percentage (0-100)
        selectedImage
      );
      
    } catch (error) {
      console.error('Error making prediction:', error);
      Alert.alert(
        t('prediction.error.title'),
        t('prediction.error.message')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPredictionResult(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View className="flex-1 bg-white">
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
        {/* Image Picker Section */}
        <View className="mb-8">
          
          <View className="flex-row justify-evenly space-x-4 mb-6">
            <TouchableOpacity
              onPress={pickImageFromGallery}
              className="bg-primary px-6 py-3 rounded-lg shadow-sm flex-row items-center"
            >
              <MaterialIcons name="photo-library" size={24} color="white" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white ml-2">{t('gallery')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={takePhoto}
              className="bg-primary px-6 py-3 rounded-lg shadow-sm flex-row items-center"
            >
              <MaterialIcons name="camera-alt" size={24} color="white" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white ml-2">{t('camera')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Image Display */}
        {selectedImage && (
          <View className="mb-8 items-center">
            <Image
              source={{ uri: selectedImage }}
              className="w-64 h-64 rounded-lg mb-4"
              resizeMode="cover"
            />
            <View className="flex-row w-full justify-evenly">
              <TouchableOpacity
                onPress={makePrediction}
                disabled={isLoading}
                className={`bg-primary px-6 py-3 rounded-lg shadow-sm flex-row items-center ${isLoading ? 'opacity-50' : ''}`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">{t('identify')}</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={removeImage}
                disabled={isLoading}
                className={`bg-red-500 px-6 py-3 rounded-lg shadow-sm ${isLoading ? 'opacity-50' : ''}`}
              >
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">{t('remove')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Prediction Results Display */}
        {predictionResult && (
          <View className="mb-8 items-center">
            <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-800 mb-4 text-center">
                {t('prediction.result.title')}
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-600">{t('prediction.result.plant')}:</Text>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-primary">
                    {predictionResult.class}
                  </Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-600">{t('prediction.result.confidence')}:</Text>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800">
                    {predictionResult.confidence}%
                  </Text>
                </View>
              </View>
              
              <View className="mt-4 bg-gray-100 rounded-lg p-3">
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-sm text-gray-600 text-center">
                  {predictionResult.confidence >= 80 
                    ? t('prediction.result.highConfidence') 
                    : predictionResult.confidence >= 60 
                    ? t('prediction.result.moderateConfidence') 
                    : t('prediction.result.lowConfidence')}
                </Text>
              </View>

              {/* Learn More Button */}
              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/plant-detail',
                  params: { className: predictionResult.class }
                })}
                className="mt-4 bg-primary/10 border border-primary rounded-lg p-3 flex-row items-center justify-center"
              >
                <MaterialIcons name="info" size={20} color="#008000" />
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-primary ml-2">
                  {t('prediction.result.learnMore')}
                </Text>
              </TouchableOpacity>

              {/* Report Issue Button */}
              <TouchableOpacity
                onPress={() => setShowFeedbackModal(true)}
                className="mt-2 bg-orange-50 border border-orange-300 rounded-lg p-3 flex-row items-center justify-center"
              >
                <MaterialIcons name="report-problem" size={20} color="#ea580c" />
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-orange-600 ml-2">
                  {t('prediction.result.reportIssue')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Default Image Display */}
        {!selectedImage && (
          <View className="mb-8 items-center">
            <Image
              source={require('../../assets/poppy-flower.png')}
              className="w-64 h-64 rounded-lg mb-4"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Instructions */}
        <View className="items-center">
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-center leading-6 w-72">
            {predictionResult 
              ? `${t('prediction.instructions.plantIdentified')} ${predictionResult.class} ${t('prediction.instructions.confidence')} ${predictionResult.confidence}%.`
              : selectedImage 
              ? t('prediction.instructions.imageSelected') 
              : t('prediction.instructions.chooseImage')
            }
          </Text>
        </View>

        {/* Extra padding for scroll */}
        <View className="h-10" />
        </ScrollView>
      </View>

      {/* Feedback Modal */}
      {predictionResult && selectedImage && (
        <FeedbackModal
          visible={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          predictionResult={predictionResult}
          imageUri={selectedImage}
        />
      )}
    </>
  );
}
