import { Tabs, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme';
import { View } from 'react-native';
import Header from '../../components/Header';
import { useMemo, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/auth';
import { router } from 'expo-router';

export default function TabLayout() {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const { session } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !session?.user?.id) router.replace('/(auth)/login');
    async function loadProfile() {
      try {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        if (data) {
          const name = data.first_name;
          console.log(name);
          setFirstName(name);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    loadProfile();
  }, [session?.user?.id, mounted]);

  // Map of route names to their display titles and subtitles
  const routeTitles = {
    '/(tabs)': {
      title: `Hi ${firstName}!`,
      subtitle: 'There are 3 important things...',
    },
    '/(tabs)/tasks': {
      title: 'My Tasks',
      subtitle: 'Track your eco-friendly activities',
    },
    '/(tabs)/marketplace': {
      title: 'Marketplace',
      subtitle: 'Find eco-friendly products',
    },
    '/(tabs)/carbon': {
      title: 'Carbon Footprint',
      subtitle: 'Track your environmental impact',
    },
    '/(tabs)/profile': {
      title: 'Profile',
      subtitle: 'Manage your account',
    },
  };

  useEffect(() => {
    (async () => {
      await Ionicons.loadFont();
    })();
  }, []);

  // Get the current route information
  const activeRoute = useMemo(() => {
    return (
      routeTitles[pathname as keyof typeof routeTitles] ||
      routeTitles['/(tabs)']
    );
  }, [pathname, firstName]);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1F2937' : '#F8FAFC' }}>
      <Header title={activeRoute.title} subtitle={activeRoute.subtitle} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? '#111827' : 'white',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E2E8F0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#00B288',
          tabBarInactiveTintColor: isDark ? '#6B7280' : '#94A3B8',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="list" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="marketplace"
          options={{
            title: 'Marketplace',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="cart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="carbon"
          options={{
            title: 'Carbon',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="cloud" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="person" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
