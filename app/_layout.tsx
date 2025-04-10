import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/auth';
import { ThemeProvider } from '../context/theme';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import { View, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const useFonts = () => {
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          ...require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      }
    };

    loadFonts();
  }, []);
};

const RootLayoutNav = () => {
  const { isLoading, session } = useAuth();

  useFonts();

  if (isLoading) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={session ? '(tabs)' : '(auth)'} />
      </Stack>
    </SafeAreaView>
  );
};

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
