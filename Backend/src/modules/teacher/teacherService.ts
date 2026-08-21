import { prisma } from "../../config/database.js";

export class TeacherError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// ---- Course Offerings ----
// Teachers can view and manage their assigned course offerings.
// Only admins can CREATE offerings and assign teachers — teachers cannot create offerings themselves.

export async function listMyOfferings(teacherId: number) {
  return prisma.courseOffering.findMany({
    where: { teacherId },
    include: {
      course: true,
      semester: true,
    },
    orderBy: [{ semester: { startDate: "desc" } }, { course: { code: "asc" } }],
  });
}

async function assertOwnsOffering(teacherId: number, courseOfferingId: number) {
  const offering = await prisma.courseOffering.findUnique({
    where: { id: courseOfferingId },
    include: { course: true },
  });
  if (!offering) throw new TeacherError("Course offering not found", 404);
  if (offering.teacherId !== teacherId) {
    throw new TeacherError("You do not own this course offering", 403);
  }
  return offering;
}

// ---- Assignments ----

export async function createAssignment(
  teacherId: number,
  courseOfferingId: number,
  data: {
    title: string; description: string; instructions?: string;
    type: string; points: number; dueDate: Date; submissionType: string;
    allowLateSubmit: boolean; allowedFileTypes: string[]; maxFileSizeMb: number;
  }
) {
  await assertOwnsOffering(teacherId, courseOfferingId);
  return prisma.assignment.create({
    data: { ...data, courseOfferingId } as never,
  });
}

async function assertOwnsAssignment(teacherId: number, assignmentId: number) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { courseOffering: true },
  });
  if (!assignment) throw new TeacherError("Assignment not found", 404);
  if (assignment.courseOffering.teacherId !== teacherId) {
    throw new TeacherError("You do not own this assignment", 403);
  }
  return assignment;
}

export async function updateAssignment(
  teacherId: number,
  assignmentId: number,
  data: Partial<{
    title: string; description: string; instructions?: string;
    type: string; points: number; dueDate: Date; submissionType: string;
    allowLateSubmit: boolean; allowedFileTypes: string[]; maxFileSizeMb: number;
  }>
) {
  await assertOwnsAssignment(teacherId, assignmentId);
  return prisma.assignment.update({ where: { id: assignmentId }, data: data as never });
}

export async function deleteAssignment(teacherId: number, assignmentId: number) {
  await assertOwnsAssignment(teacherId, assignmentId);
  await prisma.assignment.delete({ where: { id: assignmentId } });
}

// ---- Grading ----

export async function listSubmissionsForAssignment(
  teacherId: number,
  assignmentId: number
) {
  await assertOwnsAssignment(teacherId, assignmentId);

  return prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { submittedAt: "asc" },
  });
}

export async function gradeSubmission(
  teacherId: number,
  submissionId: number,
  data: { grade: number; feedback?: string }
) {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: { include: { courseOffering: true } } },
  });

  if (!submission) throw new TeacherError("Submission not found", 404);
  if (submission.assignment.courseOffering.teacherId !== teacherId) {
    throw new TeacherError("You do not own this assignment", 403);
  }
  if (data.grade > submission.assignment.points) {
    throw new TeacherError(
      `Grade cannot exceed the assignment's ${submission.assignment.points} points`,
      422
    );
  }

  return prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      grade: data.grade,
      feedback: data.feedback,
      gradedAt: new Date(),
      state: "GRADED",
    },
  });
}
