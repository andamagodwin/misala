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
  ActivityIndicator 
} from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRemedyStore } from '../store/remedyStore';

export default function AddRemedyScreen() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    plant_name: '',
    ingredients: '',
    preparation_method: '',
    usage_instructions: '',
    benefits: '',
    cautions: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRemedy } = useRemedyStore();
  const router = useRouter();

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for the remedy');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }
    if (!formData.plant_name.trim()) {
      Alert.alert('Validation Error', 'Please enter the plant name');
      return;
    }
    if (!formData.ingredients.trim()) {
      Alert.alert('Validation Error', 'Please enter the ingredients');
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
      await addRemedy(formData);
      
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
    
    // Check if form has data
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    
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
              placeholder="e.g., Ginger Tea for Cold Relief"
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
              placeholder="e.g., Ginger"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              editable={!isSubmitting}
            />
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Description *</Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Brief description of what this remedy treats"
              className="border border-gray-300 rounded-lg px-4 py-4 text-gray-800 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Ingredients */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Ingredients *</Text>
            <TextInput
              value={formData.ingredients}
              onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
              placeholder="List all ingredients needed"
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

          {/* Benefits */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-lg text-gray-800 mb-2">Benefits (Optional)</Text>
            <TextInput
              value={formData.benefits}
              onChangeText={(text) => setFormData({ ...formData, benefits: text })}
              placeholder="Additional benefits of this remedy"
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
