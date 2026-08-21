import { prisma } from "../../config/database.js";
import { letterGradeFor, computeAcademicStanding, DEGREE_TOTAL_CREDITS } from "./gradeUtils.js";
import type {
  CourseGradeDTO,
  CourseGradeDetailDTO,
  SemesterGPADTO,
  GPAOverviewDTO,
  TranscriptSemesterDTO,
  GradeComponent,
} from "./gradeTypes.js";

export class GradeError extends Error {
  status: number;
  constructor(message: string, status = 404) {
    super(message);
    this.status = status;
  }
}

// ---- Core: compute one course's grade for one student ----

async function computeCourseGrade(
  enrollment: { id: number; status: string; semesterRegistration: { studentId: number } },
  offering: { id: number; course: { id: number; code: string; name: string; department: string; credits: number }; semester: { name: string } }
): Promise<CourseGradeDTO> {
  const studentId = enrollment.semesterRegistration.studentId;
  const courseOfferingId = offering.id;

  const [assignmentSubmissions, assessmentAttempts] = await Promise.all([
    prisma.assignmentSubmission.findMany({
      where: {
        studentId,
        grade: { not: null },
        assignment: { courseOfferingId },
      },
      include: { assignment: { select: { points: true } } },
    }),
    prisma.assessmentAttempt.findMany({
      where: {
        studentId,
        status: { not: "IN_PROGRESS" },
        assessment: { courseOfferingId },
      },
      include: { assessment: { select: { type: true, totalMarks: true } } },
      orderBy: { attemptNumber: "desc" },
    }),
  ]);

  const assignments: GradeComponent = assignmentSubmissions.reduce(
    (acc, s) => ({ earned: acc.earned + (s.grade ?? 0), total: acc.total + s.assignment.points }),
    { earned: 0, total: 0 }
  );

  const latestAttemptByAssessment = new Map<number, (typeof assessmentAttempts)[number]>();
  for (const a of assessmentAttempts) {
    if (!latestAttemptByAssessment.has(a.assessmentId)) {
      latestAttemptByAssessment.set(a.assessmentId, a);
    }
  }

  const quizzes: GradeComponent = { earned: 0, total: 0 };
  const exams: GradeComponent = { earned: 0, total: 0 };
  for (const attempt of latestAttemptByAssessment.values()) {
    const bucket = attempt.assessment.type === "QUIZ" ? quizzes : exams;
    bucket.earned += attempt.score ?? 0;
    bucket.total += attempt.assessment.totalMarks;
  }

  const totalEarned = assignments.earned + quizzes.earned + exams.earned;
  const totalPossible = assignments.total + quizzes.total + exams.total;

  const hasGradedWork = totalPossible > 0;
  const percentage = hasGradedWork ? Math.round((totalEarned / totalPossible) * 100) : null;
  const { letter, gradePoints } = percentage !== null
    ? letterGradeFor(percentage)
    : { letter: null, gradePoints: null };

  return {
    id: enrollment.id,
    courseOfferingId: offering.id,
    courseId: offering.course.id,
    courseCode: offering.course.code,
    courseName: offering.course.name,
    department: offering.course.department,
    credits: offering.course.credits,
    semester: offering.semester.name,
    percentage,
    letterGrade: letter,
    gradePoints,
    status: enrollment.status === "completed" ? "completed" : "in-progress",
    components: { assignments, quizzes, exams },
  };
}

// ---- Course Grades list for a semester ----

export async function listCourseGradesForSemester(studentId: number, semesterName: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      semesterRegistration: { studentId },
      status: { not: "dropped" },
      courseOffering: { semester: { name: semesterName } },
    },
    include: {
      semesterRegistration: true,
      courseOffering: {
        include: { course: true, semester: true },
      },
    },
  });

  return Promise.all(enrollments.map((e) => computeCourseGrade(e, e.courseOffering)));
}

// ---- Single course detail ----

