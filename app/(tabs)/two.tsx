import { Stack } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useHistoryStore } from '../../store/historyStore';
import { useAuthStore } from '../../store/authStore';

export default function HistoryScreen() {
  const { history, isLoading, error, fetchHistory, deleteHistoryItem, clearHistory } = useHistoryStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const handleDeleteItem = (documentId: string, plantName: string) => {
    Alert.alert(
      'Delete History Item',
      `Are you sure you want to delete "${plantName}" from your history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteHistoryItem(documentId)
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all your plant identification history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearHistory
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: 'History' }} />
        <View className="flex-1 justify-center items-center p-5 bg-white">
          <MaterialIcons name="history" size={80} color="#ccc" />
          <Text className="text-xl font-semibold text-gray-600 mt-4">Please login to view your history</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="p-5 pb-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">Plant History</Text>
            {history.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-gray-600 mt-1">
            {history.length} identification{history.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mx-5 mb-3 p-3 bg-red-100 border border-red-300 rounded-lg">
            <Text className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && history.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#008000" />
            <Text className="text-gray-600 mt-4">Loading your history...</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && history.length === 0 && (
          <View className="flex-1 justify-center items-center p-5">
            <MaterialIcons name="history" size={80} color="#ccc" />
            <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
              No plant identifications yet
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Start identifying plants to see your history here
            </Text>



          </View>
        )}

        {/* History List */}
        {history.length > 0 && (
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="p-5 pt-0">
              {history.map((item, index) => (
                <View key={item.$id} className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <View className="p-4">
                    <View className="flex-row">
                      {/* Plant Image */}
                      <Image
                        source={{ uri: item.image_url }}
                        className="w-20 h-20 rounded-lg mr-4"
                        resizeMode="cover"
                      />
                      
                      {/* Plant Details */}
                      <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-2">
                          <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">
                            {item.plant_name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteItem(item.$id, item.plant_name)}
                            className="p-1"
                          >
                            <MaterialIcons name="delete" size={20} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                        
                        <View className="flex-row items-center mb-2">
                          <Text className="text-gray-600 font-medium">Confidence: </Text>
                          <Text className={`font-bold ${getConfidenceColor(item.confidence)}`}>
                            {item.confidence}%
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <MaterialIcons name="schedule" size={16} color="#6b7280" />
                          <Text className="text-sm text-gray-500 ml-1">
                            {formatDate(item.created_at)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Confidence Badge */}
                    <View className="mt-3 pt-3 border-t border-gray-100">
                      <View className="flex-row items-center">
                        <View className={`px-2 py-1 rounded-full ${
                          item.confidence >= 80 ? 'bg-green-100' : 
                          item.confidence >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Text className={`text-xs font-medium ${
                            item.confidence >= 80 ? 'text-green-800' : 
                            item.confidence >= 60 ? 'text-yellow-800' : 'text-red-800'
                          }`}>
                            {item.confidence >= 80 ? 'High Confidence' : 
                             item.confidence >= 60 ? 'Medium Confidence' : 'Low Confidence'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}
