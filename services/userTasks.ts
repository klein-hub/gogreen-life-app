import { supabase } from '../lib/supabase';

export type Task = {
  id: string;
  title: string;
  task_type: 'Easy' | 'Medium' | 'Hard';
  description: string;
  points: number;
  co2_impact: number;
  energy_impact: number;
  water_impact: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';
  is_user_defined: boolean;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Approved';
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type UserTask = {
  id: number;
  user_id: number;
  task_id: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Approved';
  video_url?: string;
  created_at: string;
  tasks: {
    title: string;
    description: string;
    points: number;
    task_type: 'Easy' | 'Medium' | 'Hard';
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';
    co2_impact: number;
    energy_impact: number;
    water_impact: number;
  };
};

export const userTaskService = {
  async getUserTasks(userId: number): Promise<UserTask[]> {
    const { data, error } = await supabase
      .from('user_tasks')
      .select(`
        *,
        tasks (
          title,
          description,
          points,
          task_type,
          frequency,
          co2_impact,
          energy_impact,
          water_impact
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserTask(id: number): Promise<UserTask | null> {
    const { data, error } = await supabase
      .from('UserTasks')
      .select(`
        *,
        tasks (
          title,
          description,
          points,
          task_type,
          frequency,
          co2_impact,
          energy_impact,
          water_impact
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async assignTaskToUser(userId: number, taskId: number): Promise<UserTask> {
    const { data, error } = await supabase
      .from('UserTasks')
      .insert([{
        user_id: userId,
        task_id: taskId,
        status: 'Not Started'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTaskStatus(id: number, status: 'Not Started' | 'In Progress' | 'Completed' | 'Approved', videoUrl?: string): Promise<UserTask> {
    const updateData: any = { status };
    if (videoUrl) {
      updateData.video_url = videoUrl;
    }

    const { data, error } = await supabase
      .from('UserTasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};