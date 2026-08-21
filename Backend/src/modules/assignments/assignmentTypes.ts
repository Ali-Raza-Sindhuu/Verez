export type DerivedStatus =
  | "UPCOMING"
  | "OVERDUE"
  | "SUBMITTED"
  | "LATE"
  | "GRADED";

export interface AssignmentListItemDTO {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  title: string;
  type: string;
  points: number;
  dueDate: Date;
  status: DerivedStatus;
}

export interface AssignmentDetailsDTO extends AssignmentListItemDTO {
  description: string;
  instructions: string | null;
  submissionType: string;
  allowLateSubmit: boolean;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  instructor: string;
  attachments: {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
  submission: AssignmentSubmissionDTO | null;
}

export interface AssignmentSubmissionDTO {
  id: number;
  state: string;
  submittedAt: Date;
  isLate: boolean;
  textContent: string | null;
  linkUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  comments: string | null;
}

export interface AssignmentGradeDTO {
  grade: number | null;
  points: number;
  gradedAt: Date | null;
  feedback: string | null;
}
