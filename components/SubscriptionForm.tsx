import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

type SubscriptionFormProps = {
  plan: Plan;
  onBack: () => void;
  onSubmit: () => void;
};

export default function SubscriptionForm({
  plan,
  onBack,
  onSubmit,
}: SubscriptionFormProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleSubmit = () => {
    // Format phone number to include +63 prefix
    const formattedData = {
      ...formData,
      contactNumber: `+63${formData.contactNumber}`,
    };

    // In a real app, you would validate and process the payment here
    onSubmit();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? '#fff' : '#1F2937'}
        />
        <Text style={[styles.backText, { color: isDark ? '#fff' : '#1F2937' }]}>
          Back to Plans
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? '#fff' : '#1F2937' }]}>
        Complete Your Subscription
      </Text>

      <View
        style={[
          styles.planSummary,
          { backgroundColor: isDark ? '#111827' : 'white' },
        ]}
      >
        <Text style={[styles.planName, { color: isDark ? '#fff' : '#1F2937' }]}>
          {plan.name}
        </Text>
        <Text
          style={[styles.planPrice, { color: isDark ? '#00B288' : '#00B288' }]}
        >
          ${plan.price}/month
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1F2937' }]}
        >
          Personal Information
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                color: isDark ? '#fff' : '#1F2937',
              },
            ]}
            placeholder="First Name"
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                color: isDark ? '#fff' : '#1F2937',
              },
            ]}
            placeholder="Last Name"
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
          />
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
              color: isDark ? '#fff' : '#1F2937',
            },
          ]}
          placeholder="Complete Address"
          placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <View style={styles.phoneInputContainer}>
          <View
            style={[
              styles.phonePrefix,
              { backgroundColor: isDark ? '#374151' : '#E2E8F0' },
            ]}
          >
            <Text
              style={[
                styles.phonePrefixText,
                { color: isDark ? '#fff' : '#1F2937' },
              ]}
            >
              +63
            </Text>
          </View>
          <TextInput
            style={[
              styles.phoneInput,
              {
                backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                color: isDark ? '#fff' : '#1F2937',
              },
            ]}
            placeholder="Contact Number"
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={formData.contactNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, contactNumber: text })
            }
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#1F2937' }]}
        >
          Payment Details
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
              color: isDark ? '#fff' : '#1F2937',
            },
          ]}
          placeholder="Card Number"
          placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
          value={formData.cardNumber}
          onChangeText={(text) =>
            setFormData({ ...formData, cardNumber: text })
          }
          keyboardType="numeric"
        />

        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                color: isDark ? '#fff' : '#1F2937',
              },
            ]}
            placeholder="MM/YY"
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={formData.expiryDate}
            onChangeText={(text) =>
              setFormData({ ...formData, expiryDate: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1F2937' : '#F1F5F9',
                color: isDark ? '#fff' : '#1F2937',
              },
            ]}
            placeholder="CVV"
            placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
            value={formData.cvv}
            onChangeText={(text) => setFormData({ ...formData, cvv: text })}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: '#00B288' }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Subscribe Now</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 24,
  },
  planSummary: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  phonePrefix: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonePrefixText: {
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
