// This file is maintained for backward compatibility
// All exports are now in realData.ts
import {
  mockHandbooks,
  mockProgrammes,
  mockLevels,
  mockCourses,
  getProgramById,
  getLevelsByProgramId,
  getCoursesByProgramAndLevel
} from './realData';

export * from './realData';

const defaultExport = {
  mockHandbooks,
  mockProgrammes,
  mockLevels,
  mockCourses,
  getProgramById,
  getLevelsByProgramId,
  getCoursesByProgramAndLevel
};

export default defaultExport;