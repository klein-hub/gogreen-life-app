import { supabase } from '../lib/supabase';

export type User = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

export const userService = {
  async getUser(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(username: string, email: string): Promise<User> {
    const { data, error } = await supabase
      .from('Users')
      .insert([{ username, email }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('Users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};