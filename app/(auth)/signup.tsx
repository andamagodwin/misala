import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { account } from '../../lib/appwriteConfig';
import { useAuthStore } from '../../store/authStore';
import { useUserProfileStore } from '../../store/userProfileStore';
import { UserType } from '../../lib/userProfileConfig';
import { ID } from 'react-native-appwrite';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignupScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.NORMAL);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { createProfile } = useUserProfileStore();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t('error'), t('fill_all_fields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('error'), t('passwords_do_not_match'));
      return;
    }

    if (password.length < 8) {
      Alert.alert(t('error'), t('password_min_length'));
      return;
    }

    // Additional validation for herbalists
    if (userType === UserType.HERBALIST) {
      if (!phone || !location || !bio) {
        Alert.alert(t('error'), t('herbalist_fields_required'));
        return;
      }
      if (bio.length < 50) {
        Alert.alert(t('error'), t('bio_min_length'));
        return;
      }
    }

    setLoading(true);
    console.log('Attempting signup with email:', email);

    try {
      // Create user account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      console.log('Account created:', user);

      // Create email session (auto login after signup)
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);

      // Get user details
      const userDetails = await account.get();
      console.log('User details:', userDetails);

      // Create user profile
      const profileData = {
        user_id: userDetails.$id,
        user_type: userType,
        full_name: name,
        email: email,
        phone: phone || undefined,
        location: location || undefined,
        bio: bio || undefined,
        experience_years: experienceYears ? parseInt(experienceYears) : undefined,
        specializations: specializations ? specializations.split(',').map(s => s.trim()) : undefined,
      };

      await createProfile(profileData);

      // Update auth store
      setAuth(userDetails);

      Alert.alert(t('success'), t('account_created_successfully'), [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);

    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = t('signup_failed');
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 409) {
        errorMessage = t('account_already_exists');
      }
      
      Alert.alert(t('signup_error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-5 bg-white">
        {/* Language Switcher */}
        <View className="absolute top-5 right-5 z-10">
          <LanguageSwitcher />
        </View>

        {/* Signup Image */}
        <View className="items-center mb-6 mt-16">
          <Image 
            source={require('../../assets/signup.png')} 
            className="w-48 h-48"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold text-center mb-3 text-gray-800" style={{ fontFamily: 'Poppins-Bold' }}>{t('hello_register')}</Text>
        <Text className="text-base text-center mb-8 text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>{t('sign_up_to_get_started')}</Text>

        <View className="space-y-4 flex-col justify-center gap-4">
          {/* User Type Selection */}
          <View className="mb-4">
            <Text className="text-base font-semibold mb-3 text-gray-700" style={{ fontFamily: 'Poppins-SemiBold' }}>
              {t('user_type')}
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setUserType(UserType.NORMAL)}
                className={`flex-1 p-4 rounded-lg border-2 flex-row items-center justify-center ${
                  userType === UserType.NORMAL ? 'border-primary bg-primary/10' : 'border-gray-300'
                }`}
              >
                <MaterialIcons 
                  name="person" 
                  size={20} 
                  color={userType === UserType.NORMAL ? '#008000' : '#6b7280'} 
                />
                <Text 
                  className={`ml-2 ${userType === UserType.NORMAL ? 'text-primary' : 'text-gray-600'}`}
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  {t('normal_user')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setUserType(UserType.HERBALIST)}
                className={`flex-1 p-4 rounded-lg border-2 flex-row items-center justify-center ${
                  userType === UserType.HERBALIST ? 'border-primary bg-primary/10' : 'border-gray-300'
                }`}
              >
                <MaterialIcons 
                  name="local-florist" 
                  size={20} 
                  color={userType === UserType.HERBALIST ? '#008000' : '#6b7280'} 
                />
                <Text 
                  className={`ml-2 ${userType === UserType.HERBALIST ? 'text-primary' : 'text-gray-600'}`}
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  {t('herbalist')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            className="border border-black p-4 rounded-lg text-base bg-white"
            placeholder={t('full_name')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={{ fontFamily: 'Poppins-Regular' }}
          />

          <TextInput
            className="border border-black p-4 rounded-lg text-base bg-white"
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ fontFamily: 'Poppins-Regular' }}
          />

          {/* Additional fields for herbalists */}
          {userType === UserType.HERBALIST && (
            <>
              <TextInput
                className="border border-black p-4 rounded-lg text-base bg-white"
                placeholder={`${t('phone')} *`}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ fontFamily: 'Poppins-Regular' }}
              />

              <TextInput
                className="border border-black p-4 rounded-lg text-base bg-white"
                placeholder={`${t('location')} *`}
                value={location}
                onChangeText={setLocation}
                style={{ fontFamily: 'Poppins-Regular' }}
              />

              <TextInput
                className="border border-black p-4 rounded-lg text-base bg-white"
                placeholder={`${t('bio')} * (${t('min_50_chars')})`}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ fontFamily: 'Poppins-Regular', height: 80 }}
              />

              <TextInput
                className="border border-black p-4 rounded-lg text-base bg-white"
                placeholder={t('experience_years')}
                value={experienceYears}
                onChangeText={setExperienceYears}
                keyboardType="numeric"
                style={{ fontFamily: 'Poppins-Regular' }}
              />

              <TextInput
                className="border border-black p-4 rounded-lg text-base bg-white"
                placeholder={t('specializations_placeholder')}
                value={specializations}
                onChangeText={setSpecializations}
                style={{ fontFamily: 'Poppins-Regular' }}
              />
            </>
          )}

          <TextInput
            className="border border-black p-4 rounded-lg text-base bg-white"
            placeholder={t('password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            style={{ fontFamily: 'Poppins-Regular' }}
          />

          <TextInput
            className="border border-black p-4 rounded-lg text-base bg-white"
            placeholder={t('confirm_password')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            style={{ fontFamily: 'Poppins-Regular' }}
          />

          {userType === UserType.HERBALIST && (
            <View className="bg-blue-50 p-4 rounded-lg">
              <Text className="text-sm text-blue-800 mb-2" style={{ fontFamily: 'Poppins-Medium' }}>
                {t('herbalist_verification_note')}
              </Text>
              <Text className="text-xs text-blue-600" style={{ fontFamily: 'Poppins-Regular' }}>
                {t('herbalist_verification_description')}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            className={`bg-primary p-4 rounded-lg items-center ${loading ? 'opacity-50' : ''}`}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>{t('create_account')}</Text>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/login" className="items-center mt-4">
            <Text className="text-primary text-base" style={{ fontFamily: 'Poppins-Regular' }}>{t('already_have_account')}</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
