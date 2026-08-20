import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Course, RegistrationFilters, RegistrationStep } from "./types";
import { mockCourses } from "./mockCourses";
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

const initialFilters: RegistrationFilters = {
  search: "",
  department: "all",
  level: "all",
  category: "all",
};

interface CourseRegistrationProps {
  onBack: () => void;
  onDone: () => void;
}

export default function CourseRegistration({ onBack, onDone }: CourseRegistrationProps) {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<RegistrationFilters>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailsCourse, setDetailsCourse] = useState<Course | null>(null);
  const [registered, setRegistered] = useState<Course[]>([]);

  // Simulated fetch — swap for GET /api/courses/available.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllCourses(mockCourses);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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

  const conflicts = useMemo(() => detectConflicts(selectedCourses), [selectedCourses]);
  const totalCredits = totalCreditsOf(selectedCourses);

  function toggleCourse(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeCourse(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function clearAll() {
    setSelectedIds(new Set());
  }

  function handleConfirmRegistration() {
    setRegistered(selectedCourses);
    setStep(3);
  }

  // TODO: once POST /api/course-registrations exists, call it in
  // handleConfirmRegistration above with selectedCourses, and only advance
  // to step 3 / setRegistered on success — treat this as the optimistic path.

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
              <CourseFilters filters={filters} onChange={setFilters} />
              <CourseTabs
                active={filters.category}
                onChange={(category) => setFilters((f) => ({ ...f, category }))}
                count={filteredCourses.length}
              />
              <AvailableCourseList
                courses={filteredCourses}
                selectedIds={selectedIds}
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
        onClose={() => setDetailsCourse(null)}
        onToggle={() => detailsCourse && toggleCourse(detailsCourse.id)}
      />
    </div>
  );
}