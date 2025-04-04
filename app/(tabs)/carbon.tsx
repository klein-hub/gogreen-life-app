import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/theme';
import { useAuth } from '../../context/auth';
import CarbonSection from '../../components/carbon/CarbonSection';
import CarbonSummary from '../../components/carbon/CarbonSummary';
import CommuteSection, {
  CommuteRoute,
} from '../../components/carbon/CommuteSection';
import CustomActivitySection, {
  CustomActivity,
} from '../../components/carbon/CustomActivitySection';
import {
  carbonFootprintService,
  EmissionFactors,
} from '../../services/carbonFootprint';
import Toast from '../../components/Toast';

type Frequency = 'week' | 'month' | 'year';

export default function CarbonScreen() {
  const { isDark } = useTheme();
  const { session } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'success'
  );
  const isMounted = useRef(true);

  // Default values for total footprint and top contributors
  const defaultTotalFootprint = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  };

  const defaultTopContributors = [
    { category: 'electricity', emission: 0 },
    { category: 'motor_vehicles', emission: 0 },
    { category: 'food_and_drink', emission: 0 },
  ];

  const [totalFootprint, setTotalFootprint] = useState(defaultTotalFootprint);
  const [topContributors, setTopContributors] = useState(
    defaultTopContributors
  );

  // Utilities state
  const [electricityUsage, setElectricityUsage] = useState('');
  const [electricityUnit, setElectricityUnit] = useState('kWh');
  const [electricityFreq, setElectricityFreq] = useState<Frequency>('month');

  const [lpgUsage, setLpgUsage] = useState('');
  const [lpgUnit, setLpgUnit] = useState('kg');
  const [lpgFreq, setLpgFreq] = useState<Frequency>('month');

  const [coalUsage, setCoalUsage] = useState('');
  const [coalUnit, setCoalUnit] = useState('kg');
  const [coalFreq, setCoalFreq] = useState<Frequency>('month');

  // Food & Lifestyle state
  const [pharmaceuticals, setPharmaceuticals] = useState('');
  const [pharmaceuticalsFreq, setPharmaceuticalsFreq] =
    useState<Frequency>('month');

  const [clothesTextiles, setClothesTextiles] = useState('');
  const [clothesTextilesFreq, setClothesTextilesFreq] =
    useState<Frequency>('month');

  const [furnitureGoods, setFurnitureGoods] = useState('');
  const [furnitureGoodsFreq, setFurnitureGoodsFreq] =
    useState<Frequency>('year');

  const [foodAndDrink, setFoodAndDrink] = useState('');
  const [foodAndDrinkFreq, setFoodAndDrinkFreq] = useState<Frequency>('month');

  // Technology & Entertainment state
  const [computers, setComputers] = useState('');
  const [computersFreq, setComputersFreq] = useState<Frequency>('month');

  const [tvEquipment, setTvEquipment] = useState('');
  const [tvEquipmentFreq, setTvEquipmentFreq] = useState<Frequency>('month');

  const [recreational, setRecreational] = useState('');
  const [recreationalFreq, setRecreationalFreq] = useState<Frequency>('month');

  // Services state
  const [hotels, setHotels] = useState('');
  const [hotelsFreq, setHotelsFreq] = useState<Frequency>('month');

  const [telecoms, setTelecoms] = useState('');
  const [telecomsFreq, setTelecomsFreq] = useState<Frequency>('month');

  // Commute state
  const [commuteRoutes, setCommuteRoutes] = useState<CommuteRoute[]>([
    {
      id: '1',
      from: 'Home',
      to: 'Work',
      mode: 'Car',
      fuelType: 'Gasoline',
      distance: '10',
      fuelUsage: '1',
    },
  ]);

  // Vehicles state
  const [vehicles, setVehicles] = useState<CustomActivity[]>([
    {
      id: '1',
      name: 'Car Maintenance',
      value: '500',
      unit: '₱',
      frequency: 'month',
    },
  ]);

  // Other Activities state
  const [otherActivities, setOtherActivities] = useState<CustomActivity[]>([]);

  // Available units
  const electricityUnits = [
    { value: 'kWh', label: 'Kilowatt Hours' },
    { value: 'MWh', label: 'Megawatt Hours' },
  ];

  const massUnits = [
    { value: 'kg', label: 'Kilograms' },
    { value: 'ton', label: 'Metric Tons' },
  ];

  const currencyUnits = [
    { value: '₱', label: 'Philippine Peso' },
    { value: '$', label: 'US Dollar' },
  ];

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadCarbonData();
    }
  }, [session?.user?.id]);

  const setFieldsValue = (emissionFactors: EmissionFactors) => {
    const electricity = emissionFactors.electricity.split(' ');
    const lpg = emissionFactors.lpg.split(' ');
    const coal = emissionFactors.coal.split(' ');
    const pharmaceuticals = emissionFactors.pharmaceuticals.split(' ');
    const clothesTextiles = emissionFactors.clothes_textiles_shoes.split(' ');
    const furnitureGoods = emissionFactors.furniture_other_goods.split(' ');
    const foodAndDrink = emissionFactors.food_and_drink.split(' ');
    const computers = emissionFactors.computers_it_equipment.split(' ');
    const tvEquipment = emissionFactors.tv_radio_phone_equipment.split(' ');
    const recreational =
      emissionFactors.recreational_cultural_sports.split(' ');
    const hotels = emissionFactors.hotels_restaurants_pubs.split(' ');
    const telecoms = emissionFactors.telecoms.split(' ');

    setElectricityUsage(electricity[0] || '');
    setElectricityUnit(electricity[1] || 'kWh');
    setElectricityFreq((electricity[3] as Frequency) || 'month');
    setLpgUsage(lpg[0] || '');
    setLpgUnit(lpg[1] || 'kg');
    setLpgFreq((lpg[3] as Frequency) || 'month');
    setCoalUsage(coal[0] || '');
    setCoalUnit(coal[1] || 'kg');
    setCoalFreq((coal[3] as Frequency) || 'month');
    setPharmaceuticals(pharmaceuticals[0] || '');
    setPharmaceuticalsFreq((pharmaceuticals[1] as Frequency) || 'month');
    setClothesTextiles(clothesTextiles[0] || '');
    setClothesTextilesFreq((clothesTextilesFreq[1] as Frequency) || 'month');
    setFurnitureGoods(furnitureGoods[0] || '');
    setFurnitureGoodsFreq((furnitureGoods[1] as Frequency) || 'year');
    setFoodAndDrink(foodAndDrink[0] || '');
    setFoodAndDrinkFreq((foodAndDrinkFreq[1] as Frequency) || 'month');
    setComputers(computers[0] || '');
    setComputersFreq((computers[1] as Frequency) || 'month');
    setTvEquipment(tvEquipment[0] || '');
    setTvEquipmentFreq((tvEquipment[1] as Frequency) || 'month');
    setRecreational(recreational[0] || '');
    setRecreationalFreq((recreational[1] as Frequency) || 'month');
    setHotels(hotels[0] || '');
    setHotelsFreq((hotels[1] as Frequency) || 'month');
    setTelecoms(telecoms[0] || '');
    setTelecomsFreq((telecoms[1] as Frequency) || 'month');
    setCommuteRoutes(emissionFactors.commute || []);
    setOtherActivities(emissionFactors.other || []);
  };

  const loadCarbonData = async () => {
    try {
      const emissionFactors = await carbonFootprintService.getEmissionFactors(
        session!.user!.id
      );

      setFieldsValue(emissionFactors || ({} as EmissionFactors));

      if (emissionFactors && isMounted.current) {
      }

      const footprint = await carbonFootprintService.getCarbonFootprint(
        session!.user!.id
      );

      if (footprint && isMounted.current) {
        setTotalFootprint(
          footprint.total_carbon_footprint || defaultTotalFootprint
        );
        setTopContributors(
          footprint.top_contributors || defaultTopContributors
        );
      } else if (isMounted.current) {
        setTotalFootprint(defaultTotalFootprint);
        setTopContributors(defaultTopContributors);
      }
    } catch (error) {
      console.error('Error loading carbon data:', error);
      if (isMounted.current) {
        showToastMessage('Failed to load carbon data', 'error');
        setTotalFootprint(defaultTotalFootprint);
        setTopContributors(defaultTopContributors);
      }
    }
  };

  const showToastMessage = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    if (isMounted.current) {
      setToastMessage(message);
      setToastType(type);
      setShowToast(true);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!session?.user?.id) {
        showToastMessage(
          'Please sign in to save your carbon footprint',
          'error'
        );
        return;
      }

      const emissionFactors = {
        user_id: session.user.id,
        electricity: electricityUsage,
        lpg: lpgUsage,
        coal: coalUsage,
        pharmaceuticals: pharmaceuticals,
        clothes_textiles_shoes: clothesTextiles,
        furniture_other_goods: furnitureGoods,
        food_and_drink: foodAndDrink,
        computers_it_equipment: computers,
        tv_radio_phone_equipment: tvEquipment,
        recreational_cultural_sports: recreational,
        hotels_restaurants_pubs: hotels,
        telecoms: telecoms,
        commute: commuteRoutes,
        vehicles: vehicles,
        other: otherActivities,
      };

      const formattedEmissionFactors = {
        user_id: session.user.id,
        electricity: `${electricityUsage} ${electricityUnit} per ${electricityFreq}`,
        lpg: `${lpgUsage} ${lpgUnit} per ${lpgFreq}`,
        coal: `${coalUsage} ${coalUnit} per ${coalFreq}`,
        pharmaceuticals: `${pharmaceuticals} ₱ per ${pharmaceuticalsFreq}`,
        clothes_textiles_shoes: `${clothesTextiles} ₱ per ${clothesTextilesFreq}`,
        furniture_other_goods: `${furnitureGoods} ₱ per ${furnitureGoodsFreq}`,
        food_and_drink: `${foodAndDrink} ₱ per ${foodAndDrinkFreq}`,
        computers_it_equipment: `${computers} ₱ per ${computersFreq}`,
        tv_radio_phone_equipment: `${tvEquipment} ₱ per ${tvEquipmentFreq}`,
        recreational_cultural_sports: `${recreational} ₱ per ${recreationalFreq}`,
        hotels_restaurants_pubs: `${hotels} ₱ per ${hotelsFreq}`,
        telecoms: `${telecoms} ₱ per ${telecomsFreq}`,
        commute: commuteRoutes,
        vehicles: vehicles,
        other: otherActivities,
      };

      await carbonFootprintService.saveEmissionFactors(emissionFactors);

      const result = await carbonFootprintService.calculateCarbonFootprint(
        formattedEmissionFactors
      );

      if (result && isMounted.current) {
        setTotalFootprint(result.total_carbon_footprint);
        setTopContributors(result.top_contributors);
        showToastMessage('Carbon footprint saved successfully');
      } else if (isMounted.current) {
        showToastMessage('Failed to calculate carbon footprint', 'error');
      }
    } catch (error) {
      console.error('Error saving carbon footprint:', error);
      if (isMounted.current) {
        showToastMessage('Failed to save carbon footprint', 'error');
      }
    }
  };

  // Commute handlers
  const handleAddRoute = () => {
    const newRoute: CommuteRoute = {
      id: Date.now().toString(),
      from: '',
      to: '',
      mode: 'Car',
      fuelType: 'Gasoline',
      distance: '',
      fuelUsage: '',
    };
    setCommuteRoutes([...commuteRoutes, newRoute]);
  };

  const handleRemoveRoute = (id: string) => {
    setCommuteRoutes(commuteRoutes.filter((route) => route.id !== id));
  };

  const handleUpdateRoute = (id: string, updates: Partial<CommuteRoute>) => {
    setCommuteRoutes(
      commuteRoutes.map((route) =>
        route.id === id ? { ...route, ...updates } : route
      )
    );
  };

  // Vehicle handlers
  const handleAddVehicle = () => {
    const newVehicle: CustomActivity = {
      id: Date.now().toString(),
      name: '',
      value: '',
      unit: '₱',
      frequency: 'month',
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleRemoveVehicle = (id: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  const handleUpdateVehicle = (
    id: string,
    updates: Partial<CustomActivity>
  ) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      )
    );
  };

  // Other activities handlers
  const handleAddActivity = () => {
    const newActivity: CustomActivity = {
      id: Date.now().toString(),
      name: '',
      value: '',
      unit: '₱',
      frequency: 'month',
    };
    setOtherActivities([...otherActivities, newActivity]);
  };

  const handleRemoveActivity = (id: string) => {
    setOtherActivities(
      otherActivities.filter((activity) => activity.id !== id)
    );
  };

  const handleUpdateActivity = (
    id: string,
    updates: Partial<CustomActivity>
  ) => {
    setOtherActivities(
      otherActivities.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onHide={() => setShowToast(false)}
        />
      )}

      <CarbonSummary
        totalFootprint={totalFootprint}
        topContributors={topContributors}
      />

      <View style={styles.sections}>
        <CarbonSection
          title="Utilities"
          icon="flash"
          iconColor="#F59E0B"
          fields={[
            {
              label: 'Electricity Usage',
              value: electricityUsage,
              onChangeText: setElectricityUsage,
              unit: electricityUnit,
              frequency: electricityFreq,
              onFrequencyChange: setElectricityFreq,
              availableUnits: electricityUnits,
              onUnitChange: setElectricityUnit,
            },
            {
              label: 'LPG Usage',
              value: lpgUsage,
              onChangeText: setLpgUsage,
              unit: lpgUnit,
              frequency: lpgFreq,
              onFrequencyChange: setLpgFreq,
              availableUnits: massUnits,
              onUnitChange: setLpgUnit,
            },
            {
              label: 'Coal Usage',
              value: coalUsage,
              onChangeText: setCoalUsage,
              unit: coalUnit,
              frequency: coalFreq,
              onFrequencyChange: setCoalFreq,
              availableUnits: massUnits,
              onUnitChange: setCoalUnit,
            },
          ]}
        />

        <CarbonSection
          title="Food & Lifestyle"
          icon="restaurant"
          iconColor="#10B981"
          fields={[
            {
              label: 'Pharmaceuticals',
              value: pharmaceuticals,
              onChangeText: setPharmaceuticals,
              unit: '₱',
              frequency: pharmaceuticalsFreq,
              onFrequencyChange: setPharmaceuticalsFreq,
            },
            {
              label: 'Clothes & Textiles',
              value: clothesTextiles,
              onChangeText: setClothesTextiles,
              unit: '₱',
              frequency: clothesTextilesFreq,
              onFrequencyChange: setClothesTextilesFreq,
            },
            {
              label: 'Furniture & Goods',
              value: furnitureGoods,
              onChangeText: setFurnitureGoods,
              unit: '₱',
              frequency: furnitureGoodsFreq,
              onFrequencyChange: setFurnitureGoodsFreq,
            },
            {
              label: 'Food & Drink',
              value: foodAndDrink,
              onChangeText: setFoodAndDrink,
              unit: '₱',
              frequency: foodAndDrinkFreq,
              onFrequencyChange: setFoodAndDrinkFreq,
            },
          ]}
        />

        <CarbonSection
          title="Technology & Entertainment"
          icon="laptop"
          iconColor="#6366F1"
          fields={[
            {
              label: 'Computers & IT Equipment',
              value: computers,
              onChangeText: setComputers,
              unit: '₱',
              frequency: computersFreq,
              onFrequencyChange: setComputersFreq,
            },
            {
              label: 'TV & Radio Equipment',
              value: tvEquipment,
              onChangeText: setTvEquipment,
              unit: '₱',
              frequency: tvEquipmentFreq,
              onFrequencyChange: setTvEquipmentFreq,
            },
            {
              label: 'Recreational Activities',
              value: recreational,
              onChangeText: setRecreational,
              unit: '₱',
              frequency: recreationalFreq,
              onFrequencyChange: setRecreationalFreq,
            },
          ]}
        />

        <CarbonSection
          title="Services"
          icon="business"
          iconColor="#8B5CF6"
          fields={[
            {
              label: 'Hotels & Restaurants',
              value: hotels,
              onChangeText: setHotels,
              unit: '₱',
              frequency: hotelsFreq,
              onFrequencyChange: setHotelsFreq,
            },
            {
              label: 'Telecommunications',
              value: telecoms,
              onChangeText: setTelecoms,
              unit: '₱',
              frequency: telecomsFreq,
              onFrequencyChange: setTelecomsFreq,
            },
          ]}
        />

        <CommuteSection
          routes={commuteRoutes}
          onAddRoute={handleAddRoute}
          onRemoveRoute={handleRemoveRoute}
          onUpdateRoute={handleUpdateRoute}
        />

        <CustomActivitySection
          activities={vehicles}
          onAddActivity={handleAddVehicle}
          onRemoveActivity={handleRemoveVehicle}
          onUpdateActivity={handleUpdateVehicle}
        />

        <CustomActivitySection
          activities={otherActivities}
          onAddActivity={handleAddActivity}
          onRemoveActivity={handleRemoveActivity}
          onUpdateActivity={handleUpdateActivity}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: '#00B288' }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Calculate Carbon Footprint</Text>
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sections: {
    padding: 24,
  },
  submitButton: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
