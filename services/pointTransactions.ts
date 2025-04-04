import { supabase } from '../lib/supabase';

export type PointTransaction = {
  id: number;
  user_id: number;
  points: number;
  created_at: string;
};

export const pointTransactionService = {
  async getUserPoints(userId: number): Promise<number> {
    const { data, error } = await supabase
      .from('PointTransactions')
      .select('points')
      .eq('user_id', userId);

    if (error) throw error;
    
    // Calculate total points
    return (data || []).reduce((total, transaction) => total + transaction.points, 0);
  },

  async getPointTransactions(userId: number): Promise<PointTransaction[]> {
    const { data, error } = await supabase
      .from('PointTransactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addPoints(userId: number, points: number): Promise<PointTransaction> {
    const { data, error } = await supabase
      .from('PointTransactions')
      .insert([{
        user_id: userId,
        points
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};