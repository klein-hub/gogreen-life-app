import { supabase } from '../lib/supabase';

export type Product = {
  id: string;
  name: string;
  description: string;
  amount: number;
  image_url: string;
  category: string;
  rating: number;
  reviews_count: number;
  eco_impact: {
    co2_saved: number;
    water_saved: number;
    energy_saved: number;
  };
  created_at: string;
  updated_at: string;
};

export const marketplaceService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('marketplace')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('marketplace')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};
