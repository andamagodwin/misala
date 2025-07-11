import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useHistoryStore } from '../../store/historyStore';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    class: string;
    confidence: number;
  } | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Sorry, we need camera and media library permissions to make this work!'
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
      Alert.alert('No Image', 'Please select an image first');
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
        'Prediction Error',
        'Failed to make prediction. Please try again.'
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
      <Stack.Screen options={{ title: 'Identify' }} />
      <View className="flex-1 p-5 bg-white">
        {/* <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">Welcome to Misala!</Text>
        
        {user && (
          <View className="items-center mb-8 p-6 bg-white rounded-lg shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-2">Hello, {user.name}!</Text>
            <Text className="text-base text-gray-600">{user.email}</Text>
          </View>
        )} */}

        {/* Image Picker Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Select an image for prediction
          </Text>
          
          <View className="flex-row justify-evenly space-x-4 mb-6">
            <TouchableOpacity
              onPress={pickImageFromGallery}
              className="bg-primary px-6 py-3 rounded-lg shadow-sm flex-row items-center"
            >
              <MaterialIcons name="photo-library" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={takePhoto}
              className="bg-primary px-6 py-3 rounded-lg shadow-sm flex-row items-center"
            >
              <MaterialIcons name="camera-alt" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Camera</Text>
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
                  <Text className="text-white font-semibold">Identify</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={removeImage}
                disabled={isLoading}
                className={`bg-red-500 px-6 py-3 rounded-lg shadow-sm ${isLoading ? 'opacity-50' : ''}`}
              >
                <Text className="text-white font-semibold">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Prediction Results Display */}
        {predictionResult && (
          <View className="mb-8 items-center">
            <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-sm">
              <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
                Prediction Result
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">Plant:</Text>
                  <Text className="text-lg font-bold text-primary">
                    {predictionResult.class}
                  </Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">Confidence:</Text>
                  <Text className="text-lg font-bold text-gray-800">
                    {predictionResult.confidence}%
                  </Text>
                </View>
              </View>
              
              <View className="mt-4 bg-gray-100 rounded-lg p-3">
                <Text className="text-sm text-gray-600 text-center">
                  {predictionResult.confidence >= 80 
                    ? "High confidence prediction" 
                    : predictionResult.confidence >= 60 
                    ? "Moderate confidence prediction" 
                    : "Low confidence prediction"}
                </Text>
              </View>
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
          <Text className="text-base text-gray-600 text-center leading-6">
            {predictionResult 
              ? `The plant has been identified as ${predictionResult.class} with ${predictionResult.confidence}% confidence.`
              : selectedImage 
              ? "Great! Now you can identify your selected image." 
              : "Choose an image from your gallery or take a photo to get started."
            }
          </Text>
        </View>
      </View>
    </>
  );
}
