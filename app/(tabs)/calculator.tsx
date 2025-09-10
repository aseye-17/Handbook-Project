import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { CompletedCourse, GPACalculation } from '@/types';
import { Calculator, Plus, Trash2, TrendingUp, Award, Target } from 'lucide-react-native';

export default function CalculatorScreen() {
  const [courses, setCourses] = useState<CompletedCourse[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    credits: '',
    grade: '',
    semester: '',
  });

  const gradePoints: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
  };

  const calculateGPA = (): GPACalculation => {
    if (courses.length === 0) {
      return {
        totalCredits: 0,
        totalWeightedPoints: 0,
        gpa: 0,
        courses,
      };
    }

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalWeightedPoints = courses.reduce((sum, course) => {
      const points = gradePoints[course.grade.toString()] || course.grade;
      return sum + (course.credits * points);
    }, 0);

    return {
      totalCredits,
      totalWeightedPoints,
      gpa: totalWeightedPoints / totalCredits,
      courses,
    };
  };

  const addCourse = () => {
    if (!newCourse.code || !newCourse.title || !newCourse.credits || !newCourse.grade) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const course: CompletedCourse = {
      id: Date.now().toString(),
      code: newCourse.code,
      title: newCourse.title,
      credits: parseInt(newCourse.credits),
      weight: parseInt(newCourse.credits),
      description: '',
      grade: typeof newCourse.grade === 'string' ? 
        gradePoints[newCourse.grade] || parseFloat(newCourse.grade) : 
        parseFloat(newCourse.grade),
      semester: newCourse.semester,
    };

    setCourses([...courses, course]);
    setNewCourse({
      code: '',
      title: '',
      credits: '',
      grade: '',
      semester: '',
    });
    setShowAddForm(false);
  };

  const removeCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const gpaData = calculateGPA();
  const gpaColor = gpaData.gpa >= 3.5 ? Colors.light.success : 
                   gpaData.gpa >= 2.5 ? Colors.light.warning : Colors.light.error;

  const renderGPACard = () => (
    <View style={styles.gpaCard}>
      <View style={styles.gpaHeader}>
        <View style={[styles.gpaIcon, { backgroundColor: gpaColor + '20' }]}>
          <Award size={24} color={gpaColor} />
        </View>
        <View style={styles.gpaInfo}>
          <Text style={styles.gpaLabel}>Current GPA</Text>
          <Text style={[styles.gpaValue, { color: gpaColor }]}>
            {gpaData.gpa.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.gpaStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{gpaData.totalCredits}</Text>
          <Text style={styles.statLabel}>Total Credits</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{courses.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{gpaData.totalWeightedPoints.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Grade Points</Text>
        </View>
      </View>
    </View>
  );

  const renderGradeScale = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Grade Scale Reference</Text>
      <View style={styles.gradeScale}>
        {Object.entries(gradePoints).map(([grade, points]) => (
          <View key={grade} style={styles.gradeItem}>
            <Text style={styles.gradeText}>{grade}</Text>
            <Text style={styles.pointsText}>{points.toFixed(1)}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAddForm = () => {
    if (!showAddForm) return null;

    return (
      <View style={styles.addForm}>
        <Text style={styles.formTitle}>Add Course</Text>
        
        <TextInput
          style={styles.formInput}
          placeholder="Course Code (e.g., CS101)"
          value={newCourse.code}
          onChangeText={(text) => setNewCourse({...newCourse, code: text.toUpperCase()})}
        />
        
        <TextInput
          style={styles.formInput}
          placeholder="Course Title"
          value={newCourse.title}
          onChangeText={(text) => setNewCourse({...newCourse, title: text})}
        />
        
        <View style={styles.formRow}>
          <TextInput
            style={[styles.formInput, styles.halfInput]}
            placeholder="Credits"
            value={newCourse.credits}
            onChangeText={(text) => setNewCourse({...newCourse, credits: text})}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[styles.formInput, styles.halfInput]}
            placeholder="Grade (A, B+, 3.5, etc.)"
            value={newCourse.grade}
            onChangeText={(text) => setNewCourse({...newCourse, grade: text})}
          />
        </View>
        
        <TextInput
          style={styles.formInput}
          placeholder="Semester (optional)"
          value={newCourse.semester}
          onChangeText={(text) => setNewCourse({...newCourse, semester: text})}
        />
        
        <View style={styles.formButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAddForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={addCourse}
          >
            <Text style={styles.addButtonText}>Add Course</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCoursesList = () => {
    if (courses.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Calculator size={64} color={Colors.light.text.muted} />
          <Text style={styles.emptyTitle}>No Courses Added</Text>
          <Text style={styles.emptySubtitle}>
            Add your completed courses to calculate your GPA
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Courses</Text>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseItem}>
            <View style={styles.courseHeader}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                {course.semester && (
                  <Text style={styles.courseSemester}>{course.semester}</Text>
                )}
              </View>
              
              <View style={styles.courseGrade}>
                <Text style={styles.gradeValue}>
                  {typeof course.grade === 'number' ? course.grade.toFixed(1) : course.grade}
                </Text>
                <Text style={styles.creditsValue}>{course.credits} cr</Text>
              </View>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeCourse(course.id)}
              >
                <Trash2 size={18} color={Colors.light.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GPA Calculator</Text>
        <Text style={styles.headerSubtitle}>Track your academic performance</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderGPACard()}
        {renderCoursesList()}
        {renderAddForm()}
        {renderGradeScale()}
      </ScrollView>

      {!showAddForm && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddForm(true)}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      )}
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
    paddingHorizontal: 20,
  },
  gpaCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  gpaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  gpaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gpaInfo: {
    flex: 1,
  },
  gpaLabel: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    marginBottom: 4,
  },
  gpaValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  gpaStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 16,
  },
  gradeScale: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  gradeItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  pointsText: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  courseItem: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  courseTitle: {
    fontSize: 16,
    color: Colors.light.text.primary,
    marginTop: 2,
  },
  courseSemester: {
    fontSize: 12,
    color: Colors.light.text.muted,
    marginTop: 4,
  },
  courseGrade: {
    alignItems: 'center',
    marginRight: 16,
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.success,
  },
  creditsValue: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  addForm: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 16,
  },
  formInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text.primary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text.secondary,
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: Colors.light.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});