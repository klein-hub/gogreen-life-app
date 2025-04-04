import { supabase } from '../lib/supabase';
import OpenAI from 'openai';
import { Platform } from 'react-native';

// Only initialize OpenAI client in non-browser environments
let client: OpenAI | null = null;

if (Platform.OS !== 'web') {
  client = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  });
}

// Fallback calculation for browser environments
const calculateFallbackFootprint = (
  data: EmissionFactors
): CarbonFootprintResult => {
  // Simple calculation based on basic emission factors
  const electricityEmission = parseFloat(data.electricity || '0') * 0.5; // 0.5 kg CO2/kWh
  const lpgEmission = parseFloat(data.lpg || '0') * 2.98; // 2.98 kg CO2/kg
  const coalEmission = parseFloat(data.coal || '0') * 2.42; // 2.42 kg CO2/kg

  const yearlyTotal = electricityEmission + lpgEmission + coalEmission;

  return {
    user_id: data.user_id,
    total_carbon_footprint: {
      daily: yearlyTotal / 365,
      weekly: yearlyTotal / 52,
      monthly: yearlyTotal / 12,
      yearly: yearlyTotal,
    },
    top_contributors: [
      { category: 'electricity', emission: electricityEmission },
      { category: 'lpg', emission: lpgEmission },
      { category: 'coal', emission: coalEmission },
    ].sort((a, b) => b.emission - a.emission),
  };
};

export type EmissionFactors = {
  id?: number;
  user_id: string;
  electricity: string;
  lpg: string;
  coal: string;
  food_and_drink: string;
  pharmaceuticals: string;
  clothes_textiles_shoes: string;
  computers_it_equipment: string;
  tv_radio_phone_equipment: string;
  recreational_cultural_sports: string;
  furniture_other_goods: string;
  hotels_restaurants_pubs: string;
  telecoms: string;
  commute: any[];
  vehicles: any[];
  other: any[];
};

export type CarbonFootprintResult = {
  user_id: string;
  total_carbon_footprint: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  top_contributors: Array<{
    category: string;
    emission: number;
  }>;
};

export const carbonFootprintService = {
  async saveEmissionFactors(data: EmissionFactors) {
    const { data: existingData, error: fetchError } = await supabase
      .from('emission_factors')
      .select('*')
      .eq('user_id', data.user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 indicates no rows found, so we ignore it for insert
      throw fetchError;
    }

    let error;
    if (existingData) {
      // Update the existing row
      const { error: updateError } = await supabase
        .from('emission_factors')
        .update(data)
        .eq('user_id', data.user_id);
      error = updateError;
    } else {
      // Insert a new row
      const { error: insertError } = await supabase
        .from('emission_factors')
        .insert([data]);
      error = insertError;
    }

    if (error) throw error;
  },

  async getEmissionFactors(userId: string): Promise<EmissionFactors | null> {
    const { data, error } = await supabase
      .from('emission_factors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async calculateCarbonFootprint(
    data: EmissionFactors
  ): Promise<CarbonFootprintResult | null> {
    try {
      // Use fallback calculation
      console.log(client);
      if (!client) {
        return calculateFallbackFootprint(data);
      }

      const formattedPayload = JSON.stringify(data);

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in carbon footprint analysis. Always return JSON output in the specified format.',
          },
          {
            role: 'user',
            content:
              'Compute the total carbon footprint based on this data and return the result in JSON format.',
          },
          {
            role: 'user',
            content: `Input data:\n\`\`\`json\n${formattedPayload}\n\`\`\`\n\nRespond strictly in the following format:\n\`\`\`json\n{
              "user_id": "${data.user_id}",
              "total_carbon_footprint": {
                "daily": 5.0,
                "weekly": 12.03,
                "monthly": 49.045,
                "yearly": 588.54
              },
              "top_contributors": [
                { "category": "electricity", "emission": 5.0 },
                { "category": "motor_vehicles", "emission": 2.31 },
                { "category": "food_and_drink", "emission": 2.7 }
              ]
            }\n\`\`\``,
          },
        ],
        response_format: { type: 'json_object' },
      });

      console.log('OpenAI response:', response);

      if (!response.choices[0].message.content) {
        throw new Error('Response content is null');
      }
      const result = JSON.parse(response.choices[0].message.content);

      // Save the result to Supabase
      await this.saveCarbonFootprint(result);

      return result;
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      return null;
    }
  },

  async saveCarbonFootprint(data: CarbonFootprintResult) {
    const { data: existingData, error: fetchError } = await supabase
      .from('carbon_footprint')
      .select('*')
      .eq('user_id', data.user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 indicates no rows found, so we ignore it for insert
      throw fetchError;
    }

    let error;
    if (existingData) {
      // Update the existing row
      const { error: updateError } = await supabase
        .from('carbon_footprint')
        .update(data)
        .eq('user_id', data.user_id);
      error = updateError;
    } else {
      // Insert a new row
      const { error: insertError } = await supabase
        .from('carbon_footprint')
        .insert([data]);
      error = insertError;
    }

    if (error) throw error;
  },

  async getCarbonFootprint(
    userId: string
  ): Promise<CarbonFootprintResult | null> {
    const { data, error } = await supabase
      .from('carbon_footprint')
      .select('*')
      .eq('user_id', userId)
      .single();
    console.log('Carbon footprint data:', data);

    if (error) return null;
    return data;
  },
};
