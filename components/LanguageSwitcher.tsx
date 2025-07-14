import React from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../store/languageStore';
import { Ionicons } from '@expo/vector-icons';

interface LanguageSwitcherProps {
  variant?: 'default' | 'header';
}

export default function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguageStore();

  const showLanguageOptions = () => {
    Alert.alert(
      t('changeLanguage'),
      '',
      [
        {
          text: t('english'),
          onPress: () => changeLanguage('en'),
          style: currentLanguage === 'en' ? 'default' : 'default',
        },
        {
          text: t('kiswahili'),
          onPress: () => changeLanguage('sw'),
          style: currentLanguage === 'sw' ? 'default' : 'default',
        },
        {
          text: t('cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  if (variant === 'header') {
    return (
      <TouchableOpacity 
        onPress={showLanguageOptions}
        className="p-2"
      >
        <Ionicons name="language" size={24} color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={showLanguageOptions}
      className="flex-row items-center bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200"
    >
      <Text 
        className="text-gray-700 text-sm mr-2" 
        style={{ fontFamily: 'Poppins-Medium' }}
      >
        {t('language')}:
      </Text>
      <Text 
        className="text-green-600 text-sm" 
        style={{ fontFamily: 'Poppins-SemiBold' }}
      >
        {currentLanguage === 'en' ? t('english') : t('kiswahili')}
      </Text>
    </TouchableOpacity>
  );
}
