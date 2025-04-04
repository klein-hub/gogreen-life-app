import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme';
import FrequencySelector from './FrequencySelector';
import UnitSelector, { Unit } from './UnitSelector';

type Field = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit: string;
  frequency: 'week' | 'month' | 'year';
  onFrequencyChange: (value: 'week' | 'month' | 'year') => void;
  availableUnits?: Unit[];
  onUnitChange?: (unit: string) => void;
};

type CarbonSectionProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  fields: Field[];
};

export default function CarbonSection({
  title,
  icon,
  iconColor,
  fields,
}: CarbonSectionProps) {
  const { isDark } = useTheme();

  return (
    <View style={[
      styles.sectionCard,
      { backgroundColor: isDark ? '#111827' : 'white' }
    ]}>
      <View style={styles.header}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: `${iconColor}20` }
        ]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#fff' : '#1F2937' }
        ]}>
          {title}
        </Text>
      </View>

      <View style={styles.fields}>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={[
              styles.label,
              { color: isDark ? '#9CA3AF' : '#64748B' }
            ]}>
              {field.label}
            </Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                      color: isDark ? '#fff' : '#1F2937'
                    }
                  ]}
                  value={field.value}
                  onChangeText={field.onChangeText}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={isDark ? '#4B5563' : '#94A3B8'}
                />
                <Text style={[
                  styles.unitText,
                  { color: isDark ? '#9CA3AF' : '#64748B' }
                ]}>
                  {field.unit}
                </Text>
              </View>

              {field.availableUnits && field.onUnitChange && (
                <UnitSelector
                  units={field.availableUnits}
                  selectedUnit={field.unit}
                  onSelect={field.onUnitChange}
                />
              )}
            </View>

            <FrequencySelector
              value={field.frequency}
              onChange={field.onFrequencyChange}
            />
          </View>
        ))}
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
  fields: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  input: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    paddingRight: 48,
  },
  unitText: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
    fontSize: 16,
  },
});