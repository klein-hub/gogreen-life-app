import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GoGreen Life',
  slug: 'gogreen-life',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'gogreen',
  userInterfaceStyle: 'automatic',
  newArchEnabled: false,
  android: {
    package: 'com.propel.gogreenlife',
    permissions: ['CAMERA', 'RECORD_AUDIO'],
  },
  web: {
    bundler: 'metro',
    output: 'single',
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission:
          'Allow GoGreen Life to access your camera to record task completion videos.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
