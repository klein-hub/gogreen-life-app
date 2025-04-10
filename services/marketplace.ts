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

  async purchaseProduct(userId: string, productId: string): Promise<string> {
    // Fetch the product details
    const { data: product, error: productError } = await supabase
      .from('marketplace')
      .select('amount')
      .eq('id', productId)
      .single();

    if (productError) throw productError;
    if (!product) throw new Error('Product not found');

    // Fetch the user's current points
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    // Check if the user has enough points
    if (user.points < product.amount) {
      return "You don't have enough points to purchase this item.";
    }

    // Deduct the points and update the user's record
    const { error: updateError } = await supabase
      .from('users')
      .update({ points: user.points - product.amount })
      .eq('id', userId);

    if (updateError) throw updateError;

    return 'Purchase successful! Your points have been deducted.';
  },
};
