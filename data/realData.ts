import { Handbook, Programme, Level, Course } from '@/types';

// Raw data structure
const rawData = {
  schools: {
    physical_mathematical_sciences: {
      name: "School of Physical & Mathematical Sciences",
      departments: {
        computer_science: {
          name: "Department of Computer Science",
          programs: {
            single_major: {
              courses: {
                level_100: {
                  semester_1: [
                    {
                      code: "UGRC 150",
                      title: "Critical Thinking and Practical Reasoning",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "MATH 121",
                      title: "Algebra and Trigonometry",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "STAT 101",
                      title: "Introduction to Statistics",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "CSCD 101",
                      title: "Introduction to Computer Science I",
                      credits: 3,
                      type: "core"
                    }
                  ],
                  semester_1_electives: [
                    {
                      code: "PHYS 101",
                      title: "Practical Physics I",
                      credits: 1,
                      type: "elective"
                    },
                    {
                      code: "PHYS 143",
                      title: "Mechanics and Thermal Physics",
                      credits: 3,
                      type: "elective"
                    }
                  ]
                },
                level_200: {
                  semester_1: [
                    {
                      code: "UGRC 210",
                      title: "Academic Writing II",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "CSCD 205",
                      title: "Programming I (with C++)",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "CSCD 211",
                      title: "Computer Organization and Architecture",
                      credits: 3,
                      type: "core"
                    }
                  ],
                  semester_2: [
                    {
                      code: "CSCD 202",
                      title: "Programming II (Java)",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "CSCD 216",
                      title: "Data Structures & Algorithms",
                      credits: 3,
                      type: "core"
                    }
                  ]
                },
                level_300: {
                  semester_1: [
                    {
                      code: "CSCD 301",
                      title: "Object Oriented Analysis & Design",
                      credits: 3,
                      type: "core"
                    },
                    {
                      code: "CSCD 313",
                      title: "Database Management Systems",
                      credits: 3,
                      type: "core"
                    }
                  ],
                  semester_1_electives: [
                    {
                      code: "CSCD 311",
                      title: "Web Technologies & Development",
                      credits: 3,
                      type: "elective"
                    }
                  ]
                },
                level_400: {
                  semester_1: [
                    {
                      code: "CSCD 415",
                      title: "Compilers",
                      credits: 3,
                      type: "core"
                    }
                  ],
                  semester_2: [
                    {
                      code: "CSCD 400",
                      title: "Project",
                      credits: 6,
                      type: "core"
                    }
                  ]
                }
              }
            },
            major_minor: {
              courses: {
                level_200: {
                  semester_1: [
                    {
                      code: "CSCD 205",
                      title: "Programming I (with C++)",
                      credits: 3,
                      type: "core"
                    }
                  ]
                }
              }
            }
          }
        },
        information_technology: {
          name: "Information Technology Program",
          courses: {
            level_100: {
              semester_1: [
                {
                  code: "CSIT 101",
                  title: "Introduction to Information Technology",
                  credits: 3,
                  type: "core"
                }
              ]
            },
            level_200: {
              semester_1: [
                {
                  code: "CSIT 201",
                  title: "Professional, Legal, Moral and Ethical issues in IT",
                  credits: 3,
                  type: "core"
                }
              ]
            }
          }
        }
      }
    }
  }
};

// Helper to transform course data
const transformCourse = (course: any, levelNumber: number, semester?: number, track?: string): Course => ({
  id: `${course.code}-${levelNumber}-${semester || '0'}-${track || 'core'}`.toLowerCase().replace(/\s+/g, '-'),
  code: course.code,
  title: course.title,
  credits: course.credits,
  weight: course.credits,
  description: course.description || course.title,
  type: course.type || 'core',
  semester,
  level: levelNumber,
  prerequisites: course.prerequisites || []
});

