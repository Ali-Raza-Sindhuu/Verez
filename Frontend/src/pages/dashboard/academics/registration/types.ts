export type CourseCategory = "core" | "elective" | "gen-ed";
export type CourseLevel = "100" | "200" | "300" | "400";

export interface CourseSchedule {
  days: string[]; // e.g. ["Mon", "Wed"]
  startTime: string; // "09:00"
  endTime: string; // "10:15"
  room: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  category: CourseCategory;
  department: string;
  instructor: string;
  credits: number;
  level: CourseLevel;
  seatsTotal: number;
  seatsTaken: number;
  schedule: CourseSchedule;
  prerequisites: string[]; // course codes
}

export interface RegistrationFilters {
  search: string;
  department: string; // "all" | department name
  level: string; // "all" | CourseLevel
  category: "all" | CourseCategory;
}

export type RegistrationStep = 1 | 2 | 3;

export type ConflictType =
  | "schedule"
  | "credit-limit"
  | "prerequisite"
  | "already-registered"
  | "no-seats";

export interface RegistrationConflict {
  type: ConflictType;
  message: string;
  courseIds: number[];
}