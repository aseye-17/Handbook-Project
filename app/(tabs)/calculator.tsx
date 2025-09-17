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
import { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { CompletedCourse, GPACalculation } from '@/types';
import { Calculator, Plus, Trash2, TrendingUp, Award, Target, Edit3, Check, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import * as API from '@/utils/api';

export default function CalculatorScreen() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<CompletedCourse[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    credits: '',
    grade: '',
    semester: '',
  });
  const [newErrors, setNewErrors] = useState<{ [k: string]: string }>({});

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState({
    code: '',
    title: '',
    credits: '',
    grade: '',
    semester: '',
  });
  const [editErrors, setEditErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Predictive assistant (simple): target planner inputs (frontend-only)
  const [targetGPAInput, setTargetGPAInput] = useState<string>('');
  const [remainingCreditsInput, setRemainingCreditsInput] = useState<string>('');

  const mapFromApi = (c: API.Course): CompletedCourse => ({
    id: String(c.id),
    code: c.code,
    title: c.title,
    credits: c.credits,
    weight: c.credits,
    description: '',
    grade: c.grade,
    semester: c.semester || '',
    completedAt: new Date().toISOString(),
  });

  // Load courses when logged in
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) {
        setCourses([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const items = await API.listCourses(token);
        if (!cancelled) setCourses(items.map(mapFromApi));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load courses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Grading system bands and points based on the spec provided
  const gradeBands: { letter: 'A'|'B+'|'B'|'C+'|'C'|'D+'|'D'|'E'|'F'; min: number; max: number; points: number }[] = [
    { letter: 'A',  min: 80, max: 100, points: 4.0 },
    { letter: 'B+', min: 75, max: 79,  points: 3.5 },
    { letter: 'B',  min: 70, max: 74,  points: 3.0 },
    { letter: 'C+', min: 65, max: 69,  points: 2.5 },
    { letter: 'C',  min: 60, max: 64,  points: 2.0 },
    { letter: 'D+', min: 55, max: 59,  points: 1.5 },
    { letter: 'D',  min: 50, max: 54,  points: 1.0 },
    { letter: 'E',  min: 45, max: 49,  points: 0.5 },
    { letter: 'F',  min: 0,  max: 44,  points: 0.0 },
  ];

  const gradePoints: { [key: string]: number } = Object.fromEntries(gradeBands.map(b => [b.letter, b.points]));

  const scoreToPoints = (score: number): number | null => {
    if (isNaN(score) || score < 0 || score > 100) return null;
    const band = gradeBands.find(b => score >= b.min && score <= b.max);
    return band ? band.points : null;
  };

  const pointsToLetter = (points: number): string => {
    const band = gradeBands.find(b => b.points === points);
    return band ? band.letter : points.toFixed(1);
  };

  const parseGradeInput = (value: string): number | null => {
    const raw = (value || '').trim();
    if (raw === '') return null;
    const upper = raw.toUpperCase();
    // If a letter grade is provided
    if (upper in gradePoints) return gradePoints[upper];
    // If numeric: could be 0-4 points or 0-100 percentage
    const num = Number(raw);
    if (isNaN(num)) return null;
    if (num <= 4.0) {
      if (num < 0) return null;
      return num; // treat as direct points
    }
    // treat as percentage score 0-100
    return scoreToPoints(num);
  };

  const validateCourseFields = (course: { code: string; title: string; credits: string; grade: string; semester?: string }) => {
    const errors: { [k: string]: string } = {};
    if (!course.code.trim()) errors.code = 'Course code is required';
    if (!course.title.trim()) errors.title = 'Course title is required';
    const credits = Number(course.credits);
    if (course.credits === '' || isNaN(credits)) errors.credits = 'Credits must be a number';
    else if (!Number.isInteger(credits) || credits <= 0) errors.credits = 'Credits must be a positive integer';
    const gradeVal = parseGradeInput(course.grade);
    if (course.grade === '' || gradeVal === null) errors.grade = 'Enter a letter (A, B+, …) or a score 0–100 or points 0.0–4.0';
    return { errors, credits, gradeVal: gradeVal ?? 0 };
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

  const addCourse = async () => {
    const { errors, credits, gradeVal } = validateCourseFields(newCourse);
    setNewErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setError(null);
      let createdCourse: CompletedCourse;
      if (token) {
        const created = await API.createCourse(token, {
          code: newCourse.code,
          title: newCourse.title,
          credits,
          grade: gradeVal,
          semester: newCourse.semester || undefined,
        });
        createdCourse = mapFromApi(created);
      } else {
        // fallback local add if not logged in
        createdCourse = {
          id: Date.now().toString(),
          code: newCourse.code,
          title: newCourse.title,
          credits,
          weight: credits,
          description: '',
          grade: gradeVal,
          semester: newCourse.semester,
          completedAt: new Date().toISOString(),
        };
      }
      setCourses(prev => [...prev, createdCourse]);
    } catch (e: any) {
      setError(e?.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
    setNewCourse({
      code: '',
      title: '',
      credits: '',
      grade: '',
      semester: '',
    });
    setNewErrors({});
    setShowAddForm(false);
  };

  const removeCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      if (token) {
        await API.deleteCourse(token, Number(courseId));
      }
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  // Compute GPA values for display
  const gpaData = calculateGPA();
  const gpaColor = gpaData.gpa >= 3.5 ? Colors.light.success : 
                   gpaData.gpa >= 2.5 ? Colors.light.warning : Colors.light.error;

  // Simple Target GPA planner (no persistence)
  const planner = (() => {
    const t = Number(targetGPAInput);
    const rem = Number(remainingCreditsInput);
    if (isNaN(t) || t < 0 || t > 4.0 || isNaN(rem) || rem <= 0) return null;
    const currentWeighted = courses.reduce(
      (sum, c) => sum + c.credits * (typeof c.grade === 'number' ? c.grade : Number(c.grade)),
      0
    );
    const currentCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const totalCredits = currentCredits + rem;
    const requiredWeighted = t * totalCredits - currentWeighted;
    const requiredAvg = requiredWeighted / rem;
    const feasible = requiredAvg <= 4.0 && requiredAvg >= 0;
    const suggestedLetter = pointsToLetter(Math.max(0, Math.min(4.0, requiredAvg)));
    return { target: t, remaining: rem, requiredAvg, feasible, suggestedLetter, totalCredits };
  })();

  const startEdit = (course: CompletedCourse) => {
    setEditingId(course.id);
    setEditCourse({
      code: course.code,
      title: course.title,
      credits: String(course.credits),
      grade: String(course.grade),
      semester: course.semester || '',
    });
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditErrors({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { errors, credits, gradeVal } = validateCourseFields(editCourse);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      setLoading(true);
      setError(null);
      if (token) {
        const updated = await API.updateCourse(token, Number(editingId), {
          code: editCourse.code,
          title: editCourse.title,
          credits,
          grade: gradeVal,
          semester: editCourse.semester || undefined,
        });
        const mapped = mapFromApi(updated);
        setCourses(prev => prev.map(c => c.id === editingId ? { ...mapped } : c));
      } else {
        setCourses(prev => prev.map(c => c.id === editingId ? {
          ...c,
          code: editCourse.code,
          title: editCourse.title,
          credits,
          weight: credits,
          grade: gradeVal,
          semester: editCourse.semester,
        } : c));
      }
      setEditingId(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

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
        {gradeBands.map(b => (
          <View key={b.letter} style={styles.gradeItem}>
            <Text style={styles.gradeText}>{b.letter}</Text>
            <Text style={styles.pointsText}>{`${b.min}-${b.max} | ${b.points.toFixed(1)} pts`}</Text>
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
        {newErrors.code ? <Text style={styles.errorText}>{newErrors.code}</Text> : null}
        
        <TextInput
          style={styles.formInput}
          placeholder="Course Title"
          value={newCourse.title}
          onChangeText={(text) => setNewCourse({...newCourse, title: text})}
        />
        {newErrors.title ? <Text style={styles.errorText}>{newErrors.title}</Text> : null}
        
        <View style={styles.formRow}>
          <TextInput
            style={[styles.formInput, styles.halfInput]}
            placeholder="Credits"
            value={newCourse.credits}
            onChangeText={(text) => setNewCourse({...newCourse, credits: text})}
            keyboardType="numeric"
          />
          {newErrors.credits ? <Text style={styles.errorTextInline}>{newErrors.credits}</Text> : null}
          
          <TextInput
            style={[styles.formInput, styles.halfInput]}
            placeholder="Grade (A, B+), Score (0-100) or Points (0-4.0)"
            value={newCourse.grade}
            onChangeText={(text) => setNewCourse({...newCourse, grade: text})}
          />
          {newErrors.grade ? <Text style={styles.errorTextInline}>{newErrors.grade}</Text> : null}
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
            {editingId === course.id ? (
              <>
                <Text style={styles.formTitle}>Edit Course</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Course Code"
                  value={editCourse.code}
                  onChangeText={(t) => setEditCourse({ ...editCourse, code: t.toUpperCase() })}
                />
                {editErrors.code ? <Text style={styles.errorText}>{editErrors.code}</Text> : null}

                <TextInput
                  style={styles.formInput}
                  placeholder="Course Title"
                  value={editCourse.title}
                  onChangeText={(t) => setEditCourse({ ...editCourse, title: t })}
                />
                {editErrors.title ? <Text style={styles.errorText}>{editErrors.title}</Text> : null}

                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.formInput, styles.halfInput]}
                    placeholder="Credits"
                    value={editCourse.credits}
                    onChangeText={(t) => setEditCourse({ ...editCourse, credits: t })}
                    keyboardType="numeric"
                  />
                  {editErrors.credits ? <Text style={styles.errorTextInline}>{editErrors.credits}</Text> : null}

                  <TextInput
                    style={[styles.formInput, styles.halfInput]}
                    placeholder="Grade (A, B+), Score (0-100) or Points (0-4.0)"
                    value={editCourse.grade}
                    onChangeText={(t) => setEditCourse({ ...editCourse, grade: t })}
                  />
                  {editErrors.grade ? <Text style={styles.errorTextInline}>{editErrors.grade}</Text> : null}
                </View>

                <TextInput
                  style={styles.formInput}
                  placeholder="Semester (optional)"
                  value={editCourse.semester}
                  onChangeText={(t) => setEditCourse({ ...editCourse, semester: t })}
                />

                <View style={styles.formButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                    <X size={18} color={Colors.light.text.secondary} />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={saveEdit}>
                    <Check size={18} color={'white'} />
                    <Text style={styles.addButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
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
                    {pointsToLetter(typeof course.grade === 'number' ? course.grade : Number(course.grade))}
                    {` (${typeof course.grade === 'number' ? course.grade.toFixed(1) : Number(course.grade).toFixed(1)})`}
                  </Text>
                  <Text style={styles.creditsValue}>{course.credits} cr</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEdit(course)}
                  >
                    <Edit3 size={18} color={Colors.light.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCourse(course.id)}
                  >
                    <Trash2 size={18} color={Colors.light.error} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
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

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderGPACard()}
        {renderCoursesList()}
        {renderAddForm()}
        {renderGradeScale()}

        {/* Simple Predictive Assistant: Target GPA Planner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target GPA Planner</Text>
          <View style={styles.addForm}>
            <View>
              <TextInput
                style={styles.formInput}
                placeholder="Target GPA (0.0 - 4.0)"
                keyboardType="numeric"
                value={targetGPAInput}
                onChangeText={setTargetGPAInput}
              />
              <TextInput
                style={styles.formInput}
                placeholder="Remaining Credits"
                keyboardType="numeric"
                value={remainingCreditsInput}
                onChangeText={setRemainingCreditsInput}
              />
            </View>
            {planner && (
              <View style={{ gap: 6 }}>
                <Text style={{ color: Colors.light.text.secondary }}>
                  Required average points over next {planner.remaining} credits: <Text style={{ color: Colors.light.text.primary, fontWeight: '600' }}>{planner.requiredAvg.toFixed(2)}</Text>
                </Text>
                <Text style={{ color: Colors.light.text.secondary }}>
                  Suggested letter target: <Text style={{ color: Colors.light.text.primary, fontWeight: '600' }}>{planner.suggestedLetter}</Text>
                </Text>
                {!planner.feasible ? (
                  <Text style={[styles.errorText, { marginTop: 0 }]}>This target is not feasible with the given remaining credits.</Text>
                ) : (
                  <Text style={{ color: Colors.light.success }}>Feasible based on current plan.</Text>
                )}
              </View>
            )}
          </View>
        </View>
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
  errorBanner: {
    backgroundColor: Colors.light.error + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorBannerText: {
    color: Colors.light.error,
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
  editButton: {
    padding: 4,
    marginRight: 8,
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
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  errorTextInline: {
    color: Colors.light.error,
    fontSize: 12,
    position: 'absolute',
    right: 12,
    bottom: -4,
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