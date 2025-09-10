import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // TODO: Implement actual signup logic
    Alert.alert('Success', 'Account created successfully!', [
      { text: 'OK', onPress: () => router.push('/(tabs)') }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#000000" size={28} strokeWidth={3} />
          </TouchableOpacity>
          
          <View style={styles.titleBox}>
            <Text style={styles.title}>JOIN{'\n'}IDEAWEB</Text>
          </View>
          
          <View style={styles.subtitleBox}>
            <Text style={styles.subtitle}>START YOUR WRITING JOURNEY</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <User color="#000000" size={20} strokeWidth={3} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="FULL NAME"
                placeholderTextColor="#666"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <Mail color="#000000" size={20} strokeWidth={3} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="EMAIL ADDRESS"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <Lock color="#000000" size={20} strokeWidth={3} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="PASSWORD"
                placeholderTextColor="#666"
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? 
                  <EyeOff color="#000000" size={20} strokeWidth={3} /> : 
                  <Eye color="#000000" size={20} strokeWidth={3} />
                }
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <Lock color="#000000" size={20} strokeWidth={3} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="CONFIRM PASSWORD"
                placeholderTextColor="#666"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? 
                  <EyeOff color="#000000" size={20} strokeWidth={3} /> : 
                  <Eye color="#000000" size={20} strokeWidth={3} />
                }
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpButtonText}>CREATE ACCOUNT</Text>
            <View style={styles.buttonShadow} />
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>ALREADY HAVE AN ACCOUNT? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
              <Text style={styles.loginLink}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAA520',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 12,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  titleBox: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
    transform: [{ rotate: '-1deg' }],
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 32,
  },
  subtitleBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    transform: [{ rotate: '1deg' }],
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconBox: {
    backgroundColor: '#DAA520',
    borderRightWidth: 3,
    borderRightColor: '#000000',
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eyeButton: {
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
    backgroundColor: '#DAA520',
  },
  signUpButton: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  signUpButtonText: {
    color: '#DAA520',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#8B4513',
    zIndex: -1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loginLink: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
    textDecorationColor: '#000000',
    textDecorationStyle: 'solid',
  },
});