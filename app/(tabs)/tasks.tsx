import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme';
import { Ionicons } from '@expo/vector-icons';
import { userTaskService, Task } from '../../services/userTasks';
import { useAuth } from '../../context/auth';
import TaskDetailsDialog from '../../components/TaskDetailsDialog';

const filters = [
  { id: 'all', label: 'All Tasks', icon: 'list' },
  { id: 'not_started', label: 'Not Started', icon: 'hourglass' },
  { id: 'in_progress', label: 'In Progress', icon: 'time' },
  { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
];

export default function Tasks() {
  const { isDark } = useTheme();
  const { session } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  useEffect(() => {
    if (session?.user?.id) {
      loadTasks();
    }
  }, [session?.user?.id, selectedFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userTaskService.getUserTasks(session!.user!.id);

      // Filter tasks based on selected filter
      const filteredTasks = data.filter((task) => {
        if (selectedFilter === 'all') return true;
        return task.status.toLowerCase().replace(' ', '_') === selectedFilter;
      });

      setTasks(filteredTasks);
    } catch (e) {
      console.error('Error loading tasks:', e);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setIsDialogVisible(true);
  };

  const handleTaskComplete = async () => {
    if (!selectedTask) return;

    try {
      await userTaskService.updateTaskStatus(selectedTask.id, 'Completed');
      setIsDialogVisible(false);
      loadTasks(); // Reload tasks to reflect the update
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' },
      ]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // style={styles.filtersContainer}
        contentContainerStyle={{
          // flexGrow: 1,
          padding: isSmallScreen ? 12 : 20,
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterItem,
              {
                backgroundColor: isDark
                  ? selectedFilter === filter.id
                    ? '#374151'
                    : '#111827'
                  : selectedFilter === filter.id
                  ? '#E2E8F0'
                  : 'white',
              },
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Ionicons
              name={filter.icon as any}
              size={20}
              color={
                selectedFilter === filter.id
                  ? '#00B288'
                  : isDark
                  ? '#9CA3AF'
                  : '#64748B'
              }
            />
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === filter.id
                      ? '#00B288'
                      : isDark
                      ? '#9CA3AF'
                      : '#64748B',
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.messageContainer}>
          <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>
            Loading tasks...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>{error}</Text>
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>
            No tasks found
          </Text>
        </View>
      ) : (
        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                { backgroundColor: isDark ? '#111827' : 'white' },
              ]}
              onPress={() => handleTaskPress(task)}
            >
              <View style={styles.taskHeader}>
                <View
                  style={[
                    styles.taskTypeTag,
                    {
                      backgroundColor:
                        task.tasks.task_type === 'Easy'
                          ? '#10B98120'
                          : task.tasks.task_type === 'Medium'
                          ? '#F59E0B20'
                          : '#EF444420',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.taskTypeText,
                      {
                        color:
                          task.tasks.task_type === 'Easy'
                            ? '#10B981'
                            : task.tasks.task_type === 'Medium'
                            ? '#F59E0B'
                            : '#EF4444',
                      },
                    ]}
                  >
                    {task.tasks.task_type}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor:
                        task.status === 'Completed'
                          ? '#10B98120'
                          : task.status === 'In Progress'
                          ? '#3B82F620'
                          : '#6B728020',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          task.status === 'Completed'
                            ? '#10B981'
                            : task.status === 'In Progress'
                            ? '#3B82F6'
                            : '#6B7280',
                      },
                    ]}
                  >
                    {task.status}
                  </Text>
                </View>
              </View>

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
                numberOfLines={2}
              >
                {task.tasks.description}
              </Text>

              <View style={styles.taskFooter}>
                <View style={styles.impactContainer}>
                  <View style={styles.impactItem}>
                    <Ionicons name="leaf" size={16} color="#10B981" />
                    <Text
                      style={[
                        styles.impactText,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      {task.tasks.co2_impact}kg CO₂
                    </Text>
                  </View>
                  <View style={styles.impactItem}>
                    <Ionicons name="water" size={16} color="#3B82F6" />
                    <Text
                      style={[
                        styles.impactText,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      {task.tasks.water_impact}L
                    </Text>
                  </View>
                  <View style={styles.impactItem}>
                    <Ionicons name="flash" size={16} color="#F59E0B" />
                    <Text
                      style={[
                        styles.impactText,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      {task.tasks.energy_impact}kWh
                    </Text>
                  </View>
                </View>

                <View style={styles.pointsContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text
                    style={[
                      styles.pointsText,
                      { color: isDark ? '#fff' : '#1F2937' },
                    ]}
                  >
                    {task.tasks.points} points
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedTask && (
        <TaskDetailsDialog
          isVisible={isDialogVisible}
          onClose={() => setIsDialogVisible(false)}
          onComplete={handleTaskComplete}
          task={selectedTask}
        />
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 12,
    gap: 8,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontWeight: '500',
    fontSize: 14,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tasksList: {
    padding: 20,
    gap: 16,
  },
  taskCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskTypeTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  taskTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  impactText: {
    fontSize: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
