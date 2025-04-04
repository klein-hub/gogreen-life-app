import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/theme';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={[
      styles.header,
      { 
        backgroundColor: isDark ? '#111827' : '#00B288',
        paddingTop: isSmallScreen ? 60 : 80,
        marginBottom: 20
      }
    ]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[
            styles.headerTitle,
            { fontSize: isSmallScreen ? 24 : 30 }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.headerSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.iconButton,
              { backgroundColor: isDark ? '#374151' : 'rgba(255, 255, 255, 0.2)' }
            ]}
          >
            <Ionicons 
              name={isDark ? 'moon' : 'sunny'} 
              size={22} 
              color="#fff" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Notifications', 'You have 3 unread notifications')}
            style={[
              styles.iconButton,
              { backgroundColor: isDark ? '#374151' : 'rgba(255, 255, 255, 0.2)' }
            ]}
          >
            <View style={styles.notificationContainer}>
              <Ionicons name="notifications" size={22} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});