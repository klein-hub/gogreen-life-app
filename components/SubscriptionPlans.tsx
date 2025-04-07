import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/theme';

type Plan = {
  id: string;
  name: string;
  price: number;
  connections: number;
  features: string[];
};

type SubscriptionPlansProps = {
  onSelectPlan: (plan: Plan) => void;
  onBack: () => void;
};

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 250,
    connections: 1,
    features: [
      'Share points with 1 person',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 350,
    connections: 6,
    features: [
      'Share points with up to 6 people',
      'Advanced analytics',
      'Priority support',
      'Exclusive rewards',
    ],
  },
];

export default function SubscriptionPlans({
  onSelectPlan,
  onBack,
}: SubscriptionPlansProps) {
  const { isDark } = useTheme();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? '#fff' : '#1F2937'}
        />
        <Text style={[styles.backText, { color: isDark ? '#fff' : '#1F2937' }]}>
          Back to Profile
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? '#fff' : '#1F2937' }]}>
        Choose Your Plan
      </Text>

      <Text
        style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#64748B' }]}
      >
        Select a plan that best fits your needs
      </Text>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              { backgroundColor: isDark ? '#111827' : 'white' },
            ]}
            onPress={() => onSelectPlan(plan)}
          >
            <View style={styles.planHeader}>
              <Text
                style={[
                  styles.planName,
                  { color: isDark ? '#fff' : '#1F2937' },
                ]}
              >
                {plan.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text
                  style={[
                    styles.currency,
                    { color: isDark ? '#9CA3AF' : '#64748B' },
                  ]}
                >
                  ₱
                </Text>
                <Text
                  style={[styles.price, { color: isDark ? '#fff' : '#1F2937' }]}
                >
                  {plan.price}
                </Text>
                <Text
                  style={[
                    styles.period,
                    { color: isDark ? '#9CA3AF' : '#64748B' },
                  ]}
                >
                  /mo
                </Text>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#00B288" />
                  <Text
                    style={[
                      styles.featureText,
                      { color: isDark ? '#9CA3AF' : '#64748B' },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.selectButton, { backgroundColor: '#00B288' }]}
              onPress={() => onSelectPlan(plan)}
            >
              <Text style={styles.selectButtonText}>Select Plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  plansContainer: {
    gap: 24,
  },
  planCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    marginBottom: 24,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 4,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
  },
  selectButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
