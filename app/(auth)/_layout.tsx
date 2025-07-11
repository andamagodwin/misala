import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
