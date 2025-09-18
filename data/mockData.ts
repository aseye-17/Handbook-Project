import { AcademicStructure, Handbook, Programme } from '../types';
import academicStructure from './academicStructure';

// Mock data for handbooks
export const mockHandbooks: Handbook[] = [
  {
    id: 'handbook-2017',
    title: "HANDBOOK FOR THE BACHELOR'S DEGREE COURSE DESCRIPTIONS FOR PROGRAMMES IN THE SCIENCES",
    year: '2017',
    description: 'Official academic handbook for September, 2017',
    programmes: [], // Will be populated below
  },
];

// Mock data for programmes
export const mockProgrammes: Programme[] = [
  {
    id: 'cs-bsc',
    title: 'Computer Science',
    description: 'Bachelor of Science in Computer Science',
    duration: '4 years',
    levels: [],
    handbookId: 'handbook-2017',
  },
  {
    id: 'it-bsc',
    title: 'Information Technology',
    description: 'Bachelor of Science in Information Technology',
    duration: '4 years',
    levels: [],
    handbookId: 'handbook-2017',
  },
];

// Populate the handbook with programmes
mockHandbooks[0].programmes = mockProgrammes;

// Export the academic structure
export { academicStructure };

// Mock data for user's academic progress
export const mockUserProgress = {
  completedCourses: ['UGRC150', 'MATH121', 'STAT101', 'CSCD101'],
  currentSemester: 'Fall 2023',
  gpa: 3.5,
  totalCredits: 45,
};

// Mock data for academic calendar
export const mockAcademicCalendar = [
  {
    id: 'event-1',
    title: 'Registration Period',
    startDate: '2023-08-01',
    endDate: '2023-08-15',
    type: 'registration',
  },
  {
    id: 'event-2',
    title: 'Classes Begin',
    startDate: '2023-08-21',
    endDate: '2023-08-21',
    type: 'academic',
  },
  {
    id: 'event-3',
    title: 'Midterm Exams',
    startDate: '2023-10-09',
    endDate: '2023-10-13',
    type: 'exam',
  },
  {
    id: 'event-4',
    title: 'Thanksgiving Break',
    startDate: '2023-11-22',
    endDate: '2023-11-24',
    type: 'holiday',
  },
  {
    id: 'event-5',
    title: 'Final Exams',
    startDate: '2023-12-11',
    endDate: '2023-12-15',
    type: 'exam',
  },
  {
    id: 'event-6',
    title: 'Semester Ends',
    startDate: '2023-12-16',
    endDate: '2023-12-16',
    type: 'academic',
  },
];