import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { useTheme } from '../context/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

type Task = {
  id: string;
  title: string;
  task_type: string;
  description: string;
  points: number;
  co2_impact: number;
  energy_impact: number;
  water_impact: number;
  frequency: string;
  status: string;
};

type TaskDetailsDialogProps = {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
  task: Task;
};

export default function TaskDetailsDialog({ 
  isVisible, 
  onClose, 
  onComplete, 
  task
}: TaskDetailsDialogProps) {
  const { isDark } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const recordingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();

    return () => {
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      setError(null);

      if (!hasPermission) {
        setError('Camera permission not granted');
        return;
      }

      const video = await cameraRef.current.recordAsync({
        maxDuration: 5,
        quality: '720p',
        mute: false
      });

      setVideoUri(video.uri);

      // Auto-stop after 5 seconds
      recordingTimeout.current = setTimeout(() => {
        stopRecording();
      }, 5000);

    } catch (err) {
      console.error('Error recording:', err);
      setError('Failed to record video');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
      
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording');
    }
  };

  const handleSaveVideo = async () => {
    if (!videoUri) return;

    try {
      setUploading(true);
      setError(null);

      // Read the video file
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      if (!fileInfo.exists) {
        throw new Error('Video file not found');
      }

      // Convert video to blob
      const response = await fetch(videoUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileName = `task-${task.id}-${Date.now()}.mp4`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('task-videos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl }, error: urlError } = await supabase.storage
        .from('task-videos')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;

      // Update task with video URL and status
      const { error: updateError } = await supabase
        .from('user_tasks')
        .update({ 
          status: 'In Progress',
          video_url: publicUrl
        })
        .eq('id', task.id);

      if (updateError) throw updateError;

      // Clean up local video file
      await FileSystem.deleteAsync(videoUri, { idempotent: true });

      onComplete();
    } catch (err) {
      console.error('Error saving video:', err);
      setError('Failed to save video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleCameraType = () => {
    setType(current => (
      current === CameraType.back ? CameraType.front : CameraType.back
    ));
  };

  if (Platform.OS === 'web') {
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
              {task.title}
            </Text>
            
            <Text style={[
              styles.description,
              { color: isDark ? '#9CA3AF' : '#64748B' }
            ]}>
              {task.description}
            </Text>

            {task.status === 'Not Started' && (
              <View style={styles.webNotice}>
                <Ionicons name="information-circle" size={24} color="#F59E0B" />
                <Text style={styles.webNoticeText}>
                  Video recording is only available on mobile devices. Please use the mobile app to record your task completion.
                </Text>
              </View>
            )}

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
                  Close
                </Text>
              </TouchableOpacity>
              
              {task.status === 'In Progress' && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.completeButton,
                  ]}
                  onPress={onComplete}
                >
                  <Text style={styles.completeButtonText}>
                    Complete Task
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  if (hasPermission === null) {
    return null;
  }

  if (hasPermission === false) {
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
            <Text style={[styles.title, { color: isDark ? '#fff' : '#1F2937' }]}>
              Camera Permission Required
            </Text>
            <Text style={[styles.description, { color: isDark ? '#9CA3AF' : '#64748B' }]}>
              Please grant camera permission to record task completion videos.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isDark ? '#374151' : '#F1F5F9' }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#1F2937' }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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
            {task.title}
          </Text>
          
          <Text style={[
            styles.description,
            { color: isDark ? '#9CA3AF' : '#64748B' }
          ]}>
            {task.description}
          </Text>

          {task.status === 'Not Started' && (
            <View style={styles.cameraContainer}>
              {!videoUri ? (
                <>
                  <Camera
                    ref={cameraRef}
                    style={styles.camera}
                    type={type}
                  />
                  <TouchableOpacity 
                    style={styles.flipButton}
                    onPress={toggleCameraType}
                  >
                    <Ionicons name="camera-reverse" size={24} color="white" />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewText}>Video recorded!</Text>
                  {uploading && (
                    <Text style={styles.uploadingText}>Uploading video...</Text>
                  )}
                </View>
              )}

              <View style={styles.cameraControls}>
                {!videoUri ? (
                  <TouchableOpacity
                    style={[
                      styles.recordButton,
                      isRecording && styles.recordingButton
                    ]}
                    onPress={isRecording ? stopRecording : startRecording}
                    disabled={isRecording}
                  >
                    <Ionicons
                      name={isRecording ? 'stop' : 'videocam'}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      uploading && styles.disabledButton
                    ]}
                    onPress={handleSaveVideo}
                    disabled={uploading}
                  >
                    <Text style={styles.saveButtonText}>
                      {uploading ? 'Saving...' : 'Save Video'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isDark ? '#374151' : '#F1F5F9' }
              ]}
              onPress={onClose}
              disabled={uploading}
            >
              <Text style={[
                styles.buttonText,
                { color: isDark ? '#fff' : '#1F2937' }
              ]}>
                Close
              </Text>
            </TouchableOpacity>
            
            {task.status === 'In Progress' && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.completeButton,
                ]}
                onPress={onComplete}
              >
                <Text style={styles.completeButtonText}>
                  Complete Task
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
    maxWidth: 480,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  webNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  webNoticeText: {
    flex: 1,
    color: '#F59E0B',
    fontSize: 14,
    lineHeight: 20,
  },
  cameraContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  flipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#00B288',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  uploadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.1 }],
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#00B288',
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
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
  completeButton: {
    backgroundColor: '#00B288',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});