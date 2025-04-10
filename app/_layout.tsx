import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/auth';
import { ThemeProvider } from '../context/theme';
import { useEffect, useCallback } from 'react';
import * as Font from 'expo-font';
import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { preventAutoHideAsync, hideAsync } from '../lib/splash-screen';

function RootLayoutNav() {
  const { onLayoutRootView, session, initialized } = useAuth();

  useEffect(() => {
    preventAutoHideAsync();
  }, []);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      }
    }

    loadFonts();
  }, []);

  useEffect(() => {
    console.log('session changed: ', session);
    if (initialized) {
      hideAsync();
    }
  }, [initialized, session]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Slot />
      <StatusBar style="auto" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
