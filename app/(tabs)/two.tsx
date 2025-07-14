import { Stack } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useHistoryStore } from '../../store/historyStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';

export default function HistoryScreen() {
  const { t } = useTranslation();
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
      t('deleteHistoryItem'),
      t('deleteConfirm', { plantName }),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('delete'), 
          style: 'destructive',
          onPress: () => deleteHistoryItem(documentId)
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      t('clearAllHistory'),
      t('clearAllConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('clearAll'), 
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
        <Stack.Screen options={{ title: t('history') }} />
        <View className="flex-1 justify-center items-center p-5 bg-white">
          <MaterialIcons name="history" size={80} color="#ccc" />
          <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-xl text-gray-600 mt-4">
            {t('loginToView')}
          </Text>
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
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">
              {t('plantHistory')}
            </Text>
            {history.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-white">
                  {t('clearAll')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-1">
            {history.length} {t('historyScreen.identifications', { count: history.length })}
          </Text>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mx-5 mb-3 p-3 bg-red-100 border border-red-300 rounded-lg">
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-red-700">{error}</Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && history.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#008000" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">
              {t('historyScreen.loading')}
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && history.length === 0 && (
          <View className="flex-1 justify-center items-center p-5">
            <Image 
              source={require('../../assets/time-flies.png')} 
              className="w-48 h-48 mb-4"
              resizeMode="contain"
            />
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-xl text-black mt-4 text-center">
              {t('historyScreen.emptyState.title')}
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 mt-2 text-center">
              {t('historyScreen.emptyState.message')}
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
                          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 flex-1 mr-2">
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
                          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-600">
                            {t('historyScreen.confidence')}: 
                          </Text>
                          <Text style={{ fontFamily: 'Poppins-Bold' }} className={`${getConfidenceColor(item.confidence)}`}>
                            {item.confidence}%
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <MaterialIcons name="schedule" size={16} color="#6b7280" />
                          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-sm text-gray-500 ml-1">
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
                          <Text style={{ fontFamily: 'Poppins-Medium' }} className={`text-xs ${
                            item.confidence >= 80 ? 'text-green-800' : 
                            item.confidence >= 60 ? 'text-yellow-800' : 'text-red-800'
                          }`}>
                            {item.confidence >= 80 ? t('historyScreen.highConfidence') : 
                             item.confidence >= 60 ? t('historyScreen.mediumConfidence') : t('historyScreen.lowConfidence')}
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
