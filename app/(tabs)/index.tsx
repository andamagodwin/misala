import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const makePrediction = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    console.log('Making prediction on image:', selectedImage);
    
    // TODO: Implement your prediction logic here
    Alert.alert('Prediction', 'Prediction functionality will be implemented here!');
  };

  const removeImage = () => {
    setSelectedImage(null);
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
                className="bg-primary px-6 py-3 rounded-lg shadow-sm"
              >
                <Text className="text-white font-semibold">Identify</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={removeImage}
                className="bg-red-500 px-6 py-3 rounded-lg shadow-sm"
              >
                <Text className="text-white font-semibold">Remove</Text>
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
          <Text className="text-base text-gray-600 text-center leading-6">
            {selectedImage 
              ? "Great! Now you can make a prediction on your selected image." 
              : "Choose an image from your gallery or take a photo to get started."
            }
          </Text>
        </View>
      </View>
    </>
  );
}
