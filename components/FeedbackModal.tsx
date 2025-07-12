import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFeedbackStore } from '../store/feedbackStore';
import { useAuthStore } from '../store/authStore';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  predictionResult: {
    class: string;
    confidence: number;
  };
  imageUri: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  predictionResult,
  imageUri,
}) => {
  const { submitFeedback, isSubmitting, error, clearError } = useFeedbackStore();
  const { user } = useAuthStore();
  
  const [feedbackType, setFeedbackType] = useState<'incorrect' | 'partially_correct' | 'missing_info' | null>(null);
  const [suggestedName, setSuggestedName] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to submit feedback');
      return;
    }

    if (!feedbackType) {
      Alert.alert('Error', 'Please select a feedback type');
      return;
    }

    if (feedbackType === 'incorrect' && !suggestedName.trim()) {
      Alert.alert('Error', 'Please provide the correct plant name');
      return;
    }

    const success = await submitFeedback({
      user_id: user.$id,
      user_name: user.name || 'Anonymous',
      predicted_class: predictionResult.class,
      confidence_score: predictionResult.confidence,
      image_uri: imageUri,
      feedback_type: feedbackType,
      suggested_correct_name: suggestedName.trim() || undefined,
      additional_comments: comments.trim() || undefined,
    });

    if (success) {
      Alert.alert('Thank You!', 'Your feedback has been submitted and will help us improve our predictions.');
      resetForm();
      onClose();
    } else if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  };

  const resetForm = () => {
    setFeedbackType(null);
    setSuggestedName('');
    setComments('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const feedbackOptions = [
    {
      type: 'incorrect' as const,
      title: 'Incorrect Prediction',
      description: 'The predicted plant is completely wrong',
      icon: 'error' as const,
      color: '#ef4444',
    },
    {
      type: 'partially_correct' as const,
      title: 'Partially Correct',
      description: 'Close but not quite right',
      icon: 'warning' as const,
      color: '#f59e0b',
    },
    {
      type: 'missing_info' as const,
      title: 'Missing Information',
      description: 'Prediction is correct but lacks details',
      icon: 'info' as const,
      color: '#3b82f6',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-5 py-4 border-b border-gray-200 flex-row items-center justify-between">
          <View className="flex-1">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-800">
              Report Prediction Issue
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm">
              Help us improve our plant identification
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-5">
          {/* Current Prediction Info */}
          <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
              Current Prediction:
            </Text>
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-primary">
                {predictionResult.class}
              </Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600">
                {predictionResult.confidence}% confidence
              </Text>
            </View>
          </View>

          {/* Feedback Type Selection */}
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-3">
            What&apos;s the issue?
          </Text>
          
          {feedbackOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => setFeedbackType(option.type)}
              className={`bg-white rounded-lg p-4 mb-3 border-2 flex-row items-center ${
                feedbackType === option.type 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200'
              }`}
            >
              <MaterialIcons 
                name={option.icon} 
                size={24} 
                color={feedbackType === option.type ? '#008000' : option.color} 
              />
              <View className="flex-1 ml-3">
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800">
                  {option.title}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm">
                  {option.description}
                </Text>
              </View>
              {feedbackType === option.type && (
                <MaterialIcons name="check-circle" size={20} color="#008000" />
              )}
            </TouchableOpacity>
          ))}

          {/* Suggested Correct Name (only for incorrect predictions) */}
          {feedbackType === 'incorrect' && (
            <View className="mb-6">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                What is the correct plant name? *
              </Text>
              <TextInput
                value={suggestedName}
                onChangeText={setSuggestedName}
                placeholder="Enter the correct plant name"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3"
                style={{ fontFamily: 'Poppins-Regular' }}
              />
            </View>
          )}

          {/* Additional Comments */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
              Additional Comments (Optional)
            </Text>
            <TextInput
              value={comments}
              onChangeText={setComments}
              placeholder="Any additional details that might help..."
              multiline
              numberOfLines={4}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              style={{ fontFamily: 'Poppins-Regular', textAlignVertical: 'top' }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting || !feedbackType}
            className={`bg-primary rounded-lg p-4 flex-row items-center justify-center ${
              isSubmitting || !feedbackType ? 'opacity-50' : ''
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="send" size={20} color="white" />
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white ml-2">
                  Submit Feedback
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Note */}
          <View className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-200">
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-blue-800 text-sm leading-5">
              💡 Your feedback helps us improve our plant identification system. 
              All submissions are reviewed by our team to enhance future predictions.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
