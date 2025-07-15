import { Stack, useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  Image 
} from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRemedyStore } from '../store/remedyStore';

export default function AddRemedyScreen() {
  const [formData, setFormData] = useState({
    title: '',
    common_name: '',
    plant_name: '',
    scientific_name: '',
    local_name: '',
    preparation_method: '',
    usage_instructions: '',
    ailments_treated: '',
    cautions: '',
  });
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRemedy } = useRemedyStore();
  const router = useRouter();

  const pickImage = async () => {
    if (isSubmitting) return;
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for the remedy');
      return;
    }
    if (!formData.common_name.trim()) {
      Alert.alert('Validation Error', 'Please enter a common name');
      return;
    }
    if (!formData.plant_name.trim()) {
      Alert.alert('Validation Error', 'Please enter the plant name');
      return;
    }
    if (!formData.scientific_name.trim()) {
      Alert.alert('Validation Error', 'Please enter the scientific name');
      return;
    }
    if (!formData.preparation_method.trim()) {
      Alert.alert('Validation Error', 'Please enter the preparation method');
      return;
    }
    if (!formData.usage_instructions.trim()) {
      Alert.alert('Validation Error', 'Please enter usage instructions');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRemedy({
        ...formData,
        image: selectedImage || undefined,
      });
      
      Alert.alert(
        'Success', 
        'Remedy shared successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting remedy:', error);
      Alert.alert('Error', 'Failed to share remedy. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    
    // Check if form has data or image
    const hasData = Object.values(formData).some(value => value.trim() !== '') || selectedImage;
    
    if (hasData) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Share a Remedy',
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} disabled={isSubmitting}>
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSubmit} 
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#008000" />
              ) : (
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-primary">Share</Text>
              )}
            </TouchableOpacity>
          )
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <ScrollView className="flex-1 p-5">
          {/* Title */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Title *</Text>
            <TextInput
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="e.g., Cold Relief Tea"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              editable={!isSubmitting}
            />
          </View>

          {/* Plant Image */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Plant Image (Optional)</Text>
            
            {selectedImage ? (
              <View className="relative">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-48 rounded-lg"
                  style={{ resizeMode: 'cover' }}
                />
                <TouchableOpacity
                  onPress={removeImage}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                  disabled={isSubmitting}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                className="border-2 border-dashed border-gray-300 rounded-lg py-12 items-center justify-center"
                disabled={isSubmitting}
              >
                <MaterialIcons name="add-photo-alternate" size={48} color="#9CA3AF" />
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 mt-2">
                  Tap to add a plant image
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Common Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Common Name *</Text>
            <TextInput
              value={formData.common_name}
              onChangeText={(text) => setFormData({ ...formData, common_name: text })}
              placeholder="e.g., Ginger"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              editable={!isSubmitting}
            />
          </View>

          {/* Plant Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Plant Name *</Text>
            <TextInput
              value={formData.plant_name}
              onChangeText={(text) => setFormData({ ...formData, plant_name: text })}
              placeholder="e.g., Ginger plant"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              editable={!isSubmitting}
            />
          </View>

          {/* Scientific Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Scientific Name *</Text>
            <TextInput
              value={formData.scientific_name}
              onChangeText={(text) => setFormData({ ...formData, scientific_name: text })}
              placeholder="e.g., Zingiber officinale"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              editable={!isSubmitting}
            />
          </View>

          {/* Local Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Local Name (Optional)</Text>
            <TextInput
              value={formData.local_name}
              onChangeText={(text) => setFormData({ ...formData, local_name: text })}
              placeholder="e.g., Tangawizi"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              editable={!isSubmitting}
            />
          </View>

          {/* Ailments Treated */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Ailments Treated (Optional)</Text>
            <TextInput
              value={formData.ailments_treated}
              onChangeText={(text) => setFormData({ ...formData, ailments_treated: text })}
              placeholder="What ailments does this remedy treat?"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Preparation Method */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Preparation Method *</Text>
            <TextInput
              value={formData.preparation_method}
              onChangeText={(text) => setFormData({ ...formData, preparation_method: text })}
              placeholder="Step-by-step preparation instructions"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Usage Instructions */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Usage Instructions *</Text>
            <TextInput
              value={formData.usage_instructions}
              onChangeText={(text) => setFormData({ ...formData, usage_instructions: text })}
              placeholder="How to use this remedy"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Cautions */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Cautions (Optional)</Text>
            <TextInput
              value={formData.cautions}
              onChangeText={(text) => setFormData({ ...formData, cautions: text })}
              placeholder="Any warnings or precautions"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`bg-primary py-4 rounded-lg flex-row items-center justify-center mb-6 ${
              isSubmitting ? 'opacity-50' : ''
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="send" size={20} color="white" />
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-white ml-2 text-base">Share Remedy</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Required Fields Note */}
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm text-center mb-8">
            Fields marked with * are required
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
