import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Bell, Moon, Download, Share, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import QuickAdd from '@/components/QuickAdd';

export default function Settings() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => router.push('/(auth)/welcome')
        }
      ]
    );
  };

  const settingsItems = [
    {
      icon: User,
      title: 'PROFILE',
      subtitle: 'MANAGE YOUR ACCOUNT',
      action: () => {},
    },
    {
      icon: Bell,
      title: 'NOTIFICATIONS',
      subtitle: 'WRITING REMINDERS & UPDATES',
      action: () => {},
    },
    {
      icon: Moon,
      title: 'DARK MODE',
      subtitle: 'TOGGLE THEME',
      action: () => {},
    },
    {
      icon: Download,
      title: 'EXPORT IDEAS',
      subtitle: 'DOWNLOAD YOUR CONTENT',
      action: () => {},
    },
    {
      icon: Share,
      title: 'SHARE APP',
      subtitle: 'TELL OTHER WRITERS',
      action: () => {},
    },
    {
      icon: HelpCircle,
      title: 'HELP & SUPPORT',
      subtitle: 'GET ASSISTANCE',
      action: () => {},
    },
  ];

  const handleQuickSave = async (ideaText: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      
      if (success) {
        console.log('Saved quick idea from settings:', ideaText);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to save quick idea:', error);
      return false;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>SETTINGS</Text>
        </View>
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitle}>CUSTOMIZE YOUR EXPERIENCE</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>JOHN DOE</Text>
              <Text style={styles.profileEmail}>JOHN@EXAMPLE.COM</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.settingItem,
                index === settingsItems.length - 1 && styles.settingItemLast
              ]}
              onPress={item.action}
            >
              <View style={styles.settingIcon}>
                <item.icon color="#000000" size={20} strokeWidth={3} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.chevronBox}>
                <ChevronRight color="#000000" size={16} strokeWidth={3} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut color="#DAA520" size={20} strokeWidth={3} />
            <Text style={styles.logoutText}>SIGN OUT</Text>
            <View style={styles.logoutShadow} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBox}>
            <Text style={styles.footerText}>IDEAWEB V1.0.0</Text>
            <Text style={styles.footerSubtext}>INSPIRED BY ANANSI'S WISDOM</Text>
          </View>
        </View>
      </ScrollView>
      
      <QuickAdd onSave={handleQuickSave} />
    </View>
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
    paddingBottom: 20,
  },
  titleBox: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
    transform: [{ rotate: '-2deg' }],
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 2,
    textTransform: 'uppercase',
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 20,
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#DAA520',
    borderWidth: 3,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  profileEmail: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    backgroundColor: '#DAA520',
    borderWidth: 2,
    borderColor: '#000000',
    padding: 8,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  settingSubtitle: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  chevronBox: {
    backgroundColor: '#DAA520',
    borderWidth: 2,
    borderColor: '#000000',
    padding: 4,
  },
  logoutSection: {
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    paddingVertical: 16,
    position: 'relative',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DAA520',
    marginLeft: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  logoutShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#8B4513',
    zIndex: -1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerSubtext: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});