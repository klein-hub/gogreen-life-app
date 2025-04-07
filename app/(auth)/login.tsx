import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from '../../components/SplashScreen';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function Login() {
  const [email, setEmail] = useState('demo@gogreen.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { signIn } = useAuth();
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 768;
  const containerWidth = isSmallScreen ? '100%' : Math.min(480, width * 0.9);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {showSplash ? (
          <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
        ) : (
          <Animated.ScrollView
            entering={FadeIn.duration(800)}
            contentContainerStyle={{
              flexGrow: 1,
              padding: isSmallScreen ? 24 : 40,
              backgroundColor: 'rgba(0, 36, 27, 0.85)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ width: containerWidth, maxWidth: '100%' }}>
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: isSmallScreen ? 32 : 48,
                }}
              >
                <Text
                  style={{
                    fontSize: isSmallScreen ? 40 : 48,
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: 16,
                    textAlign: 'center',
                  }}
                >
                  PLANTS
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: isSmallScreen ? 16 : 18,
                    textAlign: 'center',
                    maxWidth: 300,
                  }}
                >
                  We help you to live feel free life from stress
                </Text>
              </View>

              {error && (
                <View
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ color: '#EF4444', textAlign: 'center' }}>
                    {error}
                  </Text>
                </View>
              )}

              <View style={{ gap: 16 }}>
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <TextInput
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: isSmallScreen ? 14 : 16,
                      color: 'white',
                      fontSize: isSmallScreen ? 16 : 18,
                    }}
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>

                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      paddingHorizontal: 16,
                      paddingVertical: isSmallScreen ? 14 : 16,
                      color: 'white',
                      fontSize: isSmallScreen ? 16 : 18,
                    }}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ paddingRight: 16 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    paddingVertical: isSmallScreen ? 14 : 16,
                    alignItems: 'center',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text
                    style={{
                      color: '#00241B',
                      fontWeight: '600',
                      fontSize: isSmallScreen ? 16 : 18,
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'SIGN IN'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Link href="/register" asChild>
                <TouchableOpacity
                  style={{ marginTop: isSmallScreen ? 24 : 32 }}
                >
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'center',
                      fontSize: isSmallScreen ? 14 : 16,
                    }}
                  >
                    New Account?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.ScrollView>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
