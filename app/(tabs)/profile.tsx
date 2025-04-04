import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useAuth } from '../../context/auth';
import { useTheme } from '../../context/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/supabase-types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const stats = [
  { id: 1, value: '156', label: 'Days Active' },
  { id: 2, value: '423', label: 'Actions' },
  { id: 3, value: '892', label: 'kg CO₂ Saved' },
];

export default function Profile() {
  const { signOut, session } = useAuth();
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        console.log(data);
      } catch (e) {
        console.error('Error loading profile:', e);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session?.user?.id]);

  const getAchievementSize = () => {
    if (isMediumScreen) return width * 0.15;
    if (!isSmallScreen) return width * 0.12;
    return width * 0.28;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' }
      ]}
    >
      <View style={[styles.profileInfo, { marginTop: 5 }]}>
        <Image
          source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=80' }}
          style={styles.profileImage}
        />
        <Text style={[
          styles.profileName,
          { color: isDark ? '#fff' : '#1F2937', fontSize: isSmallScreen ? 20 : 24 }
        ]}>
          { `${profile?.first_name} ${profile?.last_name}`  || 'Anonymous User'}
        </Text>
        <Text style={[
          styles.profileBio,
          { color: isDark ? '#9CA3AF' : '#64748B' }
        ]}>
          {profile?.bio || 'No bio available'}
        </Text>
      </View>

      <View style={[
        styles.statsContainer,
        { 
          backgroundColor: isDark ? '#111827' : '#fff',
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: isSmallScreen ? 16 : 0
        }
      ]}>
        {stats.map((stat) => (
          <View key={stat.id} style={styles.statItem}>
            <Text style={[
              styles.statValue,
              { color: isDark ? '#00B288' : '#00B288' }
            ]}>
              {stat.value}
            </Text>
            <Text style={[
              styles.statLabel,
              { color: isDark ? '#9CA3AF' : '#64748B' }
            ]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -30,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
  },
  profileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
  },
  statsContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});