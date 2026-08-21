import { prisma } from "../../config/database.js";
import { computeAssignmentStatus } from "./assignmentUtils.js";
import type {
  AssignmentListItemDTO,
  AssignmentDetailsDTO,
  AssignmentSubmissionDTO,
  AssignmentGradeDTO,
} from "./assignmentTypes.js";

export class AssignmentError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = "ASSIGNMENT_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---- Authorization gate ----
// Every function below goes through this — never Assignment.findUnique alone.
async function assertEnrolledInAssignmentCourse(
  studentId: number,
  assignmentId: number
) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { courseOffering: true },
  });

  if (!assignment) {
    throw new AssignmentError("Assignment not found", 404, "ASSIGNMENT_NOT_FOUND");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      semesterRegistration: { studentId },
      courseOfferingId: assignment.courseOfferingId,
    },
  });

  if (!enrollment || enrollment.status === "dropped") {
    throw new AssignmentError(
      "You are not enrolled in this course",
      403,
      "NOT_ENROLLED"
    );
  }

  return assignment;
}

// ---- List (Section 8) ----

interface ListFilters {
  courseId?: number;
  status?: string;
  type?: string;
  search?: string;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
  sortBy: "dueDate" | "createdAt" | "points";
  sortOrder: "asc" | "desc";
}

export async function listAssignmentsForStudent(
  studentId: number,
  filters: ListFilters
) {
  const enrolledOfferingIds = (
    await prisma.enrollment.findMany({
      where: {
        semesterRegistration: { studentId },
        status: { not: "dropped" },
      },
      select: { courseOfferingId: true },
    })
  ).map((e) => e.courseOfferingId);

  if (enrolledOfferingIds.length === 0) {
    return { data: [], pagination: { page: filters.page, limit: filters.limit, total: 0, totalPages: 0 } };
  }

  const where = {
    courseOfferingId: filters.courseId
      ? filters.courseId
      : { in: enrolledOfferingIds },
    type: filters.type as never,
    dueDate:
      filters.from || filters.to
        ? { gte: filters.from, lte: filters.to }
        : undefined,
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" as const } },
            { description: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // Guard: if a specific courseId was requested, it must be one the
  // student is actually enrolled in — never trust it blindly.
  if (filters.courseId && !enrolledOfferingIds.includes(filters.courseId)) {
    return { data: [], pagination: { page: filters.page, limit: filters.limit, total: 0, totalPages: 0 } };
  }

  const [total, assignments] = await Promise.all([
    prisma.assignment.count({ where }),
    prisma.assignment.findMany({
      where,
      include: {
        courseOffering: { include: { course: { select: { code: true, name: true } } } },
        submissions: { where: { studentId }, select: { submittedAt: true, grade: true } },
      },
      orderBy: { [filters.sortBy]: filters.sortOrder },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
  ]);

  let data: AssignmentListItemDTO[] = assignments.map((a) => {
    const submission = a.submissions[0] ?? null;
    return {
      id: a.id,
      courseId: a.courseOfferingId,
      courseCode: a.courseOffering.course.code,
      courseName: a.courseOffering.course.name,
      title: a.title,
      type: a.type,
      points: a.points,
      dueDate: a.dueDate,
      status: computeAssignmentStatus({ dueDate: a.dueDate, submission }),
    };
  });

  // Status is derived, not a DB column, so filtering by it happens in
  // application code after the fact rather than in the Prisma `where`.
  if (filters.status) {
    data = data.filter((a) => a.status === filters.status);
  }

  return {
    data,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

// ---- Details (Section 10) ----

export async function getAssignmentDetails(
  studentId: number,
  assignmentId: number
): Promise<AssignmentDetailsDTO> {
  await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: { id: assignmentId },
    include: {
      courseOffering: {
        include: {
          course: { select: { id: true, code: true, name: true } },
          teacher: { select: { name: true } },
        },
      },
      attachments: { select: { id: true, fileName: true, fileType: true, fileSize: true } },
      submissions: { where: { studentId } },
    },
  });

  const submission = assignment.submissions[0] ?? null;

  return {
    id: assignment.id,
    courseId: assignment.courseOfferingId,
    courseCode: assignment.courseOffering.course.code,
    courseName: assignment.courseOffering.course.name,
    instructor: assignment.courseOffering.teacher?.name ?? "TBA",
    title: assignment.title,
    description: assignment.description,
    instructions: assignment.instructions,
    type: assignment.type,
    points: assignment.points,
    dueDate: assignment.dueDate,
    submissionType: assignment.submissionType,
    allowLateSubmit: assignment.allowLateSubmit,
    allowedFileTypes: assignment.allowedFileTypes,
    maxFileSizeMb: assignment.maxFileSizeMb,
    status: computeAssignmentStatus({ dueDate: assignment.dueDate, submission }),
    attachments: assignment.attachments,
    submission: submission ? toSubmissionDTO(submission) : null,
  };
}

// ---- Submission (Section 11) ----

interface SubmissionInput {
  textContent?: string;
  linkUrl?: string;
  comments?: string;
  file?: { fileName: string; fileType: string; fileSize: number };
}

function validateSubmissionPayload(
  submissionType: string,
  allowedFileTypes: string[],
  maxFileSizeMb: number,
  input: SubmissionInput
) {
  if (submissionType === "TEXT" && !input.textContent) {
    throw new AssignmentError("Text content is required", 422, "INVALID_SUBMISSION");
  }
  if (submissionType === "LINK" && !input.linkUrl) {
    throw new AssignmentError("A link is required", 422, "INVALID_SUBMISSION");
  }
  if (submissionType === "FILE") {
    if (!input.file) {
      throw new AssignmentError("A file is required", 422, "INVALID_SUBMISSION");
    }
    if (
      allowedFileTypes.length > 0 &&
      !allowedFileTypes.includes(input.file.fileType)
    ) {
      throw new AssignmentError(
        `File type must be one of: ${allowedFileTypes.join(", ")}`,
        422,
        "INVALID_FILE_TYPE"
      );
    }
    if (input.file.fileSize > maxFileSizeMb * 1024 * 1024) {
      throw new AssignmentError(
        `File exceeds the ${maxFileSizeMb}MB limit`,
        413,
        "FILE_TOO_LARGE"
      );
    }
  }
}

export async function createSubmission(
  studentId: number,
  assignmentId: number,
  input: SubmissionInput
) {
  const assignment = await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  const now = new Date();
  const isLate = now > assignment.dueDate;
  if (isLate && !assignment.allowLateSubmit) {
    throw new AssignmentError(
      "The deadline for this assignment has passed",
      409,
      "DEADLINE_PASSED"
    );
  }

  validateSubmissionPayload(
    assignment.submissionType,
    assignment.allowedFileTypes,
    assignment.maxFileSizeMb,
    input
  );

  const existing = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
  });
  if (existing) {
    throw new AssignmentError(
      "A submission already exists — use PATCH to update it",
      409,
      "SUBMISSION_EXISTS"
    );
  }

  const submission = await prisma.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId,
      submittedAt: now,
      isLate,
      state: isLate ? "LATE" : "SUBMITTED",
      textContent: input.textContent,
      linkUrl: input.linkUrl,
      comments: input.comments,
      fileName: input.file?.fileName,
      fileType: input.file?.fileType,
      fileSize: input.file?.fileSize,
    },
  });

  // TODO: emit "submission:received" Socket.IO event here once a socket
  // server exists in this project (see plan notes — no infra yet).

  return toSubmissionDTO(submission);
}

