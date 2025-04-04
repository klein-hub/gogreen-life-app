import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../context/theme';

type AlertDialogProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  customContent?: React.ReactNode;
};

export default function AlertDialog({ 
  isVisible, 
  onClose, 
  onConfirm, 
  title, 
  message,
  customContent 
}: AlertDialogProps) {
  const { isDark } = useTheme();

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.dialogContainer,
          { backgroundColor: isDark ? '#111827' : 'white' }
        ]}>
          <Text style={[
            styles.title,
            { color: isDark ? '#fff' : '#1F2937' }
          ]}>
            {title}
          </Text>
          
          {message && (
            <Text style={[
              styles.message,
              { color: isDark ? '#9CA3AF' : '#64748B' }
            ]}>
              {message}
            </Text>
          )}

          {customContent}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isDark ? '#374151' : '#F1F5F9' }
              ]}
              onPress={onClose}
            >
              <Text style={[
                styles.buttonText,
                { color: isDark ? '#fff' : '#1F2937' }
              ]}>
                {onConfirm ? 'Cancel' : 'Close'}
              </Text>
            </TouchableOpacity>
            
            {onConfirm && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  { backgroundColor: '#00B288' }
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>
                  Confirm
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#00B288',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});