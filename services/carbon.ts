import { supabase } from '../../lib/supabase';

export type CarbonFootprint = {
  id: string;
  user_id: string;
  // Utilities
  electricity: string;
  lpg: string;
  coal: string;
  // Food & Lifestyle
  pharmaceuticals: string;
  clothes_textiles_shoes: string;
  furniture_other_goods: string;
  food_and_drink: string;
  // Technology & Entertainment
  computers_it_equipment: string;
  tv_radio_phone_equipment: string;
  recreational_cultural_sports: string;
  // Services
  hotels_restaurants_pubs: string;
  telecoms: string;
  // Commute
  commute: CommuteSection[];
  // Vehicles
  vehicles: CustomActivitySection[];
  // Others
  other: CustomActivitySection[];
  // Metadata
  created_at: string;
  updated_at: string;
};

export type CommuteSection = {
  from: string;
  to: string;
  mode: string;
  fuel_type?: string;
  distance: string;
  fuel_usage?: string;
};

export type CustomActivitySection = {
  name: string;
  value: string;
  unit: string;
  frequency: 'week' | 'month' | 'year';
};

export const carbonService = {
  async getCarbonFootprint(userId: string): Promise<CarbonFootprint | null> {
    const { data, error } = await supabase
      .from('carbon_footprints')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching carbon footprint:', error);
      return null;
    }

    return data;
  },

  async saveCarbonFootprint(
    footprint: Omit<CarbonFootprint, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CarbonFootprint | null> {
    const { data, error } = await supabase
      .from('carbon_footprints')
      .upsert([
        {
          ...footprint,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving carbon footprint:', error);
      return null;
    }

    return data;
  },

  calculateEmissions(footprint: CarbonFootprint) {
    let totalEmissions = 0;

    // Utility emissions
    totalEmissions += this.calculateUtilityEmissions(footprint);

    // Food & Lifestyle emissions
    totalEmissions += this.calculateFoodLifestyleEmissions(footprint);

    // Technology & Entertainment emissions
    totalEmissions += this.calculateTechEntertainmentEmissions(footprint);

    // Services emissions
    totalEmissions += this.calculateServicesEmissions(footprint);

    // Commute emissions
    totalEmissions += this.calculateCommuteEmissions(footprint.commute);

    // Vehicle emissions
    totalEmissions += this.calculateVehicleEmissions(footprint.vehicles);

    // Other emissions
    totalEmissions += this.calculateOtherEmissions(footprint.other);

    return {
      daily: totalEmissions / 365,
      weekly: totalEmissions / 52,
      monthly: totalEmissions / 12,
      yearly: totalEmissions,
    };
  },

  calculateUtilityEmissions(footprint: CarbonFootprint) {
    // Emission factors (kg CO2e per unit)
    const ELECTRICITY_FACTOR = 0.5; // kg CO2e per kWh
    const LPG_FACTOR = 2.98; // kg CO2e per kg
    const COAL_FACTOR = 2.42; // kg CO2e per kg

    return (
      parseFloat(footprint.electricity) * ELECTRICITY_FACTOR +
      parseFloat(footprint.lpg) * LPG_FACTOR +
      parseFloat(footprint.coal) * COAL_FACTOR
    );
  },

  calculateFoodLifestyleEmissions(footprint: CarbonFootprint) {
    // Emission factors (kg CO2e per PHP spent)
    const PHARMACEUTICALS_FACTOR = 0.0005;
    const CLOTHES_FACTOR = 0.0008;
    const FURNITURE_FACTOR = 0.0006;
    const FOOD_FACTOR = 0.001;

    return (
      parseFloat(footprint.pharmaceuticals) * PHARMACEUTICALS_FACTOR +
      parseFloat(footprint.clothes_textiles_shoes) * CLOTHES_FACTOR +
      parseFloat(footprint.furniture_other_goods) * FURNITURE_FACTOR +
      parseFloat(footprint.food_and_drink) * FOOD_FACTOR
    );
  },

  calculateTechEntertainmentEmissions(footprint: CarbonFootprint) {
    // Emission factors (kg CO2e per PHP spent)
    const COMPUTERS_FACTOR = 0.0007;
    const TV_EQUIPMENT_FACTOR = 0.0006;
    const RECREATIONAL_FACTOR = 0.0004;

    return (
      parseFloat(footprint.computers_it_equipment) * COMPUTERS_FACTOR +
      parseFloat(footprint.tv_radio_phone_equipment) * TV_EQUIPMENT_FACTOR +
      parseFloat(footprint.recreational_cultural_sports) * RECREATIONAL_FACTOR
    );
  },

  calculateServicesEmissions(footprint: CarbonFootprint) {
    // Emission factors (kg CO2e per PHP spent)
    const HOTELS_FACTOR = 0.0009;
    const TELECOMS_FACTOR = 0.0003;

    return (
      parseFloat(footprint.hotels_restaurants_pubs) * HOTELS_FACTOR +
      parseFloat(footprint.telecoms) * TELECOMS_FACTOR
    );
  },

  calculateCommuteEmissions(commute: CommuteSection[]) {
    // Emission factors (kg CO2e per km)
    const TRANSPORT_FACTORS = {
      Car: {
        Gasoline: 0.192,
        Diesel: 0.171,
        Electric: 0.053,
      },
      Bus: 0.089,
      Bike: 0,
      Walk: 0,
    };

    return commute.reduce((total, route) => {
      const distance = parseFloat(route.distance);
      if (route.mode === 'Car' && route.fuel_type) {
        return (
          total +
          distance *
            TRANSPORT_FACTORS.Car[
              route.fuel_type as keyof typeof TRANSPORT_FACTORS.Car
            ]
        );
      }
      return (
        total +
        parseFloat(route.distance) *
          ((TRANSPORT_FACTORS[
            route.mode as keyof typeof TRANSPORT_FACTORS
          ] as number) || 0)
      );
    }, 0);
  },

  calculateVehicleEmissions(vehicles: CustomActivitySection[]) {
    // Emission factor (kg CO2e per PHP spent on vehicle maintenance)
    const VEHICLE_MAINTENANCE_FACTOR = 0.0005;

    return vehicles.reduce((total, vehicle) => {
      return total + parseFloat(vehicle.value) * VEHICLE_MAINTENANCE_FACTOR;
    }, 0);
  },

  calculateOtherEmissions(other: CustomActivitySection[]) {
    // Generic emission factor for other activities (kg CO2e per PHP spent)
    const OTHER_ACTIVITY_FACTOR = 0.0004;

    return other.reduce((total, activity) => {
      return total + parseFloat(activity.value) * OTHER_ACTIVITY_FACTOR;
    }, 0);
  },
};
