import { View, StyleSheet } from 'react-native';
import Dropdown from '../Dropdown';

export type Unit = {
  value: string;
  label: string;
};

type UnitSelectorProps = {
  units: Unit[];
  selectedUnit: string;
  onSelect: (unit: string) => void;
};

export default function UnitSelector({
  units,
  selectedUnit,
  onSelect,
}: UnitSelectorProps) {
  return (
    <View style={styles.container}>
      <Dropdown
        options={units}
        value={selectedUnit}
        onSelect={onSelect}
        placeholder="Select unit"
        width={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
  },
});
