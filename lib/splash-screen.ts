// lib/splash-screen.ts
import * as SplashScreen from 'expo-splash-screen';

export async function preventAutoHideAsync() {
  try {
    await SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.warn(e);
  }
}

export async function hideAsync() {
  try {
    await SplashScreen.hideAsync();
  } catch (e) {
    console.warn(e);
  }
}
