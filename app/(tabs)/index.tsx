import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/theme';
import { useAuth } from '../../context/auth';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

type Task = {
  id: string;
  user_id: string;
  task_id: string;
  status: string;
  created_at: string;
  tasks: {
    title: string;
    description: string;
    points: number;
    task_type: string;
  };
};

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();
  const { session } = useAuth();
  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;
  const isLargeScreen = width >= 1024;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [weeklyGoal] = useState(500); // Example weekly goal
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  async function loadDashboardData() {
    try {
      if (!session?.user?.id) return;

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('user_tasks')
        .select(
          `
          *,
          tasks (
            title,
            description,
            points,
            task_type
          )
        `
        )
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      // Calculate total points and weekly progress
      const points =
        tasksData?.reduce((sum, task) => sum + (task.tasks.points || 0), 0) ||
        0;
      setTotalPoints(points);
      setWeeklyProgress((points / weeklyGoal) * 100);
    } catch (e) {
      console.error('Error loading dashboard:', e);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' },
      ]}
    >
      {/* Main Stats Card */}
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: isDark ? '#111827' : '#00B288',
            marginTop: 5,
          },
        ]}
      >
        <View style={styles.pointsSection}>
          <Text style={styles.pointsLabel}>Total Points Earned</Text>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
        </View>

        <View style={styles.impactGrid}>
          <View style={styles.impactItem}>
            <Ionicons name="leaf" size={24} color="white" />
            <Text style={styles.impactValue}>5.2kg</Text>
            <Text style={styles.impactLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.impactItem}>
            <Ionicons name="water" size={24} color="white" />
            <Text style={styles.impactValue}>120L</Text>
            <Text style={styles.impactLabel}>Water Saved</Text>
          </View>
          <View style={styles.impactItem}>
            <Ionicons name="flash" size={24} color="white" />
            <Text style={styles.impactValue}>35kWh</Text>
            <Text style={styles.impactLabel}>Energy Saved</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Weekly Goal Progress</Text>
            <Text style={styles.progressValue}>
              {Math.round(weeklyProgress)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${weeklyProgress}%` }]}
            />
          </View>
          <Text style={styles.progressTarget}>Target: {weeklyGoal} points</Text>
        </View>
      </View>

      {/* Recent Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#fff' : '#1F2937' },
            ]}
          >
            Recent Tasks
          </Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                { backgroundColor: isDark ? '#111827' : 'white' },
              ]}
              onPress={() => router.push('/(tabs)/tasks')}
            >
              <View style={styles.taskIcon}>
                <Ionicons
                  name={
                    task.tasks.task_type === 'water'
                      ? 'water'
                      : task.tasks.task_type === 'energy'
                      ? 'flash'
                      : 'leaf'
                  }
                  size={24}
                  color="#00B288"
                />
              </View>
              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    { color: isDark ? '#fff' : '#1F2937' },
                  ]}
                >
                  {task.tasks.title}
                </Text>
                <Text
                  style={[
                    styles.taskDescription,
                    { color: isDark ? '#9CA3AF' : '#64748B' },
                  ]}
                  numberOfLines={1}
                >
                  {task.tasks.description}
                </Text>
              </View>
              <View style={styles.taskPoints}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text
                  style={[
                    styles.pointsText,
                    { color: isDark ? '#fff' : '#1F2937' },
                  ]}
                >
                  {task.tasks.points}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginBottom: 8,
  },
  pointsValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  impactLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  progressValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressTarget: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#00B288',
  },
  viewAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 178, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
  },
  taskPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
