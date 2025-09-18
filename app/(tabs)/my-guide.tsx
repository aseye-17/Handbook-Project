import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { mockHandbooks, mockProgrammes } from '@/data/mockData';
import {
  BookOpen,
  ChevronDown,
  CircleCheck as CheckCircle,
  Circle,
  Award,
  Users,
  Clock,
  ChevronUp,
} from 'lucide-react-native';
import { Handbook, Programme } from '@/types';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import academicStructure from '@/data/academicStructure';

// Define the Course type
type Course = {
  code: string;
  title: string;
  credits: number;
  type: 'Core' | 'Elective';
  description?: string;
  prerequisites?: string[];
};

type Semester = {
  semester: number;
  courses: Course[];
  note?: string;
};

type Year = {
  level: number;
  semesters: Semester[];
};

type Program = {
  name: string;
  description: string;
  years: Year[];
  concentrations?: string[];
};

type Department = {
  name: string;
  programs: {
    [key: string]: Program;
  };
};

type School = {
  name: string;
  departments: {
    [key: string]: Department;
  };
};

type AcademicStructure = {
  schools: {
    [key: string]: School;
  };
};

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export default function MyGuideScreen() {
  const [selectedHandbook, setSelectedHandbook] = useState<Handbook | null>(null);
  const [selectedProgramme, setProgramme] = useState<Programme | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [expandedYears, setExpandedYears] = useState<{ [key: number]: boolean }>({});
  const [showHandbookPicker, setShowHandbookPicker] = useState(false);
  const [showProgrammePicker, setShowProgrammePicker] = useState(false);
  const [selectedElectives, setSelectedElectives] = useState<{ [key: string]: string[] }>({});
  const router = useRouter();

  // Toggle year expansion
  const toggleYear = (level: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  // Handle elective selection
  const handleElectiveSelect = (courseCode: string, semesterKey: string) => {
    setSelectedElectives((prev) => ({
      ...prev,
      [semesterKey]: prev[semesterKey]?.includes(courseCode)
        ? prev[semesterKey].filter((code) => code !== courseCode)
        : [...(prev[semesterKey] || []), courseCode],
    }));
  };

  // Get the current program data based on selection
  const getCurrentProgram = () => {
    if (!selectedProgramme) return null;

    const programKey = selectedProgramme.id === 'cs-bsc' ? 'single_major' : 'bsc_it';
    const department = selectedProgramme.id === 'cs-bsc' ? 'computer_science' : 'information_technology';

    return (
      academicStructure as AcademicStructure
    ).schools.physical_mathematical_sciences.departments[department]?.programs[programKey];
  };

  const currentProgram = getCurrentProgram();

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
    if (!selectedProgramme || !currentProgram) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Programme Levels</Text>
        <View style={styles.levelsContainer}>
          {currentProgram.years.map((year) => {
            const isExpanded = expandedYears[year.level];

            return (
              <View key={`year-${year.level}`} style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdownHeader}
                  onPress={() => toggleYear(year.level)}
                >
                  <Text style={styles.dropdownHeaderText}>Level {year.level}00</Text>
                  {isExpanded ? (
                    <ChevronUp size={24} color={Colors.light.text.primary} />
                  ) : (
                    <ChevronDown size={24} color={Colors.light.text.primary} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.dropdownContent}>
                    {year.semesters.map((semester) => {
                      const semesterKey = `y${year.level}s${semester.semester}`;
                      const coreCourses = semester.courses.filter((c) => c.type === 'Core');
                      const electiveCourses = semester.courses.filter((c) => c.type === 'Elective');
                      const selectedCredits = calculateSelectedCredits(semesterKey);

                      return (
                        <View key={`sem-${year.level}-${semester.semester}`} style={styles.semesterSection}>
                          <View style={styles.semesterHeader}>
                            <Text style={styles.semesterTitle}>
                              Semester {semester.semester}
                            </Text>
                            {electiveCourses.length > 0 && (
                              <Text style={styles.creditsCounter}>
                                Selected: {selectedCredits}/3 credits
                              </Text>
                            )}
                          </View>

                          {/* Core Courses */}
                          <View style={styles.courseSection}>
                            <Text style={styles.courseSectionTitle}>Core Courses</Text>
                            {coreCourses.map((course) => (
                              <View key={course.code} style={styles.courseItem}>
                                <View style={styles.courseCodeContainer}>
                                  <Text style={styles.courseCode}>{course.code}</Text>
                                  <Text style={styles.courseCredits}>{course.credits} Credits</Text>
                                </View>
                                <Text style={styles.courseTitle}>{course.title}</Text>
                                {course.prerequisites && course.prerequisites.length > 0 && (
                                  <Text style={styles.prerequisites}>
                                    Pre: {course.prerequisites.join(', ')}
                                  </Text>
                                )}
                              </View>
                            ))}
                          </View>

                          {/* Elective Courses */}
                          {electiveCourses.length > 0 && (
                            <View style={styles.courseSection}>
                              <View style={styles.electiveHeader}>
                                <Text style={styles.courseSectionTitle}>Electives</Text>
                                <Text style={styles.electiveSubtitle}>
                                  Select {3 - selectedCredits} more credits
                                </Text>
                              </View>
                              {electiveCourses.map((course) => {
                                const isSelected = selectedElectives[semesterKey]?.includes(course.code);
                                const isDisabled = selectedCredits >= 3 && !isSelected;

                                return (
                                  <Pressable
                                    key={course.code}
                                    style={[
                                      styles.electiveItem,
                                      isSelected && styles.selectedElective,
                                      isDisabled && styles.disabledElective,
                                    ]}
                                    onPress={() => !isDisabled && handleElectiveSelect(course.code, semesterKey)}
                                    disabled={isDisabled}
                                  >
                                    <View style={styles.electiveCheckbox}>
                                      {isSelected && <View style={styles.electiveCheckmark} />}
                                    </View>
                                    <View style={styles.electiveInfo}>
                                      <View style={styles.courseCodeContainer}>
                                        <Text style={styles.courseCode}>{course.code}</Text>
                                        <Text style={styles.courseCredits}>{course.credits} Credits</Text>
                                      </View>
                                      <Text style={styles.courseTitle}>{course.title}</Text>
                                    </View>
                                  </Pressable>
                                );
                              })}
                            </View>
                          )}

                          {semester.note && (
                            <Text style={styles.semesterNote}>{semester.note}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Calculate total credits selected for a semester
  const calculateSelectedCredits = (semesterKey: string) => {
    if (!selectedElectives[semesterKey]) return 0;
    return selectedElectives[semesterKey].reduce((total, courseCode) => {
      // Find the course in the program
      const course = currentProgram?.years.flatMap((y) =>
        y.semesters.flatMap((s) => s.courses.find((c) => c.code === courseCode))
      ).find(Boolean);

      return total + (course?.credits || 0);
    }, 0);
  };

  const renderHandbookPicker = () => (
    <Modal
      visible={showHandbookPicker}
      animationType="slide"
      onRequestClose={() => setShowHandbookPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Handbook</Text>
            <TouchableOpacity
              onPress={() => setShowHandbookPicker(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: '80%' }}>
            {mockHandbooks.map((handbook) => (
              <TouchableOpacity
                key={handbook.id}
                style={styles.optionItem}
                onPress={() => {
                  setSelectedHandbook(handbook);
                  setShowHandbookPicker(false);
                  setProgramme(null);
                }}
              >
                <Text style={styles.optionText}>{handbook.title}</Text>
                {selectedHandbook?.id === handbook.id && (
                  <CheckCircle size={24} color={Colors.light.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderProgrammePicker = () => (
    <Modal
      visible={showProgrammePicker}
      animationType="slide"
      onRequestClose={() => setShowProgrammePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Programme</Text>
            <TouchableOpacity
              onPress={() => setShowProgrammePicker(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: '80%' }}>
            {selectedHandbook?.programmes.map((programme) => (
              <TouchableOpacity
                key={programme.id}
                style={styles.optionItem}
                onPress={() => {
                  setProgramme(programme);
                  setShowProgrammePicker(false);
                }}
              >
                <Text style={styles.optionText}>{programme.title}</Text>
                {selectedProgramme?.id === programme.id && (
                  <CheckCircle size={24} color={Colors.light.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
      </ScrollView>

      {renderHandbookPicker()}
      {renderProgrammePicker()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  } as ViewStyle,
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  } as ViewStyle,
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  } as TextStyle,
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  } as TextStyle,
  content: {
    padding: 16,
  } as ViewStyle,
  section: {
    marginBottom: 24,
  } as ViewStyle,
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.text.primary,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  } as TextStyle,
  electiveCheckmark: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
  } as ViewStyle,
  electiveInfo: {
    flex: 1,
  } as ViewStyle,
  semesterNote: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    fontStyle: 'italic',
    marginTop: 8,
  } as TextStyle,
  pickerPlaceholder: {
    color: Colors.light.text.secondary,
    fontSize: 16,
  } as TextStyle,
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
  } as ViewStyle,
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  pickerText: {
    color: Colors.light.text.primary,
    fontSize: 16,
  } as TextStyle,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  } as ViewStyle,
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  } as ViewStyle,
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  } as ViewStyle,
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
  } as TextStyle,
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  } as ViewStyle,
  optionText: {
    fontSize: 16,
    color: Colors.light.text.primary,
  } as TextStyle,
  closeButton: {
    padding: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  closeButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  levelsContainer: {
    marginTop: 8,
  } as ViewStyle,
  dropdownContainer: {
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  } as ViewStyle,
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.surface,
  } as ViewStyle,
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.primary,
  } as TextStyle,
  dropdownContent: {
    backgroundColor: Colors.light.background,
    padding: 12,
  } as ViewStyle,
  semesterSection: {
    marginBottom: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  } as ViewStyle,
  semesterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.primary + '10',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  } as ViewStyle,
  semesterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,
  creditsCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  } as TextStyle,
  courseSection: {
    padding: 16,
    paddingTop: 0,
  } as ViewStyle,
  courseSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 8,
  } as TextStyle,
  courseItem: {
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  } as ViewStyle,
  courseCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  } as ViewStyle,
  courseCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  } as TextStyle,
  courseCredits: {
    fontSize: 12,
    color: Colors.light.text.secondary,
  } as TextStyle,
  courseTitle: {
    fontSize: 14,
    color: Colors.light.text.primary,
    marginBottom: 4,
  } as TextStyle,
  prerequisites: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    fontStyle: 'italic',
  } as TextStyle,
  electiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  electiveSubtitle: {
    fontSize: 12,
    color: Colors.light.primary,
  } as TextStyle,
  electiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  } as ViewStyle,
  selectedElective: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: Colors.light.primary,
  } as ViewStyle,
  disabledElective: {
    opacity: 0.6,
  } as ViewStyle,
  electiveCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});