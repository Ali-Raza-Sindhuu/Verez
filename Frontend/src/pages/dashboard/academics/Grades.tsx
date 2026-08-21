import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Award, BookOpen, CheckCircle2, GraduationCap, Search, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchGPAOverview,
  fetchSemesterHistory,
  fetchSemesterCourses,
  fetchCourseGradeDetail,
  setSelectedSemester,
  clearCurrentCourse,
  selectGPAOverview,
  selectGPAOverviewMeta,
  selectSemesterHistory,
  selectSemesterHistoryMeta,
  selectSelectedSemester,
  selectSemesterCourses,
  selectSemesterCoursesMeta,
  selectCurrentCourseGrade,
  selectCurrentCourseGradeMeta,
  type CourseGradeListItem,
} from "@/store/features/grades/gradesSlice";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from"@/components/ui/sheet";

const GRADE_SCALE = [
  { letter: "A", points: "4.0", range: "90–100%" },
  { letter: "A-", points: "3.7", range: "85–89%" },
  { letter: "B+", points: "3.3", range: "80–84%" },
  { letter: "B", points: "3.0", range: "75–79%" },
  { letter: "B-", points: "2.7", range: "70–74%" },
  { letter: "C+", points: "2.3", range: "65–69%" },
  { letter: "C", points: "2.0", range: "60–64%" },
  { letter: "F", points: "0.0", range: "0–59%" },
];

function performanceMessage(percentage: number | null): { title: string; note: string } | null {
  if (percentage == null) return null;
  if (percentage >= 90) return { title: "Excellent Performance!", note: "You're doing great in this course." };
  if (percentage >= 80) return { title: "Great Work!", note: "You're maintaining a strong grade in this course." };
  if (percentage >= 70) return { title: "Good Progress!", note: "Keep it up — there's room to push a bit higher." };
  return { title: "Needs Improvement", note: "Consider reaching out to your instructor for support." };
}

type MainTab = "overview" | "current" | "all-semesters" | "transcript";

