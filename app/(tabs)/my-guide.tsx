import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { mockHandbooks, mockProgrammes, mockLevels } from '@/data/mockData';
import { BookOpen, ChevronDown, CircleCheck as CheckCircle, Circle, Award, Users, Clock } from 'lucide-react-native';
import { Handbook, Programme, Level, Course } from '@/types';

export default function MyGuideScreen() {
  const [selectedHandbook, setSelectedHandbook] = useState<Handbook | null>(null);
  const [selectedProgramme, setProgramme] = useState<Programme | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showHandbookPicker, setShowHandbookPicker] = useState(false);
  const [showProgrammePicker, setShowProgrammePicker] = useState(false);

  const renderHandbookSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Handbook</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowHandbookPicker(true)}
      >
        <View style={styles.pickerContent}>
          <BookOpen size={20} color={Colors.light.primary} />
          <Text style={styles.pickerText}>
            {selectedHandbook ? selectedHandbook.title : 'Choose a handbook...'}
          </Text>
        </View>
        <ChevronDown size={20} color={Colors.light.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderProgrammeSelection = () => {
    if (!selectedHandbook) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Programme</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowProgrammePicker(true)}
        >
          <View style={styles.pickerContent}>
            <Award size={20} color={Colors.light.secondary} />
            <Text style={styles.pickerText}>
              {selectedProgramme ? selectedProgramme.title : 'Choose a programme...'}
            </Text>
          </View>
          <ChevronDown size={20} color={Colors.light.text.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLevels = () => {
    if (!selectedProgramme) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Programme Levels</Text>
        <View style={styles.levelsGrid}>
          {mockLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selectedLevel?.id === level.id && styles.levelCardSelected
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>{level.name}</Text>
                <Text style={styles.levelStats}>
                  {level.coreCourses.length + level.electiveCourses.length} courses
                </Text>
              </View>
              <View style={styles.coursesSummary}>
                <View style={styles.courseSummaryItem}>
                  <Circle size={8} color={Colors.light.primary} />
                  <Text style={styles.courseSummaryText}>
                    {level.coreCourses.length} Core
                  </Text>
                </View>
                <View style={styles.courseSummaryItem}>
                  <Circle size={8} color={Colors.light.accent} />
                  <Text style={styles.courseSummaryText}>
                    {level.electiveCourses.length} Elective
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderCourses = () => {
    if (!selectedLevel) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{selectedLevel.name} Courses</Text>
        
        {selectedLevel.coreCourses.length > 0 && (
          <>
            <Text style={styles.courseGroupTitle}>Core Courses (Required)</Text>
            {selectedLevel.coreCourses.map((course) => (
              <CourseCard key={course.id} course={course} type="core" />
            ))}
          </>
        )}

        {selectedLevel.electiveCourses.length > 0 && (
          <>
            <Text style={[styles.courseGroupTitle, { marginTop: 24 }]}>
              Elective Courses (Choose from options)
            </Text>
            {selectedLevel.electiveCourses.map((course) => (
              <CourseCard key={course.id} course={course} type="elective" />
            ))}
          </>
        )}
      </View>
    );
  };

  const CourseCard = ({ course, type }: { course: Course; type: 'core' | 'elective' }) => (
    <View style={[styles.courseCard, type === 'core' ? styles.coreCard : styles.electiveCard]}>
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseCode}>{course.code}</Text>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseCredits}>{course.credits} credits</Text>
          <View style={[
            styles.courseTypeTag,
            type === 'core' ? styles.coreTag : styles.electiveTag
          ]}>
            <Text style={[
              styles.courseTypeText,
              type === 'core' ? styles.coreTagText : styles.electiveTagText
            ]}>
              {type.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.courseDescription}>{course.description}</Text>
      {course.prerequisites && course.prerequisites.length > 0 && (
        <View style={styles.prerequisites}>
          <Text style={styles.prerequisitesTitle}>Prerequisites:</Text>
          <Text style={styles.prerequisitesText}>
            {course.prerequisites.join(', ')}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Guide</Text>
        <Text style={styles.headerSubtitle}>Choose your academic path</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderHandbookSelection()}
        {renderProgrammeSelection()}
        {renderLevels()}
        {renderCourses()}
      </ScrollView>

      {/* Handbook Picker Modal */}
      <Modal
        visible={showHandbookPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Handbook</Text>
            <TouchableOpacity
              onPress={() => setShowHandbookPicker(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {mockHandbooks.map((handbook) => (
              <TouchableOpacity
                key={handbook.id}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedHandbook(handbook);
                  setProgramme(null);
                  setSelectedLevel(null);
                  setShowHandbookPicker(false);
                }}
              >
                <BookOpen size={24} color={Colors.light.primary} />
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{handbook.title}</Text>
                  <Text style={styles.modalItemSubtitle}>Year {handbook.year}</Text>
                </View>
                {selectedHandbook?.id === handbook.id && (
                  <CheckCircle size={24} color={Colors.light.success} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Programme Picker Modal */}
      <Modal
        visible={showProgrammePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Programme</Text>
            <TouchableOpacity
              onPress={() => setShowProgrammePicker(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedHandbook?.programmes.map((programme) => (
              <TouchableOpacity
                key={programme.id}
                style={styles.modalItem}
                onPress={() => {
                  setProgramme(programme);
                  setSelectedLevel(null);
                  setShowProgrammePicker(false);
                }}
              >
                <Award size={24} color={Colors.light.secondary} />
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>{programme.title}</Text>
                  <Text style={styles.modalItemSubtitle}>{programme.duration}</Text>
                </View>
                {selectedProgramme?.id === programme.id && (
                  <CheckCircle size={24} color={Colors.light.success} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.light.text.primary,
    marginLeft: 12,
  },
  levelsGrid: {
    gap: 12,
  },
  levelCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardSelected: {
    borderColor: Colors.light.primary,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  levelStats: {
    fontSize: 12,
    color: Colors.light.text.muted,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  coursesSummary: {
    flexDirection: 'row',
    gap: 16,
  },
  courseSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseSummaryText: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
  courseGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 12,
  },
  courseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  coreCard: {
    backgroundColor: Colors.light.primary + '05',
    borderColor: Colors.light.primary + '20',
  },
  electiveCard: {
    backgroundColor: Colors.light.accent + '05',
    borderColor: Colors.light.accent + '20',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  courseDetails: {
    alignItems: 'flex-end',
  },
  courseCredits: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    marginBottom: 6,
  },
  courseTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coreTag: {
    backgroundColor: Colors.light.primary,
  },
  electiveTag: {
    backgroundColor: Colors.light.accent,
  },
  courseTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  coreTagText: {
    color: 'white',
  },
  electiveTagText: {
    color: 'white',
  },
  courseDescription: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  prerequisites: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  prerequisitesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text.secondary,
    marginRight: 6,
  },
  prerequisitesText: {
    fontSize: 12,
    color: Colors.light.text.muted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  modalContent: {
    flex: 1,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 4,
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
});