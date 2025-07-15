import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useUserProfileStore } from '../store/userProfileStore';
import UserProfileCard from '../components/UserProfileCard';
import { UserProfileDocument } from '../lib/userProfileConfig';

export default function HerbalistDirectoryScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'verified'>('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  const { 
    herbalists, 
    isLoading, 
    error, 
    fetchHerbalists, 
    fetchVerifiedHerbalists,
    searchHerbalistsBySpecialization,
    clearError 
  } = useUserProfileStore();

  useEffect(() => {
    if (filterType === 'verified') {
      fetchVerifiedHerbalists();
    } else {
      fetchHerbalists();
    }
  }, [filterType, fetchHerbalists, fetchVerifiedHerbalists]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('error'), error);
      clearError();
    }
  }, [error, clearError, t]);

  const handleSearch = () => {
    if (selectedSpecialization) {
      searchHerbalistsBySpecialization(selectedSpecialization);
    } else if (filterType === 'verified') {
      fetchVerifiedHerbalists();
    } else {
      fetchHerbalists();
    }
  };

  const filteredHerbalists = herbalists.filter(herbalist => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      herbalist.full_name.toLowerCase().includes(searchLower) ||
      herbalist.location?.toLowerCase().includes(searchLower) ||
      herbalist.bio?.toLowerCase().includes(searchLower) ||
      herbalist.specializations?.some(spec => spec.toLowerCase().includes(searchLower))
    );
  });

  const commonSpecializations = [
    'Traditional Medicine',
    'Herbal Remedies',
    'Digestive Health',
    'Skin Care',
    'Pain Relief',
    'Respiratory Health',
    'Mental Health',
    'Women\'s Health',
    'Children\'s Health',
    'Immune Support'
  ];

  const handleProfilePress = (profile: UserProfileDocument) => {
    // Navigate to profile detail or show contact options
    Alert.alert(
      profile.full_name,
      `${t('contact_herbalist')}:\n${profile.phone || t('no_phone_available')}`,
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('ok'), onPress: () => console.log('Contact herbalist') }
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('herbalist_directory'),
          headerStyle: { backgroundColor: '#008000' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: 'Poppins-Bold' }
        }} 
      />
      
      <View className="flex-1 bg-gray-50">
        {/* Search Header */}
        <View className="bg-white p-4 border-b border-gray-200">
          {/* Search Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
            <MaterialIcons name="search" size={20} color="#6b7280" />
            <TextInput
              placeholder={t('search_herbalists')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="clear" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Buttons */}
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              onPress={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full ${
                filterType === 'all' ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <Text
                style={{ fontFamily: 'Poppins-Medium' }}
                className={`text-sm ${filterType === 'all' ? 'text-white' : 'text-gray-700'}`}
              >
                {t('all_herbalists')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setFilterType('verified')}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                filterType === 'verified' ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <MaterialIcons 
                name="verified" 
                size={16} 
                color={filterType === 'verified' ? '#fff' : '#6b7280'} 
              />
              <Text
                style={{ fontFamily: 'Poppins-Medium' }}
                className={`text-sm ml-1 ${filterType === 'verified' ? 'text-white' : 'text-gray-700'}`}
              >
                {t('verified_only')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Specialization Filter */}
          <View>
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
              {t('filter_by_specialization')}:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedSpecialization('');
                  handleSearch();
                }}
                className={`mr-2 px-3 py-2 rounded-full ${
                  selectedSpecialization === '' ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Poppins-Medium' }}
                  className={`text-sm ${selectedSpecialization === '' ? 'text-white' : 'text-gray-700'}`}
                >
                  {t('all')}
                </Text>
              </TouchableOpacity>
              
              {commonSpecializations.map((spec) => (
                <TouchableOpacity
                  key={spec}
                  onPress={() => {
                    setSelectedSpecialization(spec);
                    searchHerbalistsBySpecialization(spec);
                  }}
                  className={`mr-2 px-3 py-2 rounded-full ${
                    selectedSpecialization === spec ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <Text
                    style={{ fontFamily: 'Poppins-Medium' }}
                    className={`text-sm ${selectedSpecialization === spec ? 'text-white' : 'text-gray-700'}`}
                  >
                    {spec}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Results */}
        <ScrollView className="flex-1 p-4">
          {isLoading && (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#008000" />
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">
                {t('loading_herbalists')}
              </Text>
            </View>
          )}

          {!isLoading && filteredHerbalists.length === 0 && (
            <View className="flex-1 justify-center items-center py-20">
              <MaterialIcons name="search-off" size={64} color="#9ca3af" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-gray-500 text-xl mt-4">
                {t('no_herbalists_found')}
              </Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-400 text-center mt-2">
                {t('try_different_search')}
              </Text>
            </View>
          )}

          {!isLoading && filteredHerbalists.map((herbalist) => (
            <UserProfileCard
              key={herbalist.$id}
              profile={herbalist}
              onPress={() => handleProfilePress(herbalist)}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}
