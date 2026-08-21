import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Course, RegistrationFilters, RegistrationStep } from "./types";
import { detectConflicts, totalCreditsOf } from "./conflicts";
import { RegistrationHeader } from "./RegistrationHeader";
import { RegistrationSteps } from "./RegistrationSteps";
import { CourseFilters } from "./CourseFilters";
import { CourseTabs } from "./CourseTabs";
import { AvailableCourseList } from "./AvailableCourseList";
import { CourseDetails } from "./CourseDetails";
import { RegistrationSummary } from "./RegistrationSummary";
import { RegistrationRules } from "./RegistrationRules";
import { RegistrationActions } from "./RegistrationActions";
import { ConflictAlert } from "./ConflictAlert";
import { ReviewSchedule } from "./ReviewSchedule";
import { ConfirmRegistration } from "./ConfirmRegistration";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchAvailableCourses,
  fetchMyEnrollments,
  registerCourses,
  selectAvailableCourses,
  selectAvailableCoursesStatus,
  selectMyEnrollments,
  selectMyEnrollmentsStatus,
  selectRegisterStatus,
  selectRegisterError,
  clearRegisterError,
  type AvailableCourse,
} from "@/store/features/course/courseSlice";

const initialFilters: RegistrationFilters = {
  search: "",
  department: "all",
  level: "all",
  category: "all",
};

// Backend's AvailableCourse is flat (scheduleDays/startTime/endTime/room at
// the top level); this module's presentational components expect a nested
// `schedule` object. Map at the boundary so none of the card/detail/summary
// components need to change.
function toLocalCourse(c: AvailableCourse): Course {
  return {
    id: c.id,
    code: c.course.code,
    name: c.course.name,
    description: c.course.description,
    category: c.course.category as any,
    department: c.course.department,
    instructor: c.teacher?.name ?? "TBA",
    credits: c.course.credits,
    level: c.course.level as any,
    seatsTotal: c.seatsTotal,
    seatsTaken: c.seatsTaken,
    prerequisites: [],
    schedule: {
      days: c.scheduleDays,
      startTime: c.startTime,
      endTime: c.endTime,
      room: c.room,
    },
  };
}

interface CourseRegistrationProps {
  onBack: () => void;
  onDone: () => void;
}

export default function CourseRegistration({ onBack, onDone }: CourseRegistrationProps) {
  const dispatch = useAppDispatch();

  const availableCourses = useAppSelector(selectAvailableCourses);
  const availableStatus = useAppSelector(selectAvailableCoursesStatus);
  const loading = availableStatus === "idle" || availableStatus === "loading";

  const myEnrollments = useAppSelector(selectMyEnrollments);
  const enrollmentsStatus = useAppSelector(selectMyEnrollmentsStatus);

  const registerStatus = useAppSelector(selectRegisterStatus);
  const registerError = useAppSelector(selectRegisterError);

  const [step, setStep] = useState<RegistrationStep>(1);
  const [filters, setFilters] = useState<RegistrationFilters>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [detailsCourse, setDetailsCourse] = useState<Course | null>(null);
  const [registered, setRegistered] = useState<Course[]>([]);

  useEffect(() => {
    if (availableStatus === "idle") dispatch(fetchAvailableCourses(undefined));
  }, [availableStatus, dispatch]);

  useEffect(() => {
    if (enrollmentsStatus === "idle") dispatch(fetchMyEnrollments());
  }, [enrollmentsStatus, dispatch]);

  const allCourses = useMemo(() => availableCourses.map(toLocalCourse), [availableCourses]);

  // Real enrollment data, not mock arrays — used only for instant client-side
  // feedback in detectConflicts(); the backend re-validates all of this.
  const registeredCodes = useMemo(
    () => new Set(myEnrollments.filter((e) => e.status !== "dropped").map((e) => e.code)),
    [myEnrollments]
  );
  const completedCodes = useMemo(
    () => myEnrollments.filter((e) => e.status === "completed").map((e) => e.code),
    [myEnrollments]
  );

  const departments = useMemo(
    () => Array.from(new Set(allCourses.map((c) => c.department))).sort(),
    [allCourses]
  );

  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      const matchesDept = filters.department === "all" || c.department === filters.department;
      const matchesLevel = filters.level === "all" || c.level === filters.level;
      const matchesCategory = filters.category === "all" || c.category === filters.category;
      return matchesSearch && matchesDept && matchesLevel && matchesCategory;
    });
  }, [allCourses, filters]);

  const selectedCourses = useMemo(
    () => allCourses.filter((c) => selectedIds.has(c.id)),
    [allCourses, selectedIds]
  );

  const conflicts = useMemo(
    () => detectConflicts(selectedCourses, Array.from(registeredCodes), completedCodes),
    [selectedCourses, registeredCodes, completedCodes]
  );
  const totalCredits = totalCreditsOf(selectedCourses);

  function toggleCourse(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeCourse(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function clearAll() {
    setSelectedIds(new Set());
  }

  async function handleConfirmRegistration() {
    dispatch(clearRegisterError());
    const result = await dispatch(registerCourses({ offeringIds: Array.from(selectedIds), semesterId: 1 }));
    if (registerCourses.fulfilled.match(result)) {
      setRegistered(selectedCourses);
      setStep(3);
      // Registered courses now show up in My Courses — refresh so it's
      // current next time the student navigates there.
      dispatch(fetchMyEnrollments());
    }
    // On rejection, registerError is already populated in the slice and
    // surfaced via ConflictAlert/RegistrationActions below — stay on step 2.
  }

  return (
    <div className="max-w-7xl mx-auto">
      <RegistrationHeader onBack={onBack} />
      <RegistrationSteps current={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 min-w-0">
              <CourseFilters filters={filters} onChange={setFilters} departments={departments} />
              <CourseTabs
                active={filters.category}
                onChange={(category) => setFilters((f) => ({ ...f, category }))}
                count={filteredCourses.length}
              />
              <AvailableCourseList
                courses={filteredCourses}
                selectedIds={selectedIds}
                registeredCodes={registeredCodes}
                onToggle={toggleCourse}
                onViewDetails={setDetailsCourse}
                loading={loading}
                hasAnySemesterCourses={allCourses.length > 0 || loading}
                hasActiveSearch={filters.search.trim().length > 0}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6 space-y-4">
                <ConflictAlert conflicts={conflicts} />
                <RegistrationSummary
                  selected={selectedCourses}
                  onRemove={removeCourse}
                  onClearAll={clearAll}
                />
                <RegistrationRules />
                <RegistrationActions
                  totalCredits={totalCredits}
                  hasBlockingConflicts={conflicts.length > 0}
                  onProceed={() => setStep(2)}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl mx-auto"
          >
            {registerError && (
              <div className="mb-4 rounded-xl border border-[var(--color-accent-danger)]/20 bg-[var(--color-accent-danger)]/5 px-4 py-3 text-sm text-[var(--color-accent-danger)]">
                {registerError}
              </div>
            )}
            <ReviewSchedule
              selected={selectedCourses}
              conflicts={conflicts}
              onBack={() => setStep(1)}
              onConfirm={handleConfirmRegistration}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <ConfirmRegistration registered={registered} onGoToMyCourses={onDone} />
          </motion.div>
        )}
      </AnimatePresence>

      <CourseDetails
        course={detailsCourse}
        selected={detailsCourse ? selectedIds.has(detailsCourse.id) : false}
        isRegistered={detailsCourse ? registeredCodes.has(detailsCourse.code) : false}
        onClose={() => setDetailsCourse(null)}
        onToggle={() => detailsCourse && toggleCourse(detailsCourse.id)}
      />
    </div>
  );
}