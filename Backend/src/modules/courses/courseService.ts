import { prisma } from "../../config/database.js";

export class CourseError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// ---- Catalog: available course offerings ----

interface AvailableOfferingsFilters {
  semesterId?: number;
  department?: string;
  category?: string;
  level?: string;
  search?: string;
}

export async function getAvailableOfferings(filters: AvailableOfferingsFilters) {
  return prisma.courseOffering.findMany({
    where: {
      semesterId: filters.semesterId,
      course: {
        department: filters.department,
        category: filters.category,
        level: filters.level,
        ...(filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { code: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    },
    include: {
      course: true,
      semester: true,
      teacher: { select: { id: true, name: true } },
    },
    orderBy: [{ course: { department: "asc" } }, { course: { code: "asc" } }],
  });
}

// ---- My enrollments (Courses.tsx) ----

export async function getMyEnrollments(studentId: number) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      semesterRegistration: { studentId },
    },
    include: {
      courseOffering: {
        include: {
          course: true,
          semester: true,
          teacher: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  });

  return enrollments.map((e) => ({
    id: e.id,
    courseOfferingId: e.courseOfferingId,
    code: e.courseOffering.course.code,
    name: e.courseOffering.course.name,
    instructor: e.courseOffering.teacher?.name ?? "TBA",
    credits: e.courseOffering.course.credits,
    schedule: `${e.courseOffering.scheduleDays.join(", ")} · ${e.courseOffering.startTime}`,
    room: e.courseOffering.room,
    semester: e.courseOffering.semester.name,
    status: e.status,
  }));
}

// ---- Schedule conflict helpers ----

function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}

function daysOverlap(days1: string[], days2: string[]): boolean {
  return days1.some((d) => days2.includes(d));
}

function offeringsConflict(
  a: { scheduleDays: string[]; startTime: string; endTime: string },
  b: { scheduleDays: string[]; startTime: string; endTime: string }
): boolean {
  return (
    daysOverlap(a.scheduleDays, b.scheduleDays) &&
    timeRangesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)
  );
}

// ---- Registration ----
// Registers a student into a set of course offerings for a given semester.
// All business rules are re-validated server-side and run in a single atomic transaction.

export async function registerCourses(studentId: number, offeringIds: number[], semesterId: number) {
  return prisma.$transaction(async (tx) => {
    // 1. Get or create the SemesterRegistration for this student+semester.
    let semReg = await tx.semesterRegistration.findUnique({
      where: { studentId_semesterId: { studentId, semesterId } },
    });
    if (!semReg) {
      semReg = await tx.semesterRegistration.create({
        data: { studentId, semesterId, maxCredits: 18, status: "active" },
      });
    }
    if (semReg.status === "dropped") {
      throw new CourseError("Your semester registration has been dropped", 400);
    }

    // 2. Load the selected offerings with their course info.
    const selectedOfferings = await tx.courseOffering.findMany({
      where: { id: { in: offeringIds } },
      include: { course: true },
    });

    if (selectedOfferings.length !== offeringIds.length) {
      throw new CourseError("One or more selected course offerings were not found", 404);
    }

    // All offerings must belong to the same semester.
    if (selectedOfferings.some((o) => o.semesterId !== semesterId)) {
      throw new CourseError("All selected offerings must be in the same semester", 400);
    }

    // 3. Student's current enrollments for this semester registration.
    const existingEnrollments = await tx.enrollment.findMany({
      where: { semesterRegistrationId: semReg.id },
      include: {
        courseOffering: { include: { course: true } },
      },
    });

    const activeEnrollments = existingEnrollments.filter((e) => e.status !== "dropped");
    const completedCodes = new Set(
      existingEnrollments
        .filter((e) => e.status === "completed")
        .map((e) => e.courseOffering.course.code)
    );
    const activeCodes = new Set(activeEnrollments.map((e) => e.courseOffering.course.code));

    // 4. Duplicate check — already actively enrolled in this offering.
    const duplicate = selectedOfferings.find((o) => activeCodes.has(o.course.code));
    if (duplicate) {
      throw new CourseError(
        `Already registered for ${duplicate.course.code} this semester`,
        409
      );
    }

    // 5. Credit limits.
    const existingCredits = activeEnrollments.reduce(
      (sum, e) => sum + e.courseOffering.course.credits,
      0
    );
    const newCredits = selectedOfferings.reduce((sum, o) => sum + o.course.credits, 0);
    const totalCredits = existingCredits + newCredits;

    if (totalCredits > semReg.maxCredits) {
      throw new CourseError(
        `Total credits (${totalCredits}) exceeds your semester limit of ${semReg.maxCredits}`,
        400
      );
    }

    // 6. Schedule conflicts — new-vs-new and new-vs-existing.
    const allToCheck = [
      ...selectedOfferings,
      ...activeEnrollments.map((e) => e.courseOffering),
    ];
    for (let i = 0; i < selectedOfferings.length; i++) {
      for (let j = 0; j < allToCheck.length; j++) {
        const a = selectedOfferings[i];
        const b = allToCheck[j];
        if (a.id === b.id) continue;
        if (offeringsConflict(a, b)) {
          throw new CourseError(
            `Schedule conflict between ${a.course.code} and ${(b as typeof a).course?.code ?? b.id}`,
            409
          );
        }
      }
    }

    // 7. Prerequisites — completed or in this batch.
    const batchCodes = new Set(selectedOfferings.map((o) => o.course.code));
    for (const offering of selectedOfferings) {
      const prereqs = await tx.coursePrerequisite.findMany({
        where: { courseId: offering.courseId },
        include: { prerequisite: true },
      });
      const missing = prereqs.filter(
        (p) => !completedCodes.has(p.prerequisite.code) && !batchCodes.has(p.prerequisite.code)
      );
      if (missing.length > 0) {
        throw new CourseError(
          `${offering.course.code} requires: ${missing.map((m) => m.prerequisite.code).join(", ")}`,
          400
        );
      }
    }

    // 8. Seats — atomic conditional increment.
    for (const offering of selectedOfferings) {
      const result = await tx.courseOffering.updateMany({
        where: { id: offering.id, seatsTaken: { lt: offering.seatsTotal } },
        data: { seatsTaken: { increment: 1 } },
      });
      if (result.count === 0) {
        throw new CourseError(`No seats left in ${offering.course.code}`, 409);
      }
    }

    // All checks passed — create enrollments.
    await tx.enrollment.createMany({
      data: selectedOfferings.map((o) => ({
        semesterRegistrationId: semReg.id,
        courseOfferingId: o.id,
      })),
    });

    return tx.enrollment.findMany({
      where: {
        semesterRegistrationId: semReg.id,
        courseOfferingId: { in: selectedOfferings.map((o) => o.id) },
      },
      include: { courseOffering: { include: { course: true } } },
    });
  });
}

// ---- Drop ----

export async function dropEnrollment(studentId: number, enrollmentId: number) {
  return prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { semesterRegistration: true },
    });

    if (!enrollment || enrollment.semesterRegistration.studentId !== studentId) {
      throw new CourseError("Enrollment not found", 404);
    }
    if (enrollment.status === "dropped") {
      throw new CourseError("Course is already dropped", 400);
    }

    await tx.enrollment.update({
      where: { id: enrollmentId },
      data: { status: "dropped" },
    });

    // Free the seat back up.
    await tx.courseOffering.update({
      where: { id: enrollment.courseOfferingId },
      data: { seatsTaken: { decrement: 1 } },
    });
  });
}
