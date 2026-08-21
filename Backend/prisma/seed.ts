import { prisma } from "../src/config/database.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@verez.edu" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@verez.edu",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@verez.edu" },
    update: {},
    create: {
      name: "Dr. Smith",
      email: "teacher@verez.edu",
      password: hashedPassword,
      role: "TEACHER",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "student1@verez.edu" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "student1@verez.edu",
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "student2@verez.edu" },
    update: {},
    create: {
      name: "Bob Smith",
      email: "student2@verez.edu",
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  const year = await prisma.academicYear.create({
    data: {
      name: "2026-2027",
      startDate: new Date("2026-08-01"),
      endDate: new Date("2027-05-31"),
    },
  });

  const fallSemester = await prisma.semester.create({
    data: {
      academicYearId: year.id,
      name: "Fall 2026",
      term: "FALL",
      startDate: new Date("2026-08-15"),
      endDate: new Date("2026-12-15"),
    },
  });

  const courseCS101 = await prisma.course.create({
    data: {
      code: "CS101",
      name: "Intro to Computer Science",
      description: "Basics of programming",
      department: "Computer Science",
      category: "core",
      level: "100",
      credits: 3,
    },
  });

  const offering = await prisma.courseOffering.create({
    data: {
      courseId: courseCS101.id,
      semesterId: fallSemester.id,
      teacherId: teacher.id,
      scheduleDays: ["Mon", "Wed", "Fri"],
      startTime: "10:00",
      endTime: "11:00",
      room: "Room 101",
      seatsTotal: 30,
    },
  });

  const reg = await prisma.semesterRegistration.create({
    data: {
      studentId: student1.id,
      semesterId: fallSemester.id,
      maxCredits: 18,
      status: "active",
    },
  });

  await prisma.enrollment.create({
    data: {
      semesterRegistrationId: reg.id,
      courseOfferingId: offering.id,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
