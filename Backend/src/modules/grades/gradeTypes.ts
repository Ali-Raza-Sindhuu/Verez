export interface GradeComponent {
  earned: number;
  total: number;
}

export interface CourseGradeDTO {
  id: number; // enrollmentId
  courseOfferingId: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  percentage: number | null; // null if no graded work exists yet
  letterGrade: string | null;
  gradePoints: number | null;
  status: "completed" | "in-progress";
  components: {
    assignments: GradeComponent;
    quizzes: GradeComponent;
    exams: GradeComponent;
  };
}

export interface AssessmentBreakdownItemDTO {
  label: string;
  earned: number;
  total: number;
}

export interface CourseGradeDetailDTO extends CourseGradeDTO {
  description: string;
  instructor: string | null;
  assessmentBreakdown: AssessmentBreakdownItemDTO[];
}

export interface SemesterGPADTO {
  semester: string;
  gpa: number | null;
  credits: number;
  status: "current" | "passed";
}

export interface GPAOverviewDTO {
  currentGPA: number | null; // cumulative
  previousSemesterGPA: number | null;
  semesterGPA: number | null; // most recent/current semester
  currentSemester: string | null;
  earnedCredits: number;
  totalCredits: number;
  academicStanding: string;
  onTrack: boolean;
  gpaTrend: SemesterGPADTO[];
}

export interface TranscriptSemesterDTO {
  semester: string;
  gpa: number | null;
  credits: number;
  status: "current" | "passed";
  courses: CourseGradeDTO[];
}
