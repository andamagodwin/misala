import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRemedyStore } from '../../store/remedyStore';
import { useAuthStore } from '../../store/authStore';

export default function CommunityScreen() {
  const { remedies, isLoading, error, fetchRemedies } = useRemedyStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
  const router = useRouter();

  useEffect(() => {
    fetchRemedies();
  }, [fetchRemedies]);

  // Refresh when screen comes into focus (when returning from add remedy screen)
  useFocusEffect(
    useCallback(() => {
      fetchRemedies();
    }, [fetchRemedies])
  );

  const toggleCard = (remedyId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [remedyId]: !prev[remedyId]
    }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRemedies();
    setRefreshing(false);
  };

  const handleAddRemedy = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please login to submit a remedy');
      return;
    }
    router.push('../add-remedy');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white p-5 pb-3 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">Plant Remedies</Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-1">
                {remedies.length} remedies shared by the community
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAddRemedy}
              className="bg-primary p-3 rounded-full shadow-lg"
            >
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mx-5 mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && remedies.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#008000" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">Loading remedies...</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && remedies.length === 0 && (
          <View className="flex-1 justify-center items-center p-5">
            <MaterialIcons name="eco" size={80} color="#ccc" />
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-600 mt-4 text-center">
              No remedies shared yet
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 mt-2 text-center">
              Be the first to share a plant remedy with the community
            </Text>
            <TouchableOpacity
              onPress={handleAddRemedy}
              className="bg-primary px-6 py-3 rounded-lg mt-4"
            >
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">Share a Remedy</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Remedies List */}
        {remedies.length > 0 && (
          <ScrollView
            className="flex-1 bg-white"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="p-5">
              {remedies.map((remedy: any) => {
                const isExpanded = expandedCards[remedy.$id] || false;
                
                return (
                  <View key={remedy.$id} className="mb-6 bg-white rounded-xl shadow-lg">
                    {/* Header */}
                    <View className="p-4 border-b border-gray-100">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
                            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-sm">
                              {getInitials(remedy.author_name)}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800">
                              {remedy.author_name}
                            </Text>
                            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm">
                              {formatDate(remedy.created_at)}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-green-800 text-xs">
                            {remedy.plant_name}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Content */}
                    <View className="p-4">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 mb-2">
                        {remedy.title}
                      </Text>
                      <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-4 leading-6">
                        {remedy.description}
                      </Text>

                      {/* Collapsed view - only show ingredients */}
                      {!isExpanded && (
                        <View className="mb-4">
                          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                            Ingredients:
                          </Text>
                          <View className="bg-gray-50 rounded-lg p-3">
                            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700" numberOfLines={2}>
                              {remedy.ingredients}
                            </Text>
                            {remedy.ingredients.length > 100 && (
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-xs mt-1">
                                ... tap View More to see full details
                              </Text>
                            )}
                          </View>
                        </View>
                      )}

                      {/* Expanded view - show all details */}
                      {isExpanded && (
                        <>
                          {/* Ingredients */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              Ingredients:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.ingredients}
                              </Text>
                            </View>
                          </View>

                          {/* Preparation Method */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              Preparation Method:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.preparation_method}
                              </Text>
                            </View>
                          </View>

                          {/* Usage Instructions */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              How to Use:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.usage_instructions}
                              </Text>
                            </View>
                          </View>

                          {/* Benefits */}
                          {remedy.benefits && (
                            <View className="mb-4">
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                                Benefits:
                              </Text>
                              <View className="bg-blue-50 rounded-lg p-3">
                                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-blue-700">
                                  {remedy.benefits}
                                </Text>
                              </View>
                            </View>
                          )}

                          {/* Cautions */}
                          {remedy.cautions && (
                            <View className="mb-4">
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                                Cautions:
                              </Text>
                              <View className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-yellow-800">
                                  ⚠️ {remedy.cautions}
                                </Text>
                              </View>
                            </View>
                          )}
                        </>
                      )}

                      {/* View More/Less Button */}
                      <TouchableOpacity
                        onPress={() => toggleCard(remedy.$id)}
                        className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex-row items-center justify-center active:bg-primary/20"
                      >
                        <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-primary mr-2">
                          {isExpanded ? 'View Less' : 'View More'}
                        </Text>
                        <MaterialIcons 
                          name={isExpanded ? 'expand-less' : 'expand-more'} 
                          size={20} 
                          color="#008000" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}
