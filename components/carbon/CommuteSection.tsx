import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme';
import UnitSelector, { Unit } from './UnitSelector';

export type CommuteRoute = {
  id: string;
  from: string;
  to: string;
  mode: string;
  fuelType?: string;
  distance: string;
  fuelUsage?: string;
};

type CommuteSectionProps = {
  routes: CommuteRoute[];
  onAddRoute: () => void;
  onRemoveRoute: (id: string) => void;
  onUpdateRoute: (id: string, updates: Partial<CommuteRoute>) => void;
};

const transportModes = [
  { value: 'Car', label: 'Car' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Train', label: 'Train' },
  { value: 'Tricycle', label: 'Tricycle' },
  { value: 'Motorcycle', label: 'Motorcycle' },
];

const fuelTypes = [
  { value: 'Gasoline', label: 'Gasoline' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
];

const distanceUnits: Unit[] = [
  { value: 'km', label: 'Kilometers' },
  { value: 'mi', label: 'Miles' },
];

export default function CommuteSection({
  routes,
  onAddRoute,
  onRemoveRoute,
  onUpdateRoute,
}: CommuteSectionProps) {
  const { isDark } = useTheme();

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Car':
        return 'car';
      case 'Bus':
        return 'bus';
      case 'Bike':
        return 'bicycle';
      case 'Walk':
        return 'walk';
      default:
        return 'car';
    }
  };

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: isDark ? '#111827' : 'white' },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#3B82F620' }]}>
          <Ionicons name="map" size={24} color="#3B82F6" />
        </View>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1F2937' }]}
        >
          Daily Commute
        </Text>
      </View>

      <View style={styles.routesList}>
        {routes.map((route) => (
          <View
            key={route.id}
            style={[
              styles.routeCard,
              { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' },
            ]}
          >
            <View style={styles.routeHeader}>
              <View style={styles.routeInfo}>
                <Ionicons
                  name={getModeIcon(route.mode)}
                  size={20}
                  color="#3B82F6"
                />
                <View style={styles.locationInputs}>
                  <TextInput
                    style={[
                      styles.locationInput,
                      {
                        color: isDark ? '#fff' : '#1F2937',
                        backgroundColor: isDark ? '#111827' : '#fff',
                        borderRadius: 12,
                        marginRight: 8,
                      },
                    ]}
                    value={route.from}
                    onChangeText={(text) =>
                      onUpdateRoute(route.id, { from: text })
                    }
                    placeholder="From"
                    placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
                  />
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={isDark ? '#6B7280' : '#94A3B8'}
                  />
                  <TextInput
                    style={[
                      styles.locationInput,
                      {
                        color: isDark ? '#fff' : '#1F2937',
                        backgroundColor: isDark ? '#111827' : '#fff',
                        borderRadius: 12,
                        marginRight: 8,
                      },
                    ]}
                    value={route.to}
                    onChangeText={(text) =>
                      onUpdateRoute(route.id, { to: text })
                    }
                    placeholder="To"
                    placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => onRemoveRoute(route.id)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.routeDetails}>
              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? '#9CA3AF' : '#64748B' },
                  ]}
                >
                  Mode
                </Text>
                <UnitSelector
                  units={transportModes}
                  selectedUnit={route.mode}
                  onSelect={(mode) => onUpdateRoute(route.id, { mode })}
                />
              </View>

              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? '#9CA3AF' : '#64748B' },
                  ]}
                >
                  Distance
                </Text>
                <View style={styles.distanceInput}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? '#111827' : '#fff',
                        color: isDark ? '#fff' : '#1F2937',
                      },
                    ]}
                    value={route.distance}
                    onChangeText={(text) =>
                      onUpdateRoute(route.id, { distance: text })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
                  />
                  <UnitSelector
                    units={distanceUnits}
                    selectedUnit="km"
                    onSelect={(unit) => {
                      // Handle distance unit conversion
                    }}
                  />
                </View>
              </View>

              {route.mode === 'Car' && (
                <View style={styles.detailItem}>
                  <Text
                    style={[
                      styles.label,
                      { color: isDark ? '#9CA3AF' : '#64748B' },
                    ]}
                  >
                    Fuel Usage
                  </Text>
                  <View style={styles.distanceInput}>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: isDark ? '#111827' : '#fff',
                          color: isDark ? '#fff' : '#1F2937',
                        },
                      ]}
                      value={route.fuelUsage}
                      onChangeText={(text) =>
                        onUpdateRoute(route.id, { fuelUsage: text })
                      }
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.unitText,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      L
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: isDark ? '#374151' : '#E2E8F0' },
          ]}
          onPress={onAddRoute}
        >
          <Ionicons
            name="add-circle"
            size={20}
            color={isDark ? '#00B288' : '#00B288'}
          />
          <Text
            style={[
              styles.addButtonText,
              { color: isDark ? '#fff' : '#1F2937' },
            ]}
          >
            Add Route
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  routesList: {
    gap: 12,
  },
  routeCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 8,
    borderRadius: 8,
    display: 'block',
  },
  removeButton: {
    padding: 4,
  },
  routeDetails: {
    gap: 12,
  },
  detailItem: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  distanceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
