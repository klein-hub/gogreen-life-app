import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

type SplashScreenProps = {
  onAnimationComplete: () => void;
};

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 15 }),
      withSpring(1, { damping: 12 })
    );

    opacity.value = withTiming(1, { duration: 800 });

    // After the initial animation, start moving up and fading out
    setTimeout(() => {
      translateY.value = withTiming(-50, { duration: 500 });
      opacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onAnimationComplete)();
      });
    }, 2000);
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ]
    };
  });

  const leafStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      scale.value,
      [0, 1.2],
      [0, 360],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { rotateZ: `${rotateZ}deg` },
        { scale: scale.value }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, containerStyle]}>
        <Animated.View style={[styles.iconContainer, leafStyle]}>
          <Ionicons name="leaf" size={isSmallScreen ? 48 : 64} color="#00B288" />
        </Animated.View>
        <Text style={[
          styles.title,
          { fontSize: isSmallScreen ? 32 : 40 }
        ]}>
          GoGreen Life
        </Text>
        <Text style={[
          styles.subtitle,
          { fontSize: isSmallScreen ? 16 : 18 }
        ]}>
          Live sustainably, impact globally
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 36, 27, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(0, 178, 136, 0.1)',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});