export async function updateSubmission(
  studentId: number,
  assignmentId: number,
  input: SubmissionInput
) {
  const assignment = await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  const existing = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
  });

  // Rule 7: ownership is enforced structurally — this lookup is keyed by
  // (assignmentId, studentId) from the authenticated user, so there is no
  // code path where another student's row could be matched or updated.
  if (!existing) {
    throw new AssignmentError("No submission to update", 404, "SUBMISSION_NOT_FOUND");
  }
  if (existing.grade !== null) {
    throw new AssignmentError(
      "Cannot modify a submission that has already been graded",
      409,
      "ALREADY_GRADED"
    );
  }

  const now = new Date();
  const isLate = now > assignment.dueDate;
  if (isLate && !assignment.allowLateSubmit) {
    throw new AssignmentError(
      "The deadline for this assignment has passed",
      409,
      "DEADLINE_PASSED"
    );
  }

  validateSubmissionPayload(
    assignment.submissionType,
    assignment.allowedFileTypes,
    assignment.maxFileSizeMb,
    input
  );

  const submission = await prisma.assignmentSubmission.update({
    where: { id: existing.id },
    data: {
      submittedAt: now,
      isLate,
      state: isLate ? "LATE" : "SUBMITTED",
      textContent: input.textContent,
      linkUrl: input.linkUrl,
      comments: input.comments,
      fileName: input.file?.fileName,
      fileType: input.file?.fileType,
      fileSize: input.file?.fileSize,
    },
  });

  return toSubmissionDTO(submission);
}

export async function deleteSubmission(studentId: number, assignmentId: number) {
  await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  const existing = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
  });
  if (!existing) {
    throw new AssignmentError("No submission to delete", 404, "SUBMISSION_NOT_FOUND");
  }
  if (existing.grade !== null) {
    throw new AssignmentError(
      "Cannot delete a submission that has already been graded",
      409,
      "ALREADY_GRADED"
    );
  }

  await prisma.assignmentSubmission.delete({ where: { id: existing.id } });
}

export async function getSubmission(studentId: number, assignmentId: number) {
  await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
  });

  return submission ? toSubmissionDTO(submission) : null;
}

// ---- Attachments ----

export async function getAssignmentAttachments(studentId: number, assignmentId: number) {
  await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  return prisma.assignmentAttachment.findMany({
    where: { assignmentId },
    select: { id: true, fileName: true, fileType: true, fileSize: true },
  });
}

// ---- Grade (Rule 8: read-only for students) ----

export async function getAssignmentGrade(
  studentId: number,
  assignmentId: number
): Promise<AssignmentGradeDTO> {
  const assignment = await assertEnrolledInAssignmentCourse(studentId, assignmentId);

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId } },
    select: { grade: true, gradedAt: true, feedback: true },
  });

  return {
    grade: submission?.grade ?? null,
    points: assignment.points,
    gradedAt: submission?.gradedAt ?? null,
    feedback: submission?.feedback ?? null,
  };
}

// ---- helpers ----

function toSubmissionDTO(submission: {
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
}): AssignmentSubmissionDTO {
  return {
    id: submission.id,
    state: submission.state,
    submittedAt: submission.submittedAt,
    isLate: submission.isLate,
    textContent: submission.textContent,
    linkUrl: submission.linkUrl,
    fileName: submission.fileName,
    fileType: submission.fileType,
    fileSize: submission.fileSize,
    comments: submission.comments,
  };
}
