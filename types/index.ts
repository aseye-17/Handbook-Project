export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  profileImage?: string;
  preferences: {
    language: 'en' | 'fr' | 'es';
    notifications: boolean;
  };
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Handbook {
  id: string;
  title: string;
  year: string;
  description: string;
  coverImage?: string;
  programmes: Programme[];
}

export interface Programme {
  id: string;
  title: string;
  description: string;
  duration: string;
  levels: Level[];
  handbookId: string;
}

export interface Level {
  id: string;
  name: string;
  number: number;
  coreCourses: Course[];
  electiveCourses: Course[];
}

export interface Course {
  code: string;
  title: string;
  credits: number;
  type: 'core' | 'elective';
  description?: string;
  prerequisites?: string[];
  isCompleted?: boolean;
  grade?: number;
}

export interface SemesterCourses {
  [key: string]: Course[];
}

export interface LevelCourses {
  [key: string]: SemesterCourses;
}

export interface ProgramCourses {
  [key: string]: LevelCourses;
}

export interface ProgramStructure {
  name: string;
  courses: LevelCourses;
}

export interface Department {
  name: string;
  programs: {
    [key: string]: ProgramStructure;
  };
}

export interface School {
  name: string;
  departments: {
    [key: string]: Department;
  };
}

export interface AcademicStructure {
  schools: {
    [key: string]: School;
  };
}

export interface GPACalculation {
  totalCredits: number;
  totalWeightedPoints: number;
  gpa: number;
  courses: CompletedCourse[];
  calculatedAt?: string;
}

export interface CompletedCourse extends Course {
  grade: number;
  semester: string;
  completedAt: string;
  category?: 'Core' | 'Elective' | 'General';
}

export interface GPACalculation {
  totalCredits: number;
  totalWeightedPoints: number;
  gpa: number;
  courses: CompletedCourse[];
  calculatedAt?: string;
}

export interface GPAGoal {
  targetGPA: number;
  targetCredits: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface AcademicHistory {
  semesters: {
    [semester: string]: {
      gpa: number;
      credits: number;
      courses: string[];
    };
  };
  cumulativeGPA: number;
  totalCredits: number;
  lastUpdated: string;
}

export interface UserAcademicData {
  courses: CompletedCourse[];
  gpaHistory: {
    [semester: string]: GPACalculation;
  };
  goals: GPAGoal[];
  currentGoalId?: string;
  lastBackup?: string;
}