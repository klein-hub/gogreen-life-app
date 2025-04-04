import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GoGreen Life',
  slug: 'gogreen-life',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'gogreen',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  web: {
    bundler: 'metro',
    output: 'single',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
});