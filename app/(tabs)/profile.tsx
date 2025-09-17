import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';

import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { User, Settings, Bell, Globe, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Mail, Phone, CreditCard as Edit3 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences.notifications ?? true
  );

  const handleLogout = () => {
    // On web, the native Alert can be unreliable; log out immediately
    if (Platform.OS === 'web') {
      console.log('[profile] logout clicked (web)');
      logout();
      router.replace('/(auth)');
      return;
    }
    // Native: confirm before logging out
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('[profile] logout confirmed (native)');
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  const toggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    updateUser({
      preferences: {
        ...user?.preferences,
        notifications: value,
      } as any,
    });
  };

  const profileMenuItems = [
    {
      id: 'edit-profile',
      icon: Edit3,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => {
        // Navigate to edit profile screen
        Alert.alert('Coming Soon', 'Profile editing will be available soon!');
      },
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
          thumbColor={notificationsEnabled ? 'white' : Colors.light.text.muted}
        />
      ),
    },
    {
      id: 'language',
      icon: Globe,
      title: 'Language',
      subtitle: 'English',
      onPress: () => {
        Alert.alert('Coming Soon', 'Language selection will be available soon!');
      },
    },
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => {
        Alert.alert('Coming Soon', 'Privacy settings will be available soon!');
      },
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {
        Alert.alert('Coming Soon', 'Help center will be available soon!');
      },
    },
  ];

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <View style={styles.contactInfo}>
          {user?.email && (
            <View style={styles.contactItem}>
              <Mail size={16} color={Colors.light.text.secondary} />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
          )}
          {user?.phone && (
            <View style={styles.contactItem}>
              <Phone size={16} color={Colors.light.text.secondary} />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      disabled={!item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <item.icon size={20} color={Colors.light.text.secondary} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.menuItemRight}>
        {item.rightComponent || (
          <ChevronRight size={20} color={Colors.light.text.muted} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuContainer}>
            {profileMenuItems.map(renderMenuItem)}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.light.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.appVersion}>Programme Guide v1.0.0</Text>
          <Text style={styles.footerText}>
            Made with ❤️ for students everywhere
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: Colors.light.primary,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text.primary,
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: Colors.light.text.secondary,
  },
  menuItemRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.error + '10',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  appVersion: {
    fontSize: 12,
    color: Colors.light.text.muted,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.text.muted,
    textAlign: 'center',
  },
});