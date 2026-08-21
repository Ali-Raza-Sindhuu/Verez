import { prisma } from "../../config/database.js";

// -- Academic Year --
export async function createAcademicYear(data: { name: string; startDate: Date; endDate: Date }) {
  return prisma.academicYear.create({ data });
}

// -- Semester --
export async function createSemester(data: { name: string; term: string; academicYearId: number; startDate: Date; endDate: Date }) {
  return prisma.semester.create({ data });
}

// -- Course (Catalog) --
export async function createCourse(data: { code: string; name: string; description: string; category: string; level: string; credits: number; department: string }) {
  return prisma.course.create({ data });
}

// -- Course Offering --
export async function createCourseOffering(data: {
  courseId: number;
  semesterId: number;
  teacherId?: number;
  scheduleDays: string[];
  startTime: string;
  endTime: string;
  room: string;
  seatsTotal: number;
}) {
  return prisma.courseOffering.create({
    data: {
      courseId: data.courseId,
      semesterId: data.semesterId,
      teacherId: data.teacherId,
      scheduleDays: data.scheduleDays,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
      seatsTotal: data.seatsTotal,
      seatsTaken: 0,
    },
  });
}

export async function assignTeacherToOffering(courseOfferingId: number, teacherId: number) {
  // ensure teacher exists and is a TEACHER
  const teacher = await prisma.user.findFirst({
    where: { id: teacherId, role: "TEACHER" }
  });
  if (!teacher) {
    throw new Error("Teacher not found or user is not a teacher");
  }

  return prisma.courseOffering.update({
    where: { id: courseOfferingId },
    data: { teacherId },
  });
}
