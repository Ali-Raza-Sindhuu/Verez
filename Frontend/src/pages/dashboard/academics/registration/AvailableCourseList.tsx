import { SearchX, Inbox } from "lucide-react";
import { CourseRegistrationCard } from "./CourseRegistrationCard";
import { cx } from "./token";
import type { Course } from "./types";

interface AvailableCourseListProps {
  courses: Course[];
  selectedIds: Set<number>;
  registeredCodes: Set<string>;
  onToggle: (id: number) => void;
  onViewDetails: (course: Course) => void;
  loading: boolean;
  hasAnySemesterCourses: boolean;
  hasActiveSearch: boolean;
}

function CourseCardSkeleton() {
  return (
    <div className={`${cx.card} p-4 sm:p-5 animate-pulse`}>
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 rounded-md shrink-0 ${cx.cardAlt}`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className={`h-2.5 w-16 rounded ${cx.cardAlt}`} />
          <div className={`h-4 w-48 rounded ${cx.cardAlt}`} />
          <div className={`h-2.5 w-32 rounded ${cx.cardAlt}`} />
        </div>
        <div className={`hidden sm:block w-20 h-8 rounded-full shrink-0 ${cx.cardAlt}`} />
        <div className={`w-20 h-8 rounded-full shrink-0 ${cx.cardAlt}`} />
      </div>
    </div>
  );
}

export function AvailableCourseList({
  courses,
  selectedIds,
  registeredCodes,
  onToggle,
  onViewDetails,
  loading,
  hasAnySemesterCourses,
  hasActiveSearch,
}: AvailableCourseListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!hasAnySemesterCourses) {
    return (
      <div className={`${cx.card} py-16 flex flex-col items-center justify-center text-center px-6`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cx.cardAlt}`}>
          <Inbox className={`w-5 h-5 ${cx.textTertiary}`} />
        </div>
        <p className={`text-sm font-medium ${cx.textPrimary}`}>No courses available yet</p>
        <p className={`text-xs mt-1 max-w-xs ${cx.textSecondary}`}>
          Course offerings for this semester haven't been published. Check back soon.
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={`${cx.card} py-16 flex flex-col items-center justify-center text-center px-6`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cx.cardAlt}`}>
          <SearchX className={`w-5 h-5 ${cx.textTertiary}`} />
        </div>
        <p className={`text-sm font-medium ${cx.textPrimary}`}>
          {hasActiveSearch ? "No courses match your search" : "No courses in this category"}
        </p>
        <p className={`text-xs mt-1 max-w-xs ${cx.textSecondary}`}>
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courses.map((c) => (
        <CourseRegistrationCard
          key={c.id}
          course={c}
          selected={selectedIds.has(c.id)}
          onToggle={() => onToggle(c.id)}
          onViewDetails={() => onViewDetails(c)}
        />
      ))}
    </div>
  );
}