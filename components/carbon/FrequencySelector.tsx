import { View, StyleSheet } from 'react-native';
import Dropdown from '../Dropdown';

type FrequencySelectorProps = {
  value: 'week' | 'month' | 'year';
  onChange: (value: 'week' | 'month' | 'year') => void;
};

const frequencyOptions = [
  { value: 'week', label: 'Per Week' },
  { value: 'month', label: 'Per Month' },
  { value: 'year', label: 'Per Year' },
];

export default function FrequencySelector({
  value,
  onChange,
}: FrequencySelectorProps) {
  return (
    <View style={styles.container}>
      <Dropdown
        options={frequencyOptions}
        value={value}
        onSelect={onChange as (value: string) => void}
        placeholder="Select frequency"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
