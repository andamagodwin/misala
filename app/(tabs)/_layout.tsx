import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { CustomHeader } from '../../components/CustomHeader';
import { ProfileHeader } from '../../components/ProfileHeader';
import { useAuthStore } from '../../store/authStore';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      // If user is not authenticated, redirect to login
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  // Don't render tabs if user is not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#008000',
        tabBarInactiveTintColor: '#000',
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          marginBottom: 4,
          fontFamily: 'Poppins-Medium',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          height: 95,
        },
        headerStyle: {
          backgroundColor: '#008000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'Poppins-Bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('identify'),
          tabBarLabel: t('identify'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={22} color={color} />
          ),
          headerLeft: () => <ProfileHeader />,
          headerRight: () => <CustomHeader />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t('community'),
          tabBarLabel: t('community'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} />
          ),
          headerLeft: () => <ProfileHeader />,
          headerRight: () => <CustomHeader />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: t('history'),
          tabBarLabel: t('history'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={22} color={color} />
          ),
          headerLeft: () => <ProfileHeader />,
          headerRight: () => <CustomHeader />,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: t('blogs'),
          tabBarLabel: t('conservation'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "leaf" : "leaf-outline"} size={22} color={color} />
          ),
          headerLeft: () => <ProfileHeader />,
          headerRight: () => <CustomHeader />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
