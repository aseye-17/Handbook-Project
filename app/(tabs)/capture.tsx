import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Save, Tag, Lightbulb, BookOpen, Zap } from 'lucide-react-native';
import QuickAdd from '@/components/QuickAdd';
import TemplateModal from '@/components/TemplateModal';

export default function Capture() {
  const [idea, setIdea] = useState({
    title: '',
    content: '',
    category: '',
  });

  const categories = ['FICTION', 'NON-FICTION', 'SCI-FI', 'POETRY', 'ESSAY', 'OTHER'];
  const [selectedCategory, setSelectedCategory] = useState('');
  const [templateModalVisible, setTemplateModalVisible] = useState(false);

  const handleSave = () => {
    if (!idea.title || !idea.content) {
      Alert.alert('Missing Information', 'Please add both a title and content for your idea');
      return;
    }

    // TODO: Save idea to storage
    Alert.alert('Success', 'Your idea has been captured!', [
      {
        text: 'OK',
        onPress: () => {
          setIdea({ title: '', content: '', category: '' });
          setSelectedCategory('');
        }
      }
    ]);
  };

  const handleTemplateIdeaSave = async (templateId: string, data: Record<string, any>): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.1;
      
      if (success) {
        console.log('Saved template idea:', templateId, data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to save template idea:', error);
      return false;
    }
  };

  const handleQuickSave = async (ideaText: string): Promise<boolean> => {
    try {
      // TODO: Implement actual save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      
      if (success) {
        console.log('Saved quick idea:', ideaText);
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.iconBox}>
              <Lightbulb color="#000000" size={32} strokeWidth={3} />
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.title}>CAPTURE{'\n'}IDEA</Text>
            </View>
          </View>
          <View style={styles.subtitleBox}>
            <Text style={styles.subtitle}>LET YOUR CREATIVITY FLOW</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelBox}>
              <Text style={styles.label}>TITLE</Text>
            </View>
            <TextInput
              style={styles.titleInput}
              placeholder="WHAT'S YOUR IDEA ABOUT?"
              placeholderTextColor="#666"
              value={idea.title}
              onChangeText={(text) => setIdea({...idea, title: text})}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelBox}>
              <Text style={styles.label}>CATEGORY</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Tag 
                    color={selectedCategory === category ? '#DAA520' : '#000000'} 
                    size={16} 
                    strokeWidth={3}
                  />
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelBox}>
              <Text style={styles.label}>CONTENT</Text>
            </View>
            <TextInput
              style={styles.contentInput}
              placeholder="POUR YOUR THOUGHTS HERE... LET ANANSI'S WISDOM GUIDE YOUR WORDS."
              placeholderTextColor="#666"
              value={idea.content}
              onChangeText={(text) => setIdea({...idea, content: text})}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.quickActions}>
            <View style={styles.quickActionsTitle}>
              <Text style={styles.quickActionsTitleText}>QUICK ACTIONS</Text>
            </View>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity style={styles.quickAction}>
                <Zap color="#000000" size={24} strokeWidth={3} />
                <Text style={styles.quickActionText}>CHARACTER</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickAction}
                onPress={() => setTemplateModalVisible(true)}
              >
                <BookOpen color="#000000" size={24} strokeWidth={3} />
                <Text style={styles.quickActionText}>TEMPLATE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <Lightbulb color="#000000" size={24} strokeWidth={3} />
                <Text style={styles.quickActionText}>THEME</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Save color="#DAA520" size={24} strokeWidth={3} />
            <Text style={styles.saveButtonText}>SAVE IDEA</Text>
            <View style={styles.buttonShadow} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TemplateModal
        visible={templateModalVisible}
        onClose={() => setTemplateModalVisible(false)}
        onSave={handleTemplateIdeaSave}
      />
      
      <QuickAdd onSave={handleQuickSave} />
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
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    backgroundColor: '#DAA520',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 12,
    marginRight: 16,
  },
  titleBox: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 16,
    transform: [{ rotate: '-1deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 26,
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
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelBox: {
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 16,
    fontSize: 14,
    color: '#000000',
    minHeight: 60,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#000000',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    marginLeft: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categoryChipTextActive: {
    color: '#DAA520',
  },
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    padding: 16,
    fontSize: 14,
    color: '#000000',
    minHeight: 150,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  quickActions: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  quickActionsTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DAA520',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAction: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 4,
    borderColor: '#000000',
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    marginTop: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  saveButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 4,
    borderColor: '#000000',
    position: 'relative',
  },
  saveButtonText: {
    color: '#DAA520',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 12,
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
});