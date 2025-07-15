import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRemedyStore } from '../../store/remedyStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { UserType } from '../../lib/userProfileConfig';

export default function CommunityScreen() {
  const { t } = useTranslation();
  const { remedies, isLoading, error, fetchRemedies, verifyRemedy, unverifyRemedy } = useRemedyStore();
  const { user, userProfile, initialize } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
  const router = useRouter();

  // Debug logging
  useEffect(() => {
    console.log('Community Screen - User:', user?.$id);
    console.log('Community Screen - UserProfile:', userProfile);
    console.log('Community Screen - UserType:', userProfile?.user_type);
    console.log('Community Screen - Full Name:', userProfile?.full_name);
  }, [user, userProfile]);

  useEffect(() => {
    fetchRemedies();
  }, [fetchRemedies]);

  // Ensure user profile is loaded
  useEffect(() => {
    if (user && !userProfile) {
      console.log('User found but no profile, reinitializing auth...');
      initialize();
    }
  }, [user, userProfile, initialize]);

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
      Alert.alert(t('communityScreen.authRequired'), t('communityScreen.loginToSubmit'));
      return;
    }
    router.push('../add-remedy');
  };

  const handleVerifyRemedy = async (remedyId: string) => {
    if (!user || !userProfile) return;
    
    console.log('Verifying remedy with user profile:', {
      userId: user.$id,
      userProfileName: userProfile.full_name,
      userProfile: userProfile
    });
    
    Alert.alert(
      t('verify_remedy'),
      t('are_you_sure_verify'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('verify'),
          onPress: async () => {
            const verifierName = userProfile.full_name || userProfile.email || 'Unknown Herbalist';
            console.log('Using verifier name:', verifierName);
            await verifyRemedy(remedyId, user.$id, verifierName);
          },
        },
      ]
    );
  };

  const handleUnverifyRemedy = async (remedyId: string) => {
    if (!user || !userProfile) return;
    
    Alert.alert(
      t('unverify_remedy'),
      t('are_you_sure_unverify'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('unverify'),
          onPress: async () => {
            await unverifyRemedy(remedyId);
          },
        },
      ]
    );
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
    if (!name) return 'U'; // Return 'U' for Unknown if name is null or undefined
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
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">{t('communityScreen.title')}</Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-1">
                {remedies.length} {t('communityScreen.subtitle')}
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
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">{t('communityScreen.loading')}</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && remedies.length === 0 && (
          <View className="flex-1 justify-center items-center p-5">
            <MaterialIcons name="eco" size={80} color="#ccc" />
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-600 mt-4 text-center">
              {t('communityScreen.noRemedies')}
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 mt-2 text-center">
              {t('communityScreen.firstToShare')}
            </Text>
            <TouchableOpacity
              onPress={handleAddRemedy}
              className="bg-primary px-6 py-3 rounded-lg mt-4"
            >
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">{t('shareRemedy')}</Text>
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
                
                // Debug logging for remedy verification
                console.log('Remedy verification status:', {
                  remedyId: remedy.$id,
                  title: remedy.title,
                  common_name: remedy.common_name,
                  scientific_name: remedy.scientific_name,
                  local_name: remedy.local_name,
                  preparation_method: remedy.preparation_method,
                  usage_instructions: remedy.usage_instructions,
                  ailments_treated: remedy.ailments_treated,
                  cautions: remedy.cautions,
                  verified: remedy.verified,
                  verified_by_name: remedy.verified_by_name,
                  verified_by_id: remedy.verified_by_id,
                  verified_at: remedy.verified_at
                });
                
                return (
                  <View key={remedy.$id} className="mb-6 bg-white rounded-xl shadow-lg">
                    {/* Header */}
                    <View className="p-4 border-b border-gray-100">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
                            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-sm">
                              {getInitials(remedy.author_name || 'Unknown')}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800">
                              {remedy.author_name || 'Unknown Author'}
                            </Text>
                            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm">
                              {formatDate(remedy.created_at)}
                            </Text>
                          </View>
                        </View>
                        <View className="items-end">
                          <View className="bg-green-100 px-3 py-1 rounded-full mb-2">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-green-800 text-xs">
                              {remedy.plant_name || 'Unknown Plant'}
                            </Text>
                          </View>
                          {/* Verification Badge */}
                          {remedy.verified && remedy.verified_by_name ? (
                            <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
                              <MaterialIcons name="verified" size={12} color="#008000" />
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-green-600 text-xs ml-1">
                                {t('verified_by')} {remedy.verified_by_name}
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center bg-orange-50 px-2 py-1 rounded-full">
                              <MaterialIcons name="warning" size={12} color="#f59e0b" />
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-orange-600 text-xs ml-1">
                                {t('unverified')}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Content */}
                    <View className="p-4">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 mb-2">
                        {remedy.title || 'Untitled Remedy'}
                      </Text>
                      <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-4 leading-6">
                        {remedy.common_name || 'N/A'}
                      </Text>

                      {/* Collapsed view - only show scientific name */}
                      {!isExpanded && (
                        <View className="mb-4">
                          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                            {t('communityScreen.sections.scientificName')}:
                          </Text>
                          <View className="bg-gray-50 rounded-lg p-3">
                            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700" numberOfLines={2}>
                              {remedy.scientific_name || 'N/A'}
                            </Text>
                            {remedy.scientific_name && remedy.scientific_name.length > 50 && (
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-xs mt-1">
                                {t('communityScreen.tapViewMore')}
                              </Text>
                            )}
                          </View>
                        </View>
                      )}

                      {/* Expanded view - show all details */}
                      {isExpanded && (
                        <>
                          {/* Scientific Name */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              {t('communityScreen.sections.scientificName')}:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.scientific_name || 'N/A'}
                              </Text>
                            </View>
                          </View>

                          {/* Local Name */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              {t('communityScreen.sections.localName')}:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.local_name || 'N/A'}
                              </Text>
                            </View>
                          </View>

                          {/* Preparation Method */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              {t('communityScreen.sections.preparationMethod')}:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.preparation_method || 'N/A'}
                              </Text>
                            </View>
                          </View>

                          {/* Usage Instructions */}
                          <View className="mb-4">
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                              {t('communityScreen.sections.howToUse')}:
                            </Text>
                            <View className="bg-gray-50 rounded-lg p-3">
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-700">
                                {remedy.usage_instructions || 'N/A'}
                              </Text>
                            </View>
                          </View>

                          {/* Ailments Treated */}
                          {remedy.ailments_treated && (
                            <View className="mb-4">
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                                {t('communityScreen.sections.ailmentsTreated')}:
                              </Text>
                              <View className="bg-blue-50 rounded-lg p-3">
                                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-blue-700">
                                  {remedy.ailments_treated}
                                </Text>
                              </View>
                            </View>
                          )}

                          {/* Cautions */}
                          {remedy.cautions && (
                            <View className="mb-4">
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 mb-2">
                                {t('communityScreen.sections.cautions')}:
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
                          {isExpanded ? t('communityScreen.viewLess') : t('communityScreen.viewMore')}
                        </Text>
                        <MaterialIcons 
                          name={isExpanded ? 'expand-less' : 'expand-more'} 
                          size={20} 
                          color="#008000" 
                        />
                      </TouchableOpacity>

                      {/* Verification Buttons - Only for Herbalists */}
                      {userProfile?.user_type === UserType.HERBALIST && (
                        <View className="flex-row gap-2">
                          {!remedy.verified ? (
                            <TouchableOpacity
                              onPress={() => handleVerifyRemedy(remedy.$id)}
                              className="flex-1 bg-green-500 flex-row items-center justify-center p-3 rounded-lg"
                            >
                              <MaterialIcons name="verified" size={16} color="#fff" />
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white ml-2">
                                {t('verify')}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => handleUnverifyRemedy(remedy.$id)}
                              className="flex-1 bg-red-500 flex-row items-center justify-center p-3 rounded-lg"
                            >
                              <MaterialIcons name="cancel" size={16} color="#fff" />
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white ml-2">
                                {t('unverify')}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
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
