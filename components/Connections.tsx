import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/theme';
import AlertDialog from './AlertDialog';

type User = {
  id: string;
  username: string;
  avatar_url: string;
  points: number;
};

type ConnectionsProps = {
  onBack: () => void;
  currentUserPoints: number;
};

// Dummy data for connected users
const dummyConnections: User[] = [
  {
    id: '1',
    username: 'johndoe',
    avatar_url:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    points: 1500,
  },
  {
    id: '2',
    username: 'janedoe',
    avatar_url:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    points: 2300,
  },
  {
    id: '3',
    username: 'mikebrown',
    avatar_url:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=80',
    points: 1800,
  },
];

export default function Connections({
  onBack,
  currentUserPoints,
}: ConnectionsProps) {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pointsToShare, setPointsToShare] = useState('0');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Simulate search results
    if (query.length > 0) {
      const results = dummyConnections.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleConnect = (user: User) => {
    // Implement connection logic here
    console.log('Connect with user:', user.username);
  };

  const handleSharePoints = (user: User) => {
    setSelectedUser(user);
    setPointsToShare('0');
    setShowShareModal(true);
  };

  const handleConfirmShare = () => {
    // Implement point sharing logic here
    console.log(
      'Share points with user:',
      selectedUser?.username,
      'Amount:',
      pointsToShare
    );
    setShowShareModal(false);
  };

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= currentUserPoints) {
      setPointsToShare(value);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? '#fff' : '#1F2937'}
        />
        <Text style={[styles.backText, { color: isDark ? '#fff' : '#1F2937' }]}>
          Back to Profile
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? '#fff' : '#1F2937' }]}>
        Connections
      </Text>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? '#111827' : 'white' },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isDark ? '#9CA3AF' : '#64748B'}
        />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#1F2937' }]}
          placeholder="Search users by username..."
          placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.map((user) => (
            <View
              key={user.id}
              style={[
                styles.userCard,
                { backgroundColor: isDark ? '#111827' : 'white' },
              ]}
            >
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatar}
                />
                <Text
                  style={[
                    styles.username,
                    { color: isDark ? '#fff' : '#1F2937' },
                  ]}
                >
                  {user.username}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: isDark ? '#374151' : '#E2E8F0' },
                  ]}
                  onPress={() => {
                    /* View profile logic */
                  }}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: isDark ? '#fff' : '#1F2937' },
                    ]}
                  >
                    View Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#00B288' }]}
                  onPress={() => handleConnect(user)}
                >
                  <Text style={styles.actionButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.connectedUsers}>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1F2937' }]}
        >
          Connected Users
        </Text>

        {dummyConnections.map((user) => (
          <View
            key={user.id}
            style={[
              styles.userCard,
              { backgroundColor: isDark ? '#111827' : 'white' },
            ]}
          >
            <View style={styles.userInfo}>
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              <View>
                <Text
                  style={[
                    styles.username,
                    { color: isDark ? '#fff' : '#1F2937' },
                  ]}
                >
                  {user.username}
                </Text>
                <Text
                  style={[
                    styles.points,
                    { color: isDark ? '#9CA3AF' : '#64748B' },
                  ]}
                >
                  {user.points} points
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: '#00B288' }]}
              onPress={() => handleSharePoints(user)}
            >
              <Ionicons name="share" size={20} color="white" />
              <Text style={styles.shareButtonText}>Share Points</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <AlertDialog
        isVisible={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={handleConfirmShare}
        title="Share Points"
        message={`Share points with ${selectedUser?.username}`}
        customContent={
          <View style={styles.pointsInputContainer}>
            <TouchableOpacity
              style={styles.pointsButton}
              onPress={() =>
                handlePointsChange(
                  Math.max(0, parseInt(pointsToShare) - 100).toString()
                )
              }
            >
              <Ionicons
                name="remove"
                size={24}
                color={isDark ? '#fff' : '#1F2937'}
              />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.pointsInput,
                { color: isDark ? '#fff' : '#1F2937' },
              ]}
              value={pointsToShare}
              onChangeText={handlePointsChange}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.pointsButton}
              onPress={() =>
                handlePointsChange(
                  Math.min(
                    currentUserPoints,
                    parseInt(pointsToShare) + 100
                  ).toString()
                )
              }
            >
              <Ionicons
                name="add"
                size={24}
                color={isDark ? '#fff' : '#1F2937'}
              />
            </TouchableOpacity>
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  searchResults: {
    gap: 12,
    marginBottom: 24,
  },
  connectedUsers: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  points: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  pointsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  pointsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 178, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsInput: {
    width: 100,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
});
