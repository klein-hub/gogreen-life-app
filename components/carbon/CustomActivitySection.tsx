import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme';
import FrequencySelector from './FrequencySelector';

export type CustomActivity = {
  id: string;
  name: string;
  value: string;
  unit: string;
  frequency: 'week' | 'month' | 'year';
};

type CustomActivitySectionProps = {
  title?: string;
  activities: CustomActivity[];
  onAddActivity: () => void;
  onRemoveActivity: (id: string) => void;
  onUpdateActivity: (id: string, updates: Partial<CustomActivity>) => void;
};

export default function CustomActivitySection({
  title,
  activities,
  onAddActivity,
  onRemoveActivity,
  onUpdateActivity,
}: CustomActivitySectionProps) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: isDark ? '#111827' : 'white' },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#8B5CF620' }]}>
          <Ionicons name="add-circle" size={24} color="#8B5CF6" />
        </View>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1F2937' }]}
        >
          {title ?? 'Custom Activities'}
        </Text>
      </View>

      <View style={styles.activitiesList}>
        {activities.map((activity) => (
          <View
            key={activity.id}
            style={[
              styles.activityCard,
              { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' },
            ]}
          >
            <View style={styles.activityHeader}>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    color: isDark ? '#fff' : '#1F2937',
                    backgroundColor: isDark ? '#111827' : '#fff',
                    borderRadius: 12,
                    marginRight: 8,
                    padding: 12,
                    fontSize: 16,
                  },
                ]}
                value={activity.name}
                onChangeText={(name) => onUpdateActivity(activity.id, { name })}
                placeholder="Activity Name"
                placeholderTextColor={isDark ? '#4B5563' : '#94A3B8'}
              />
              <TouchableOpacity
                onPress={() => onRemoveActivity(activity.id)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.activityDetails}>
              <View style={styles.inputRow}>
                <View style={styles.valueContainer}>
                  <TextInput
                    style={[
                      styles.valueInput,
                      {
                        backgroundColor: isDark ? '#111827' : '#fff',
                        color: isDark ? '#fff' : '#1F2937',
                      },
                    ]}
                    value={activity.value}
                    onChangeText={(value) =>
                      onUpdateActivity(activity.id, { value })
                    }
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={isDark ? '#4B5563' : '#94A3B8'}
                  />
                </View>
                <TextInput
                  style={[
                    styles.unitInput,
                    {
                      backgroundColor: isDark ? '#111827' : '#fff',
                      color: isDark ? '#fff' : '#1F2937',
                    },
                  ]}
                  value={activity.unit}
                  onChangeText={(unit) =>
                    onUpdateActivity(activity.id, { unit })
                  }
                  placeholder="Unit"
                  placeholderTextColor={isDark ? '#4B5563' : '#94A3B8'}
                />
              </View>

              <FrequencySelector
                value={activity.frequency}
                onChange={(frequency) =>
                  onUpdateActivity(activity.id, { frequency })
                }
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: isDark ? '#374151' : '#E2E8F0' },
          ]}
          onPress={onAddActivity}
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
            Add Activity
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
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  activityDetails: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  valueContainer: {
    flex: 1,
  },
  valueInput: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  unitInput: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
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
