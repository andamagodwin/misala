import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';

export default function TermsConditions() {
  const [accepted, setAccepted] = useState(false);
  const { updateUserTermsAcceptance } = useAuthStore();

  const handleAccept = async () => {
    if (!accepted) {
      Alert.alert(
        'Accept Terms',
        'Please check the box to accept the Terms and Conditions before proceeding.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Update user preferences to mark terms as accepted
      await updateUserTermsAcceptance(true);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error accepting terms:', error);
      Alert.alert(
        'Error',
        'Failed to save your acceptance. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDecline = () => {
    Alert.alert(
      'Terms Required',
      'You must accept the Terms and Conditions to use this app. Would you like to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor='#008000' style="dark" />
      
      {/* Header */}
      <View className="px-6 py-4 pt-10 border-b border-gray-200 bg-primary">
        <Text className="text-2xl text-center text-white" style={{ fontFamily: 'Poppins-Bold' }}>
          Terms & Conditions
        </Text>
        <Text className="text-center text-white mt-1" style={{ fontFamily: 'Poppins-Regular' }}>
          Please read and accept to continue
        </Text>
      </View>

      {/* Terms Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <Text className="text-lg mb-4 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
          Terms and Conditions of Use
        </Text>

        <Text className="text-sm mb-4 text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            1. Acceptance of Terms
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            By downloading, installing, or using this plant identification application (&quot;App&quot;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the App.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            2. Description of Service
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            This App provides plant identification services using machine learning technology. Users can upload images of plants to receive identification suggestions and access plant care information.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            3. Accuracy Disclaimer
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            Plant identification results are provided for informational purposes only. We do not guarantee the accuracy of identifications. Users should verify plant identifications through additional sources before making decisions about plant care, consumption, or handling.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            4. User Content and Privacy
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            Images you upload may be used to improve our identification algorithms. We respect your privacy and will not share your personal information with third parties without your consent. Please review our Privacy Policy for more details.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            5. Prohibited Uses
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            You agree not to use the App for any unlawful purpose or in any way that could damage, disable, or impair the service. This includes attempting to gain unauthorized access to our systems or uploading malicious content.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            6. Limitation of Liability
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the App, including but not limited to damages from incorrect plant identifications.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            7. Updates and Modifications
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            We reserve the right to modify these Terms and Conditions at any time. Users will be notified of significant changes through the App. Continued use after modifications constitutes acceptance of the updated terms.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-base mb-3 text-gray-800" style={{ fontFamily: 'Poppins-SemiBold' }}>
            8. Contact Information
          </Text>
          <Text className="text-sm mb-4 text-gray-700 leading-5" style={{ fontFamily: 'Poppins-Regular' }}>
            If you have any questions about these Terms and Conditions, please contact us through the App&apos;s support section or email us at support@plantapp.com.
          </Text>
        </View>

        {/* Extra spacing for scroll */}
        <View className="h-20" />
      </ScrollView>

      {/* Acceptance Section */}
      <View className="px-6 py-4 pb-20 border-t border-gray-200 bg-white">
        {/* Acceptance Checkbox */}
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setAccepted(!accepted)}
        >
          <View className={`w-6 h-6 border-2 rounded mr-3 items-center justify-center ${
            accepted ? 'bg-green-600 border-green-600' : 'border-gray-400'
          }`}>
            {accepted && (
              <MaterialIcons name="check" size={16} color="white" />
            )}
          </View>
          <Text className="flex-1 text-sm text-gray-700" style={{ fontFamily: 'Poppins-Regular' }}>
            I have read and agree to the Terms and Conditions
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 py-3 mr-4 rounded-lg border border-gray-300"
            onPress={handleDecline}
          >
            <Text className="text-center text-gray-700" style={{ fontFamily: 'Poppins-SemiBold' }}>
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${
              accepted ? 'bg-green-600' : 'bg-gray-300'
            }`}
            onPress={handleAccept}
            disabled={!accepted}
          >
            <Text className={`text-center ${
              accepted ? 'text-white' : 'text-gray-500'
            }`} style={{ fontFamily: 'Poppins-SemiBold' }}>
              Accept & Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}