// Transform level data
const transformLevel = (levelData: any, levelName: string, programName: string): Level => {
  const levelNumber = parseInt(levelName.split('_')[1]) / 100;
  
  const coreCourses: Course[] = [];
  const electiveCourses: Course[] = [];
  
  // Process core courses from semester_1 and semester_2
  const processSemester = (semesterData: any, semesterNumber: number) => {
    if (!semesterData) return;
    
    semesterData.forEach((course: any) => {
      if (course.type === 'core') {
        coreCourses.push(transformCourse(course, levelNumber, semesterNumber));
      } else {
        electiveCourses.push(transformCourse(course, levelNumber, semesterNumber));
      }
    });
  };
  
  // Process elective groups
  const processElectiveGroup = (groupData: any, groupName: string, semesterNumber: number) => {
    if (!groupData) return;
    
    const trackName = groupName
      .replace('electives_', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    groupData.forEach((course: any) => {
      electiveCourses.push(transformCourse(course, levelNumber, semesterNumber, trackName));
    });
  };
  
  // Process all semesters and elective groups
  processSemester(levelData.semester_1, 1);
  processSemester(levelData.semester_2, 2);
  
  // Process all elective groups
  Object.entries(levelData).forEach(([key, value]) => {
    if (key.startsWith('semester_1_electives_')) {
      processElectiveGroup(value, key, 1);
    } else if (key.startsWith('semester_2_electives_')) {
      processElectiveGroup(value, key, 2);
    } else if (key === 'semester_1_electives' || key === 'semester_2_electives') {
      const semester = key.includes('1') ? 1 : 2;
      (value as any[])?.forEach(course => {
        electiveCourses.push(transformCourse(course, levelNumber, semester));
      });
    }
  });
  
  return {
    id: `level-${levelNumber}00-${programName.toLowerCase().replace(/\s+/g, '-')}`,
    name: `Level ${levelNumber}00`,
    number: levelNumber,
    coreCourses,
    electiveCourses,
    tracks: []
  };
};

// Transform program data
const transformProgram = (programData: any, programName: string, departmentName: string): Programme => {
  const levels = Object.entries(programData.courses || {})
    .map(([levelName, levelData]) => 
      transformLevel(levelData, levelName, programName)
    )
    .sort((a, b) => a.number - b.number);

  return {
    id: programName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: programName,
    description: departmentName,
    duration: '4 years',
    levels,
    handbookId: 'handbook-2017',
  };
};

// Transform IT program (different structure)
const transformITProgram = (programData: any, programName: string, departmentName: string): Programme => {
  const levels = Object.entries(programData.courses || {})
    .map(([levelName, levelData]) => 
      transformLevel(levelData, levelName, programName)
    )
    .sort((a, b) => a.number - b.number);

  return {
    id: programName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: programName,
    description: departmentName,
    duration: '4 years',
    levels,
    handbookId: 'handbook-2017',
  };
};

// Main transformation
export const realHandbooks: Handbook[] = [
  {
    id: 'handbook-2017',
    title: "HANDBOOK FOR THE BACHELOR'S DEGREE COURSE DESCRIPTIONS FOR PROGRAMMES IN THE SCIENCES September, 2017",
    year: '2017',
    description: 'Official academic handbook for September, 2017',
    lastUpdated: '2023-09-01',
    programmes: [
      // Computer Science Programs
      transformProgram(
        rawData.schools.physical_mathematical_sciences.departments.computer_science.programs.single_major,
        'Computer Science (Single Major)',
        'Department of Computer Science'
      ),
      transformProgram(
        rawData.schools.physical_mathematical_sciences.departments.computer_science.programs.major_minor,
        'Computer Science (Major/Minor)',
        'Department of Computer Science'
      ),
      // Information Technology Program
      transformITProgram(
        { courses: rawData.schools.physical_mathematical_sciences.departments.information_technology.courses },
        'Information Technology',
        'Information Technology Program'
      )
    ]
  }
];

// Helper functions
export const getProgramById = (programId: string): Programme | undefined => {
  return realHandbooks
    .flatMap(h => h.programmes)
    .find(p => p.id === programId);
};

export const getLevelsByProgramId = (programId: string): Level[] => {
  const program = getProgramById(programId);
  return program?.levels || [];
};

export const getCoursesByProgramAndLevel = (programId: string, levelNumber: number) => {
  const program = getProgramById(programId);
  const level = program?.levels.find(l => l.number === levelNumber);
  return {
    coreCourses: level?.coreCourses || [],
    electiveCourses: level?.electiveCourses || []
  };
};

// Export all courses for search functionality
export const allCourses = realHandbooks.flatMap(handbook =>
  handbook.programmes.flatMap(programme =>
    programme.levels.flatMap(level => [
      ...level.coreCourses,
      ...level.electiveCourses
    ])
  )
);

// For backward compatibility
export const mockHandbooks = realHandbooks;
export const mockProgrammes = realHandbooks.flatMap(h => h.programmes);
export const mockLevels = mockProgrammes.flatMap(p => p.levels);
export const mockCourses = allCourses;
