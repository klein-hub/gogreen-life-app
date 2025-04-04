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
import Animated, { FadeIn } from 'react-native-reanimated';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 768;
  const containerWidth = isSmallScreen ? '100%' : Math.min(480, width * 0.9);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await signUp(email, password);
      router.replace('/(tabs)/');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?q=80&w=2070&auto=format&fit=crop',
      }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
                Join us and start your eco-friendly journey today
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
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ paddingRight: 16 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
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
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text
                  style={{
                    color: '#00241B',
                    fontWeight: '600',
                    fontSize: isSmallScreen ? 16 : 18,
                  }}
                >
                  {isLoading ? 'Creating account...' : 'SIGN UP'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: isSmallScreen ? 24 : 32,
                gap: 8,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: isSmallScreen ? 14 : 16,
                }}
              >
                Already have an account?
              </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text
                    style={{
                      color: '#00B288',
                      fontWeight: '600',
                      fontSize: isSmallScreen ? 14 : 16,
                    }}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
