import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { account } from '../../lib/appwriteConfig';
import { useAuthStore } from '../../store/authStore';
import { ID } from 'react-native-appwrite';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function SignupScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

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
    <View className="flex-1 justify-center p-5 bg-white">
      {/* Language Switcher */}
      <View className="absolute top-5 right-5">
        <LanguageSwitcher />
      </View>

      {/* Signup Image */}
      <View className="items-center mb-6">
        <Image 
          source={require('../../assets/signup.png')} 
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>

      <Text className="text-3xl font-bold text-center mb-3 text-gray-800" style={{ fontFamily: 'Poppins-Bold' }}>{t('hello_register')}</Text>
      <Text className="text-base text-center mb-8 text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>{t('sign_up_to_get_started')}</Text>

      <View className="space-y-4 flex-col justify-center gap-4">
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
  );
}
