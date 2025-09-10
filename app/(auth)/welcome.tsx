import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { PenTool, BookOpen, Lightbulb } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <PenTool color="#000000" size={56} strokeWidth={3} />
          </View>
          <Text style={styles.logoText}>IDEAWEB</Text>
        </View>
        <View style={styles.taglineBox}>
          <Text style={styles.tagline}>WHERE STORIES BEGIN</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>CAPTURE{'\n'}EVERY{'\n'}SPARK</Text>
          <View style={styles.heroSubtitleBox}>
            <Text style={styles.heroSubtitle}>
              YOUR IDEAS DESERVE A HOME. STORE, ORGANIZE, AND NURTURE YOUR CREATIVE THOUGHTS WITH THE WISDOM OF ANANSI.
            </Text>
          </View>
        </View>

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <Lightbulb color="#000000" size={40} strokeWidth={3} />
            </View>
            <Text style={styles.featureTitle}>QUICK{'\n'}CAPTURE</Text>
            <Text style={styles.featureText}>SAVE IDEAS INSTANTLY</Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <BookOpen color="#000000" size={40} strokeWidth={3} />
            </View>
            <Text style={styles.featureTitle}>ORGANIZE</Text>
            <Text style={styles.featureText}>WEAVE YOUR THOUGHTS</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.primaryButtonText}>START WRITING</Text>
          <View style={styles.buttonShadow} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/signin')}
        >
          <Text style={styles.secondaryButtonText}>I ALREADY HAVE AN ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAA520',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    backgroundColor: '#DAA520',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 16,
    transform: [{ rotate: '-2deg' }],
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  taglineBox: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    transform: [{ rotate: '1deg' }],
  },
  tagline: {
    fontSize: 14,
    color: '#DAA520',
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -2,
    lineHeight: 44,
    textTransform: 'uppercase',
  },
  heroSubtitleBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 20,
    maxWidth: 320,
    transform: [{ rotate: '-1deg' }],
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    position: 'relative',
  },
  featureIconBox: {
    backgroundColor: '#DAA520',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 12,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    lineHeight: 18,
  },
  featureText: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  primaryButtonText: {
    color: '#DAA520',
    fontSize: 18,
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
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});