function GPATrendChart({ trend }: { trend: { semester: string; gpa: number | null }[] }) {
  if (trend.length === 0) return null;
  const validTrend = trend.filter((s) => s.gpa != null) as { semester: string; gpa: number }[];
  
  const w = 480;
  const h = 160;
  const min = 2.0;
  const max = 4.0;
  const scaleY = (v: number) => h - ((v - min) / (max - min)) * h;
  const points = validTrend.map((s, i) => ({ x: (i / Math.max(1, validTrend.length - 1)) * w, y: scaleY(s.gpa), ...s }));
  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = validTrend.length > 0 ? `0,${h} ${linePoints} ${w},${h}` : "";
  const latest = trend[trend.length - 1];
  const yTicks = [2.0, 2.5, 3.0, 3.5, 4.0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <h2 className="text-base font-semibold">GPA Trend</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your GPA performance across semesters</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-semibold text-primary">{latest.gpa != null ? latest.gpa.toFixed(2) : "—"}</div>
          <div className="text-[10px] text-muted-foreground">Latest GPA</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex flex-col justify-between text-[10px] text-muted-foreground py-1 shrink-0">
            {yTicks.slice().reverse().map((t) => (
              <span key={t}>{t.toFixed(1)}</span>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none" role="img" aria-label="GPA trend across semesters">
              <defs>
                <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
                </linearGradient>
              </defs>
              {yTicks.map((t) => (
                <line key={t} x1={0} x2={w} y1={scaleY(t)} y2={scaleY(t)} stroke="currentColor" className="text-border" strokeWidth="1" />
              ))}
              <polygon points={areaPoints} fill="url(#gpaFill)" />
              <polyline points={linePoints} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle key={p.semester} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4.5 : 3} fill="currentColor" className="text-primary" />
              ))}
            </svg>
            <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
              {validTrend.map((s) => (
                <span key={s.semester}>{s.semester}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Grades() {
  const dispatch = useAppDispatch();

  const overview = useAppSelector(selectGPAOverview);
  const overviewMeta = useAppSelector(selectGPAOverviewMeta);

  const semesterHistory = useAppSelector(selectSemesterHistory);
  const semesterHistoryMeta = useAppSelector(selectSemesterHistoryMeta);

  const selectedsemester = useAppSelector(selectSelectedSemester);
  const courses = useAppSelector(selectSemesterCourses);
  const coursesMeta = useAppSelector(selectSemesterCoursesMeta);

  const currentCourse = useAppSelector(selectCurrentCourseGrade);
  const currentCourseMeta = useAppSelector(selectCurrentCourseGradeMeta);

  const [tab, setTab] = useState<MainTab>("overview");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchGPAOverview());
    dispatch(fetchSemesterHistory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedsemester) {
      dispatch(fetchSemesterCourses(selectedsemester));
    }
  }, [dispatch, selectedsemester]);

  const departments = useMemo(
    () => ["all", ...Array.from(new Set(courses.map((c) => c.department)))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery =
        c.courseName.toLowerCase().includes(query.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(query.toLowerCase());
      const matchesDept = department === "all" || c.department === department;
      return matchesQuery && matchesDept;
    });
  }, [courses, query, department]);

  const handleViewDetails = (course: CourseGradeListItem) => {
    setSelectedCourseId(course.courseOfferingId);
    dispatch(fetchCourseGradeDetail(course.courseOfferingId));
  };

  const handleCloseDrawer = () => {
    setSelectedCourseId(null);
    dispatch(clearCurrentCourse());
  };

  const overviewLoading = overviewMeta.status === "loading" || overviewMeta.status === "idle";
  const semesterLabel = semesterHistory.find((s) => s.semester === selectedsemester)?.semester ?? "";
  const showFutureTab = tab === "all-semesters" || tab === "transcript";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grades & GPA</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your academic performance and progress.</p>
        </div>
        <Select value={selectedsemester ?? undefined} onValueChange={(v) => dispatch(setSelectedSemester(v))}>
          <SelectTrigger className="w-[160px] self-start sm:self-auto">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesterHistory.map((s) => (
              <SelectItem key={s.semester} value={s.semester}>
                {s.semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as MainTab)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="current">Current Semester</TabsTrigger>
          <TabsTrigger value="all-semesters">All Semesters</TabsTrigger>
          <TabsTrigger value="transcript">Academic Transcript</TabsTrigger>
        </TabsList>
      </Tabs>

      {showFutureTab ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">
              {tab === "all-semesters" ? "No academic history available." : "Academic transcript coming soon."}
            </p>
            <p className="text-xs text-muted-foreground mt-1">This view will be available once connected to the backend.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* GPA Overview cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            ) : overviewMeta.status === "failed" || !overview ? (
              <Card className="col-span-2 lg:col-span-4">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Failed to load GPA overview.{" "}
                  <button className="text-primary underline" onClick={() => dispatch(fetchGPAOverview())}>
                    Retry
                  </button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">Current GPA</span>
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-2xl font-semibold">
                      {overview.currentGPA != null ? overview.currentGPA.toFixed(2) : "—"} <span className="text-sm text-muted-foreground font-normal">/ 4.00</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1.5">vs last semester</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">Semester GPA</span>
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-2xl font-semibold">
                      {overview.semesterGPA != null ? overview.semesterGPA.toFixed(2) : "—"} <span className="text-sm text-muted-foreground font-normal">/ 4.00</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1.5">{overview.currentSemester ?? "Current"}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">Earned Credits</span>
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-2xl font-semibold mb-2">
                      {overview.earnedCredits} <span className="text-sm text-muted-foreground font-normal">/ {overview.totalCredits}</span>
                    </div>
                    <Progress value={(overview.earnedCredits / overview.totalCredits) * 100} className="h-1.5" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">Academic Standing</span>
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-lg font-semibold">{overview.academicStanding}</div>
                    <div className="text-xs text-muted-foreground mt-1.5">• {overview.onTrack ? "On track to graduate" : "Needs attention"}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Trend + history */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {overviewLoading ? (
                <Skeleton className="h-64 rounded-2xl" />
              ) : overview ? (
                <GPATrendChart trend={overview.gpaTrend} />
              ) : null}
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <h2 className="text-base font-semibold">Semester GPA History</h2>
                <Button variant="link" size="sm" className="gap-1 h-auto p-0">
                  View Transcript <ArrowRight className="w-3 h-3" />
                </Button>
              </CardHeader>
              <CardContent>
                {semesterHistoryMeta.status === "loading" ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 rounded-lg" />
                    ))}
                  </div>
                ) : semesterHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No academic history available.</p>
                ) : (
                  <div className="space-y-1">
                    {semesterHistory
                      .slice()
                      .reverse()
                      .map((s) => (
                        <div
                          key={s.semester}
                          className={`grid grid-cols-4 items-center px-3 py-2.5 rounded-xl text-sm ${
                            s.status === "current" ? "bg-primary/5 border border-primary/15" : ""
                          }`}
                        >
                          <span className="truncate">{s.semester}</span>
                          <span className="text-right font-medium">{s.gpa != null ? s.gpa.toFixed(2) : "—"}</span>
                          <span className="text-right text-muted-foreground">{s.credits}</span>
                          <span className={`text-right text-xs ${s.status === "current" ? "text-primary" : "text-muted-foreground"}`}>
                            {s.status === "current" ? "Current" : "Passed"}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Course grades */}
          <div>
            <h2 className="text-base font-semibold mb-4">Course Grades — {semesterLabel}</h2>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <Select value={department} onValueChange={(v) => setDepartment(v ?? "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d === "all" ? "All Courses" : d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedsemester ?? undefined} onValueChange={(v) => dispatch(setSelectedSemester(v))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesterHistory.map((s) => (
                    <SelectItem key={s.semester} value={s.semester}>
                      {s.semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="pl-9"
                />
              </div>
            </div>

            {coursesMeta.status === "loading" ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : coursesMeta.status === "failed" ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Failed to load course grades.{" "}
                  <button className="text-primary underline" onClick={() => selectedsemester && dispatch(fetchSemesterCourses(selectedsemester))}>
                    Retry
                  </button>
                </CardContent>
              </Card>
            ) : filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-sm font-medium">{query ? "No courses match your search." : "No grades available yet."}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {filteredCourses.map((c) => {
                  const examsPct = c.components.exams.total > 0 ? Math.round((c.components.exams.earned / c.components.exams.total) * 100) : 0;
                  return (
                    <Card key={c.id}>
                      <CardContent className="py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-muted-foreground">{c.courseCode}</div>
                            <h3 className="text-sm font-medium truncate">{c.courseName}</h3>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {c.credits} Credits • {c.department}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 sm:gap-6 sm:w-auto w-full">
                            <div>
                              <div className="text-[10px] text-muted-foreground mb-0.5">Assignments</div>
                              <div className="text-xs">
                                {c.components.assignments.earned} / {c.components.assignments.total}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-muted-foreground mb-0.5">Quizzes</div>
                              <div className="text-xs">
                                {c.components.quizzes.earned} / {c.components.quizzes.total}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-muted-foreground mb-0.5">Exams</div>
                              <div className="text-xs">
                                {c.components.exams.earned} / {c.components.exams.total} ({examsPct}%)
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                            <div className="text-right">
                              <div className="text-lg font-semibold">{c.letterGrade ?? "—"}</div>
                              <div className="text-xs text-muted-foreground">{c.percentage != null ? `${c.percentage}%` : "—"}</div>
                            </div>
                            <Button size="sm" variant="secondary" onClick={() => handleViewDetails(c)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Grade scale */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">Grade Scale</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {GRADE_SCALE.map((g) => (
                  <div key={g.letter} className="rounded-xl border px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{g.letter}</span>
                      <span className="text-xs text-primary">{g.points}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{g.range}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Course details drawer */}
      <Sheet open={selectedCourseId !== null} onOpenChange={(open) => !open && handleCloseDrawer()}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {currentCourseMeta.status === "loading" || !currentCourse ? (
            <div className="space-y-4 pt-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>{currentCourse.courseCode}</SheetTitle>
                <p className="text-sm text-muted-foreground">{currentCourse.courseName}</p>
              </SheetHeader>

              <div className="mt-5 space-y-6">
                <div>
                  <div className="text-xs font-medium mb-1.5">Description</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{currentCourse.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Credits", value: String(currentCourse.credits) },
                    { label: "Department", value: currentCourse.department },
                    { label: "Semester", value: currentCourse.semester },
                    { label: "Instructor", value: currentCourse.instructor },
                    { label: "Final Grade", value: currentCourse.letterGrade != null ? `${currentCourse.letterGrade} (${currentCourse.percentage}%)` : "—" },
                    { label: "Grade Points", value: currentCourse.gradePoints != null ? `${currentCourse.gradePoints.toFixed(2)} / 4.00` : "—" },
                  ].map((r) => (
                    <div key={r.label} className="rounded-xl border p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{r.label}</div>
                      <div className="text-sm truncate">{r.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-xs font-medium mb-3">Assessment Breakdown</div>
                  <div className="space-y-4">
                    {currentCourse.componentsDetailed.map((b) => {
                      const pct = b.total > 0 ? Math.round((b.earned / b.total) * 100) : 0;
                      return (
                        <div key={b.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs">{b.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {b.earned} / {b.total}
                            </span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {(() => {
                  const perf = performanceMessage(currentCourse.percentage);
                  if (!perf) return null;
                  return (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <div className="text-sm font-medium text-primary mb-0.5">{perf.title}</div>
                      <div className="text-xs text-muted-foreground">{perf.note}</div>
                    </div>
                  );
                })()}

                <Button variant="outline" className="w-full gap-1.5" disabled>
                  View Full Grade Report
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
