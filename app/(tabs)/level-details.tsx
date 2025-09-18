import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { academicStructure } from '@/data/academicStructure';
import { Colors } from '@/constants/Colors';
import { BookOpen, Clock, ChevronLeft } from 'lucide-react-native';

interface Course {
  code: string;
  title: string;
  credits: number;
  type: string;
}

interface LevelData {
  [key: string]: {
    [key: string]: Course[];
  };
}

interface ProgramData {
  name: string;
  courses: LevelData;
}

interface DepartmentData {
  name: string;
  programs: {
    [key: string]: ProgramData;
  };
}

interface SchoolData {
  name: string;
  departments: {
    [key: string]: DepartmentData;
  };
}

interface AcademicStructure {
  schools: {
    [key: string]: SchoolData;
  };
}

export default function LevelDetailsScreen() {
  const router = useRouter();
  const { programmeId, level } = useLocalSearchParams();
  
  // Find the programme and level details from the academic structure
  const programme = Object.values(academicStructure.schools.physical_mathematical_sciences.departments)
    .flatMap((dept: DepartmentData) => Object.entries(dept.programs))
    .find(([id]) => id === programmeId)?.[1];
    
  if (!programme) {
    return (
      <View style={styles.container}>
        <Text>Programme not found</Text>
      </View>
    );
  }
  
  const levelKey = `level_${level}`;
  const levelData = programme.courses[levelKey];
  
  if (!levelData) {
    return (
      <View style={styles.container}>
        <Text>Level data not found</Text>
      </View>
    );
  }
  
  const semester1Courses = levelData.semester_1 || [];
  const semester2Courses = levelData.semester_2 || [];
  const semester1Electives = levelData.semester_1_electives || [];
  const semester2Electives = levelData.semester_2_electives || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.light.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Level {level}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>First Semester</Text>
          {semester1Courses.length > 0 && (
            <View style={styles.semesterContainer}>
              <Text style={styles.courseType}>Core Courses</Text>
              {semester1Courses.map((course: Course, index: number) => (
                <View key={index} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseCode}>{course.code}</Text>
                    <Text style={styles.courseCredits}>{course.credits} credits</Text>
                  </View>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                </View>
              ))}
              
              {semester1Electives.length > 0 && (
                <>
                  <Text style={[styles.courseType, { marginTop: 16 }]}>Electives (Choose 1)</Text>
                  {semester1Electives.map((course: Course, index: number) => (
                    <View key={`elective-${index}`} style={[styles.courseCard, styles.electiveCard]}>
                      <View style={styles.courseHeader}>
                        <Text style={styles.courseCode}>{course.code}</Text>
                        <Text style={styles.courseCredits}>{course.credits} credits</Text>
                      </View>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>
        
        <View style={[styles.section, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Second Semester</Text>
          {semester2Courses.length > 0 && (
            <View style={styles.semesterContainer}>
              <Text style={styles.courseType}>Core Courses</Text>
              {semester2Courses.map((course: Course, index: number) => (
                <View key={index} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseCode}>{course.code}</Text>
                    <Text style={styles.courseCredits}>{course.credits} credits</Text>
                  </View>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                </View>
              ))}
              
              {semester2Electives.length > 0 && (
                <>
                  <Text style={[styles.courseType, { marginTop: 16 }]}>Electives (Choose 1)</Text>
                  {semester2Electives.map((course: Course, index: number) => (
                    <View key={`elective-${index}`} style={[styles.courseCard, styles.electiveCard]}>
                      <View style={styles.courseHeader}>
                        <Text style={styles.courseCode}>{course.code}</Text>
                        <Text style={styles.courseCredits}>{course.credits} credits</Text>
                      </View>
                      <Text style={styles.courseTitle}>{course.title}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <BookOpen size={20} color={Colors.light.primary} />
            <Text style={styles.summaryText}>
              {semester1Courses.length + semester2Courses.length} Core Courses
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Clock size={20} color={Colors.light.secondary} />
            <Text style={styles.summaryText}>
              Total Credits: {
                semester1Courses.reduce((sum: number, course: Course) => sum + course.credits, 0) +
                semester2Courses.reduce((sum: number, course: Course) => sum + course.credits, 0)
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 12,
  },
  semesterContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
  },
  courseType: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text.secondary,
    marginBottom: 8,
  },
  courseCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  electiveCard: {
    borderLeftColor: Colors.light.accent,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  courseCredits: {
    fontSize: 14,
    color: Colors.light.text.secondary,
  },
  courseTitle: {
    fontSize: 14,
    color: Colors.light.text.primary,
  },
  summaryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.light.text.primary,
    marginLeft: 8,
  },
});
