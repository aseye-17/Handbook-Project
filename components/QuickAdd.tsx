import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Plus, X, Check, RotateCcw } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface QuickAddProps {
  onSave: (idea: string) => Promise<boolean>;
}

export default function QuickAdd({ onSave }: QuickAddProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayTranslateY = useRef(new Animated.Value(10)).current;
  const fabScale = useRef(new Animated.Value(1)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const inputRef = useRef<TextInput>(null);

  // Hotkey listener for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
          event.preventDefault();
          openQuickAdd();
        }
        if (event.key === 'Escape' && isVisible) {
          closeQuickAdd();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  const openQuickAdd = () => {
    setIsVisible(true);
    setError('');
    setIdea('');
    
    // Animate overlay in
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      inputRef.current?.focus();
    });
  };

  const closeQuickAdd = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayTranslateY, {
        toValue: 10,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      setError('');
      setIdea('');
    });
  };

  const handleSave = async () => {
    if (!idea.trim()) {
      setError('PLEASE ENTER AN IDEA');
      shakeInput();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onSave(idea.trim());
      
      if (success) {
        closeQuickAdd();
        showSuccessToast();
      } else {
        setError('FAILED TO SAVE. CHECK CONNECTION OR TRY AGAIN.');
        shakeInput();
      }
    } catch (err) {
      setError('FAILED TO SAVE. CHECK CONNECTION OR TRY AGAIN.');
      shakeInput();
    } finally {
      setIsLoading(false);
    }
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showSuccessToast = () => {
    setShowToast(true);
    
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowToast(false);
        toastTranslateY.setValue(20);
      });
    }, 2000);
  };

  const handleFabPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    openQuickAdd();
  };

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View 
        style={[
          styles.fab,
          {
            transform: [{ scale: fabScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <Plus color="#DAA520" size={28} strokeWidth={4} />
        </TouchableOpacity>
      </Animated.View>

      {/* Overlay */}
      {isVisible && (
        <View style={styles.overlayContainer}>
          <View style={styles.backdrop} />
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
                transform: [
                  { translateY: overlayTranslateY },
                  { translateX: shakeAnimation },
                ],
              },
            ]}
          >
            <View style={styles.overlayHeader}>
              <Text style={styles.overlayTitle}>QUICK ADD IDEA</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeQuickAdd}
              >
                <X color="#000000" size={20} strokeWidth={3} />
              </TouchableOpacity>
            </View>

            <View style={[
              styles.inputContainer,
              error && styles.inputContainerError
            ]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="JOT DOWN YOUR IDEA..."
                placeholderTextColor="#666"
                value={idea}
                onChangeText={setIdea}
                multiline
                maxLength={200}
                onSubmitEditing={handleSave}
                blurOnSubmit={false}
              />
            </View>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <View style={styles.inputMeta}>
              <Text style={styles.characterCount}>
                {idea.length}/200 CHARACTERS
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isLoading && styles.saveButtonLoading
                ]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RotateCcw color="#DAA520" size={20} strokeWidth={3} />
                ) : error ? (
                  <>
                    <RotateCcw color="#DAA520" size={20} strokeWidth={3} />
                    <Text style={styles.saveButtonText}>RETRY</Text>
                  </>
                ) : (
                  <Text style={styles.saveButtonText}>SAVE IDEA</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Success Toast */}
      {showToast && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }],
            },
          ]}
        >
          <Check color="#000000" size={20} strokeWidth={3} />
          <Text style={styles.toastText}>IDEA SAVED!</Text>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  fabButton: {
    width: 64,
    height: 64,
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 24,
    margin: 24,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#8B4513',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  closeButton: {
    backgroundColor: '#DAA520',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 8,
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 8,
  },
  inputContainerError: {
    borderColor: '#FF4D4F',
    borderWidth: 3,
  },
  input: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    letterSpacing: 0.3,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4D4F',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputMeta: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  characterCount: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actions: {
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    shadowColor: '#8B4513',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  saveButtonLoading: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#DAA520',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 8,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3000,
    shadowColor: '#8B4513',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    marginLeft: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});