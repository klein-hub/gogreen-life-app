import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/theme';
import { Ionicons } from '@expo/vector-icons';
import { Product, marketplaceService } from '../services/marketplace';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth';
import Toast from './Toast';

type MarketplaceDetailsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  product: Product | null;
};

export default function MarketplaceDetailsModal({
  isVisible,
  onClose,
  product,
}: MarketplaceDetailsModalProps) {
  const { isDark } = useTheme();
  const { session } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'success'
  );
  const isMounted = useRef(true);

  if (!product) return null;

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const showToastMessage = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    setToastMessage(message);
    setToastType(type);
    console.log('showToast');
    setShowToast(true);

    setTimeout(() => {
      if (isMounted.current) {
        setShowToast(false);
      }
    }, 3000);
  };

  const handlePurchase = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!session?.user?.id) {
        throw new Error('You must be logged in to make a purchase');
      }

      const response = await marketplaceService.purchaseProduct(
        session.user.id,
        product.id
      );

      showToastMessage(response.toString(), 'success');

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: session.user.id,
          marketplace_id: product.id,
          status: 'Pending',
        });

      if (transactionError) throw transactionError;

      // Close modal after successful purchase
      onClose();
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? '#111827' : 'white' },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? '#9CA3AF' : '#64748B'}
            />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: product?.image_url }}
              style={styles.productImage}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <View style={styles.header}>
                <Text
                  style={[styles.title, { color: isDark ? '#fff' : '#1F2937' }]}
                >
                  {product?.name}
                </Text>
                <Text style={styles.title}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  &nbsp;
                  {product?.amount}
                </Text>
              </View>
              <Text
                style={[
                  styles.description,
                  { color: isDark ? '#9CA3AF' : '#64748B' },
                ]}
              >
                {product?.description}
              </Text>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.purchaseButton,
                  isProcessing && styles.processingButton,
                ]}
                onPress={handlePurchase}
                disabled={isProcessing}
              >
                <Text style={styles.purchaseButtonText}>
                  {isProcessing ? 'Processing...' : 'Purchase Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  content: {
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00B288',
  },
  ratingContainer: {
    marginBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
  purchaseButton: {
    backgroundColor: '#00B288',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  processingButton: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
