import { Handbook, Programme, Level, Course } from '@/types';

export const mockCourses: Course[] = [
  // Core Courses
  {
    id: 'CS101',
    code: 'CS101',
    title: 'Introduction to Computer Science',
    credits: 3,
    weight: 3,
    description: 'Fundamental concepts of computer science and programming',
  },
  {
    id: 'MATH101',
    code: 'MATH101',
    title: 'Calculus I',
    credits: 4,
    weight: 4,
    description: 'Differential and integral calculus',
  },
  {
    id: 'CS201',
    code: 'CS201',
    title: 'Data Structures',
    credits: 3,
    weight: 3,
    description: 'Arrays, linked lists, stacks, queues, trees, and graphs',
    prerequisites: ['CS101'],
  },
  {
    id: 'CS301',
    code: 'CS301',
    title: 'Algorithms',
    credits: 3,
    weight: 3,
    description: 'Design and analysis of computer algorithms',
    prerequisites: ['CS201', 'MATH101'],
  },
  // Elective Courses
  {
    id: 'CS350',
    code: 'CS350',
    title: 'Machine Learning',
    credits: 3,
    weight: 3,
    description: 'Introduction to machine learning algorithms and applications',
    prerequisites: ['CS201', 'MATH101'],
  },
  {
    id: 'CS360',
    code: 'CS360',
    title: 'Web Development',
    credits: 3,
    weight: 3,
    description: 'Modern web development technologies and frameworks',
    prerequisites: ['CS101'],
  },
  {
    id: 'CS370',
    code: 'CS370',
    title: 'Mobile App Development',
    credits: 3,
    weight: 3,
    description: 'Cross-platform mobile application development',
    prerequisites: ['CS201'],
  },
];

export const mockLevels: Level[] = [
  {
    id: 'level1',
    name: 'Level 100',
    number: 1,
    coreCourses: [mockCourses[0], mockCourses[1]], // CS101, MATH101
    electiveCourses: [],
  },
  {
    id: 'level2',
    name: 'Level 200',
    number: 2,
    coreCourses: [mockCourses[2]], // CS201
    electiveCourses: [mockCourses[5]], // CS360
  },
  {
    id: 'level3',
    name: 'Level 300',
    number: 3,
    coreCourses: [mockCourses[3]], // CS301
    electiveCourses: [mockCourses[4], mockCourses[6]], // CS350, CS370
  },
];

export const mockProgrammes: Programme[] = [
  {
    id: 'cs-bsc',
    title: 'Bachelor of Science in Computer Science',
    description: 'A comprehensive program covering core computer science concepts, programming, and software development.',
    duration: '4 years',
    levels: mockLevels,
    handbookId: 'handbook-2024',
  },
  {
    id: 'it-bsc',
    title: 'Bachelor of Science in Information Technology',
    description: 'Focused on practical IT skills, system administration, and technology management.',
    duration: '4 years',
    levels: mockLevels,
    handbookId: 'handbook-2024',
  },
];

export const mockHandbooks: Handbook[] = [
  {
    id: 'handbook-2024',
    title: 'Academic Handbook 2024',
    year: '2024',
    description: 'Official academic handbook for the 2024 academic year',
    programmes: mockProgrammes,
  },
  {
    id: 'handbook-2023',
    title: 'Academic Handbook 2023',
    year: '2023',
    description: 'Official academic handbook for the 2023 academic year',
    programmes: mockProgrammes,
  },
];