export async function getCourseGradeDetail(
  studentId: number,
  courseOfferingId: number
): Promise<CourseGradeDetailDTO> {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      semesterRegistration: { studentId },
      courseOfferingId,
      status: { not: "dropped" },
    },
    include: {
      semesterRegistration: true,
      courseOffering: {
        include: { course: true, semester: true },
      },
    },
  });

  if (!enrollment) {
    throw new GradeError("Course not found in your enrollments");
  }

  const base = await computeCourseGrade(enrollment, enrollment.courseOffering);

  const assessments = await prisma.assessment.findMany({
    where: { courseOfferingId },
    include: {
      attempts: {
        where: { studentId, status: { not: "IN_PROGRESS" } },
        orderBy: { attemptNumber: "desc" },
        take: 1,
      },
    },
  });

  const breakdown = [
    {
      label: "Assignments",
      earned: base.components.assignments.earned,
      total: base.components.assignments.total,
    },
    ...assessments
      .filter((a) => a.attempts.length > 0)
      .map((a) => ({
        label: a.title,
        earned: a.attempts[0].score ?? 0,
        total: a.totalMarks,
      })),
  ];

  return {
    ...base,
    description: enrollment.courseOffering.course.description,
    instructor: null, // fetched separately via offering.teacher if needed
    assessmentBreakdown: breakdown,
  };
}

// ---- Semester ordering helper ----

async function getOrderedSemesters(studentId: number): Promise<string[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      semesterRegistration: { studentId },
      status: { not: "dropped" },
    },
    include: {
      courseOffering: {
        include: { semester: true },
      },
    },
  });

  const earliestBySemester = new Map<string, Date>();
  for (const e of enrollments) {
    const semName = e.courseOffering.semester.name;
    const startDate = e.courseOffering.semester.startDate;
    const existing = earliestBySemester.get(semName);
    if (!existing || startDate < existing) {
      earliestBySemester.set(semName, startDate);
    }
  }

  return [...earliestBySemester.entries()]
    .sort((a, b) => a[1].getTime() - b[1].getTime())
    .map(([s]) => s);
}

function creditWeightedGPA(courses: CourseGradeDTO[]): number | null {
  const graded = courses.filter((c) => c.gradePoints !== null);
  if (graded.length === 0) return null;
  const totalCredits = graded.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits === 0) return null;
  const weighted = graded.reduce((sum, c) => sum + c.gradePoints! * c.credits, 0);
  return Math.round((weighted / totalCredits) * 100) / 100;
}

// ---- Semester GPA history ----

export async function listSemesterGPAHistory(studentId: number): Promise<SemesterGPADTO[]> {
  const semesters = await getOrderedSemesters(studentId);
  const currentSemester = semesters[semesters.length - 1] ?? null;

  return Promise.all(
    semesters.map(async (semester) => {
      const courses = await listCourseGradesForSemester(studentId, semester);
      const credits = courses.reduce((sum, c) => sum + c.credits, 0);
      return {
        semester,
        gpa: creditWeightedGPA(courses),
        credits,
        status: semester === currentSemester ? ("current" as const) : ("passed" as const),
      };
    })
  );
}

// ---- Overview ----

export async function getGPAOverview(studentId: number): Promise<GPAOverviewDTO> {
  const gpaTrend = await listSemesterGPAHistory(studentId);

  const currentEntry = gpaTrend[gpaTrend.length - 1] ?? null;
  const previousEntry = gpaTrend[gpaTrend.length - 2] ?? null;

  const allCourses = (
    await Promise.all(gpaTrend.map((s) => listCourseGradesForSemester(studentId, s.semester)))
  ).flat();
  const cumulativeGPA = creditWeightedGPA(allCourses);

  const earnedCredits = allCourses
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.credits, 0);

  const { label, onTrack } = computeAcademicStanding(cumulativeGPA ?? 0);

  return {
    currentGPA: cumulativeGPA,
    previousSemesterGPA: previousEntry?.gpa ?? null,
    semesterGPA: currentEntry?.gpa ?? null,
    currentSemester: currentEntry?.semester ?? null,
    earnedCredits,
    totalCredits: DEGREE_TOTAL_CREDITS,
    academicStanding: label,
    onTrack,
    gpaTrend,
  };
}

// ---- Transcript ----

export async function getTranscript(studentId: number): Promise<TranscriptSemesterDTO[]> {
  const history = await listSemesterGPAHistory(studentId);

  return Promise.all(
    history.map(async (s) => ({
      ...s,
      courses: await listCourseGradesForSemester(studentId, s.semester),
    }))
  );
}
