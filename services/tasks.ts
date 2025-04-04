import { supabase } from '../lib/supabase';

export type Task = {
  id: number;
  task_name: string;
  description: string;
  points: number;
  created_at: string;
};

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('Tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTask(id: number): Promise<Task | null> {
    const { data, error } = await supabase
      .from('Tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('Tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('Tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};