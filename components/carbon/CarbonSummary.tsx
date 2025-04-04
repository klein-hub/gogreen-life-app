import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme';
import Animated, { FadeIn } from 'react-native-reanimated';

type CarbonSummaryProps = {
  totalFootprint: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  topContributors: Array<{
    category: string;
    emission: number;
  }>;
};

export default function CarbonSummary({
  totalFootprint,
  topContributors,
}: CarbonSummaryProps) {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const formatEmission = (value: number) => {
    return value ? value.toFixed(2) : '0.00';
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'electricity') {
      return 'flash';
    } else if (category === 'lpg' || category === 'coal') {
      return 'flame';
    } else if (category === 'food_and_drink') {
      return 'fast-food';
    } else if (category === 'pharmaceuticals') {
      return 'medkit';
    } else if (category === 'clothes_textiles_shoes') {
      return 'shirt';
    } else if (category === 'computers_it_equipment') {
      return 'laptop';
    } else if (category === 'tv_radio_phone_equipment') {
      return 'tv';
    } else if (category === 'recreational_cultural_sports') {
      return 'football';
    } else if (category === 'furniture_other_goods') {
      return 'bed';
    } else if (category === 'hotels_restaurants_pubs') {
      return 'restaurant';
    } else if (category === 'telecoms') {
      return 'call';
    } else if (category === 'commute') {
      return 'walk';
    } else if (category === 'vehicles') {
      return 'car';
    } else {
      return 'leaf';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electricity':
        return '#F59E0B';
      case 'motor_vehicles':
        return '#3B82F6';
      case 'food_and_drink':
        return '#10B981';
      default:
        return '#8B5CF6';
    }
  };

  const formatCategoryName = (category: string) => {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const maxEmission = Math.max(
    ...(topContributors?.map((c) => c.emission) || [0])
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop',
      }}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.15 }}
    >
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[
          styles.summaryCard,
          {
            backgroundColor: isDark
              ? 'rgba(17, 24, 39, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          },
        ]}
      >
        <View style={styles.totalEmissions}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="earth"
              size={32}
              color="#00B288"
              style={styles.titleIcon}
            />
            <Text
              style={[
                styles.summaryTitle,
                { color: isDark ? '#fff' : '#1F2937' },
              ]}
            >
              Your Carbon Footprint
            </Text>
          </View>

          <View
            style={[
              styles.emissionsGrid,
              { flexDirection: isSmallScreen ? 'column' : 'row' },
            ]}
          >
            {Object.entries(totalFootprint || {}).map(
              ([period, value], index) => (
                <Animated.View
                  key={period}
                  entering={FadeIn.delay(index * 100).duration(500)}
                  style={[
                    styles.emissionCard,
                    {
                      backgroundColor: isDark
                        ? 'rgba(55, 65, 81, 0.5)'
                        : 'rgba(0, 178, 136, 0.1)',
                      marginLeft: !isSmallScreen && index > 0 ? 12 : 0,
                      marginTop: isSmallScreen && index > 0 ? 12 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.emissionValue,
                      { color: isDark ? '#00B288' : '#00B288' },
                    ]}
                  >
                    {formatEmission(value)}
                  </Text>
                  <Text
                    style={[
                      styles.emissionLabel,
                      { color: isDark ? '#9CA3AF' : '#4B5563' },
                    ]}
                  >
                    kg CO₂/{period}
                  </Text>
                </Animated.View>
              )
            )}
          </View>
        </View>

        <View
          style={[
            styles.topContributors,
            {
              borderTopColor: isDark
                ? 'rgba(75, 85, 99, 0.2)'
                : 'rgba(0, 0, 0, 0.1)',
            },
          ]}
        >
          <Text
            style={[
              styles.summaryTitle,
              { color: isDark ? '#fff' : '#1F2937' },
            ]}
          >
            Top Contributors
          </Text>

          <View style={styles.contributorsList}>
            {(topContributors || []).map((contributor, index) => (
              <View
                key={index}
                style={[
                  styles.contributorItem,
                  {
                    backgroundColor: isDark
                      ? 'rgba(55, 65, 81, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                  },
                ]}
              >
                <View style={styles.contributorInfo}>
                  <View
                    style={[
                      styles.contributorIcon,
                      {
                        backgroundColor: `${getCategoryColor(
                          contributor.category
                        )}20`,
                        shadowColor: getCategoryColor(contributor.category),
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                      },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryIcon(contributor.category)}
                      size={28}
                      color={getCategoryColor(contributor.category)}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.contributorCategory,
                        { color: isDark ? '#fff' : '#1F2937' },
                      ]}
                    >
                      {formatCategoryName(contributor.category)}
                    </Text>
                    <Text
                      style={[
                        styles.contributorEmission,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      {formatEmission(contributor.emission)} kg CO₂
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.contributorBar,
                    {
                      backgroundColor: isDark
                        ? 'rgba(75, 85, 99, 0.2)'
                        : 'rgba(0, 0, 0, 0.1)',
                    },
                  ]}
                >
                  <Animated.View
                    entering={FadeIn.duration(800)}
                    style={[
                      styles.contributorProgress,
                      {
                        backgroundColor: getCategoryColor(contributor.category),
                        width: `${
                          maxEmission > 0
                            ? (contributor.emission / maxEmission) * 100
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    margin: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  summaryCard: {
    padding: 24,
    gap: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  titleIcon: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  totalEmissions: {
    gap: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emissionsGrid: {
    gap: 2,
  },
  emissionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B288',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emissionValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  emissionLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  topContributors: {
    gap: 20,
    borderTopWidth: 1,
    paddingTop: 24,
  },
  contributorsList: {
    gap: 16,
  },
  contributorItem: {
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contributorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contributorCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contributorEmission: {
    fontSize: 14,
  },
  contributorBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  contributorProgress: {
    height: '100%',
    borderRadius: 4,
  },
});
