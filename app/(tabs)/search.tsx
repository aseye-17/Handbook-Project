import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Search, Filter, Calendar, Star, Tag } from 'lucide-react-native';
import QuickAdd from '@/components/QuickAdd';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filters = ['ALL', 'RECENT', 'FAVORITES', 'FICTION', 'NON-FICTION'];

  const searchResults = [
    {
      id: '1',
      title: 'THE SPIDER\'S WEB',
      preview: 'A STORY ABOUT INTERCONNECTED LIVES...',
      category: 'FICTION',
      date: '2 HOURS AGO',
      isFavorite: true,
    },
    {
      id: '2',
      title: 'CHARACTER DEVELOPMENT',
      preview: 'NOTES ON BUILDING COMPLEX CHARACTERS...',
      category: 'NOTES',
      date: '1 DAY AGO',
      isFavorite: false,
    },
  ];

  const handleQuickSave = async (ideaText: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      
      if (success) {
        console.log('Saved quick idea from search:', ideaText);
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
          <Text style={styles.title}>SEARCH{'\n'}IDEAS</Text>
        </View>
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitle}>FIND YOUR CREATIVE THREADS</Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconBox}>
            <Search color="#000000" size={20} strokeWidth={3} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="SEARCH YOUR IDEAS..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Filter 
                color={selectedFilter === filter ? '#DAA520' : '#000000'} 
                size={16} 
                strokeWidth={3}
              />
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.results}>
        {searchResults.map((result) => (
          <TouchableOpacity key={result.id} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <View style={styles.favoriteBox}>
                <Star 
                  color="#000000" 
                  size={16}
                  strokeWidth={3}
                  fill={result.isFavorite ? '#DAA520' : 'none'}
                />
              </View>
            </View>
            
            <View style={styles.previewBox}>
              <Text style={styles.resultPreview}>{result.preview}</Text>
            </View>
            
            <View style={styles.resultMeta}>
              <View style={styles.metaItem}>
                <Tag color="#000000" size={12} strokeWidth={2} />
                <Text style={styles.metaText}>{result.category}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar color="#000000" size={12} strokeWidth={2} />
                <Text style={styles.metaText}>{result.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000000',
    marginBottom: 16,
  },
  searchIconBox: {
    backgroundColor: '#DAA520',
    borderRightWidth: 3,
    borderRightColor: '#000000',
    padding: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#000000',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    marginLeft: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterTextActive: {
    color: '#DAA520',
  },
  results: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    flex: 1,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  favoriteBox: {
    backgroundColor: '#DAA520',
    borderWidth: 2,
    borderColor: '#000000',
    padding: 6,
  },
  previewBox: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#000000',
    padding: 12,
    marginBottom: 12,
  },
  resultPreview: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DAA520',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#000000',
    marginLeft: 4,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});