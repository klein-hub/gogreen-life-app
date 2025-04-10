import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GoGreen Life',
  owner: 'kleinhub',
  slug: 'gogreen-life',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'gogreen',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
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
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '7dfd0ecf-2399-4f19-a1be-18590a78444d',
    },
  },
});
