import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { mockHandbooks } from '@/data/mockData';
import { Search, BookOpen, TrendingUp, Users, Award, Bell } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHandbooks = mockHandbooks.filter(handbook =>
    handbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    handbook.year.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'Student'}!</Text>
              <Text style={styles.subtitle}>Ready to explore your programmes?</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color={Colors.light.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={Colors.light.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search handbooks..."
              placeholderTextColor={Colors.light.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <BookOpen size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Programmes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users size={24} color={Colors.light.secondary} />
            </View>
            <Text style={styles.statNumber}>2.4k</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Award size={24} color={Colors.light.accent} />
            </View>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Handbooks</Text>
          <Text style={styles.sectionSubtitle}>Browse available programme guides</Text>
          
          <View style={styles.handbooksGrid}>
            {filteredHandbooks.map((handbook) => (
              <TouchableOpacity
                key={handbook.id}
                style={styles.handbookCard}
                onPress={() => router.push('/my-guide')}
              >
                <View style={styles.handbookIcon}>
                  <BookOpen size={32} color={Colors.light.primary} />
                </View>
                <View style={styles.handbookContent}>
                  <Text style={styles.handbookTitle}>{handbook.title}</Text>
                  <Text style={styles.handbookYear}>Year {handbook.year}</Text>
                  <Text style={styles.handbookDescription} numberOfLines={2}>
                    {handbook.description}
                  </Text>
                  <View style={styles.handbookStats}>
                    <Text style={styles.handbookStat}>
                      {handbook.programmes.length} programmes
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/my-guide')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                <BookOpen size={24} color={Colors.light.primary} />
              </View>
              <Text style={styles.actionTitle}>My Guide</Text>
              <Text style={styles.actionDescription}>Access your personalized programme guide</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/calculator')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.light.accent + '20' }]}>
                <TrendingUp size={24} color={Colors.light.accent} />
              </View>
              <Text style={styles.actionTitle}>GPA Calculator</Text>
              <Text style={styles.actionDescription}>Calculate your academic performance</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text.secondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text.primary,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    marginBottom: 20,
  },
  handbooksGrid: {
    gap: 16,
  },
  handbookCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  handbookIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.light.primary + '20',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  handbookContent: {
    flex: 1,
  },
  handbookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 4,
  },
  handbookYear: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  handbookDescription: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  handbookStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handbookStat: {
    fontSize: 12,
    color: Colors.light.text.muted,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});