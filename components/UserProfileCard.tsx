import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { UserProfileDocument, UserType } from '../lib/userProfileConfig';

interface UserProfileCardProps {
  profile: UserProfileDocument;
  isOwnProfile?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
}

export default function UserProfileCard({ 
  profile, 
  isOwnProfile = false, 
  onPress, 
  onEdit 
}: UserProfileCardProps) {
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-lg overflow-hidden mb-4"
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg">
                {getInitials(profile.full_name)}
              </Text>
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800">
                {profile.full_name}
              </Text>
              <View className="flex-row items-center">
                <MaterialIcons 
                  name={profile.user_type === UserType.HERBALIST ? "local-florist" : "person"} 
                  size={16} 
                  color={profile.user_type === UserType.HERBALIST ? "#008000" : "#6b7280"} 
                />
                <Text 
                  style={{ fontFamily: 'Poppins-Medium' }} 
                  className={`ml-1 text-sm ${
                    profile.user_type === UserType.HERBALIST ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {profile.user_type === UserType.HERBALIST ? t('herbalist') : t('normal_user')}
                </Text>
                {profile.user_type === UserType.HERBALIST && profile.verified && (
                  <View className="ml-2 flex-row items-center">
                    <MaterialIcons name="verified" size={16} color="#008000" />
                    <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-green-600 text-xs ml-1">
                      {t('verified')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {isOwnProfile && onEdit && (
            <TouchableOpacity onPress={onEdit} className="p-2">
              <MaterialIcons name="edit" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Bio */}
        {profile.bio && (
          <View className="mb-3">
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm">
              {profile.bio}
            </Text>
          </View>
        )}

        {/* Location */}
        {profile.location && (
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="location-on" size={16} color="#6b7280" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm ml-1">
              {profile.location}
            </Text>
          </View>
        )}

        {/* Experience (for herbalists) */}
        {profile.user_type === UserType.HERBALIST && profile.experience_years && (
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="star" size={16} color="#6b7280" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm ml-1">
              {profile.experience_years} {t('years_experience')}
            </Text>
          </View>
        )}

        {/* Specializations */}
        {profile.specializations && profile.specializations.length > 0 && (
          <View className="mb-3">
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 text-sm mb-1">
              {t('specializations')}:
            </Text>
            <View className="flex-row flex-wrap">
              {profile.specializations.map((spec, index) => (
                <View key={index} className="bg-green-100 px-2 py-1 rounded-md mr-2 mb-1">
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-green-800 text-xs">
                    {spec}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Info */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-200">
          <View className="flex-row items-center">
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-xs ml-1">
              {t('joined')} {formatDate(profile.created_at)}
            </Text>
          </View>
          
          {profile.phone && (
            <View className="flex-row items-center">
              <MaterialIcons name="phone" size={16} color="#6b7280" />
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm ml-1">
                {profile.phone}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
