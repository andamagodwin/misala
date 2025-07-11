import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRemedyStore } from '../store/remedyStore';

interface RemedyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const RemedyBottomSheet: React.FC<RemedyBottomSheetProps> = ({ isOpen, onClose, onSubmit }) => {
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
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        plant_name: '',
        ingredients: '',
        preparation_method: '',
        usage_instructions: '',
        benefits: '',
        cautions: '',
      });
      
      Alert.alert('Success', 'Remedy shared successfully!');
      onSubmit();
    } catch (error) {
      console.error('Error submitting remedy:', error);
      Alert.alert('Error', 'Failed to share remedy. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="bg-white rounded-t-3xl max-h-[90%]"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">Share a Remedy</Text>
            <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView className="flex-1 p-5">
            {/* Title */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Title *</Text>
              <TextInput
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="e.g., Ginger Tea for Cold Relief"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                editable={!isSubmitting}
              />
            </View>

            {/* Plant Name */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Plant Name *</Text>
              <TextInput
                value={formData.plant_name}
                onChangeText={(text) => setFormData({ ...formData, plant_name: text })}
                placeholder="e.g., Ginger"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                editable={!isSubmitting}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Description *</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Brief description of what this remedy treats"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Ingredients */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Ingredients *</Text>
              <TextInput
                value={formData.ingredients}
                onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
                placeholder="List all ingredients needed"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Preparation Method */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Preparation Method *</Text>
              <TextInput
                value={formData.preparation_method}
                onChangeText={(text) => setFormData({ ...formData, preparation_method: text })}
                placeholder="Step-by-step preparation instructions"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Usage Instructions */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Usage Instructions *</Text>
              <TextInput
                value={formData.usage_instructions}
                onChangeText={(text) => setFormData({ ...formData, usage_instructions: text })}
                placeholder="How to use this remedy"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Benefits */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Benefits (Optional)</Text>
              <TextInput
                value={formData.benefits}
                onChangeText={(text) => setFormData({ ...formData, benefits: text })}
                placeholder="Additional benefits of this remedy"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Cautions */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Cautions (Optional)</Text>
              <TextInput
                value={formData.cautions}
                onChangeText={(text) => setFormData({ ...formData, cautions: text })}
                placeholder="Any warnings or precautions"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`bg-primary py-4 rounded-lg flex-row items-center justify-center mb-4 ${
                isSubmitting ? 'opacity-50' : ''
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons name="send" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">Share Remedy</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Required Fields Note */}
            <Text className="text-gray-500 text-sm text-center mb-4">
              Fields marked with * are required
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
