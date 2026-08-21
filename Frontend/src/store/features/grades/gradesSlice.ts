import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// ---- Types (mirrors backend DTOs exactly) ----

export type AcademicStanding = string; // backend-provided free text, e.g. "Good Standing"

export interface GPATrendPoint {
  semester: string;
  gpa: number | null;
  credits: number;
  status: "current" | "passed";
}

export interface GPAOverview {
  currentGPA: number | null;
  previousSemesterGPA: number | null;
  semesterGPA: number | null;
  currentSemester: string | null;
  earnedCredits: number;
  totalCredits: number;
  academicStanding: AcademicStanding;
  onTrack: boolean;
  gpaTrend: GPATrendPoint[];
}

export type SemesterStatus = "current" | "passed";

export interface SemesterGPA {
  semester: string;
  gpa: number | null;
  credits: number;
  status: SemesterStatus;
}

export interface CourseGradeListItem {
  id: number;
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  percentage: number | null;
  letterGrade: string | null;
  gradePoints: number | null;
  status: "completed" | "active";
  components: {
    assignments: { earned: number; total: number };
    quizzes: { earned: number; total: number };
    exams: { earned: number; total: number };
  };
}

export interface CourseGradeDetail extends CourseGradeListItem {
  description: string;
  instructor: string;
  semester: string;
  componentsDetailed: {
    label: string;
    earned: number;
    total: number;
  }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AsyncStatus {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface GradesState {
  overview: GPAOverview | null;
  overviewMeta: AsyncStatus;

  semesterHistory: SemesterGPA[];
  semesterHistoryMeta: AsyncStatus;

  selectedSemester: string | null;
  courses: CourseGradeListItem[];
  coursesMeta: AsyncStatus;

  currentCourse: CourseGradeDetail | null;
  currentCourseMeta: AsyncStatus;

  transcriptUrl: string | null;
  transcriptMeta: AsyncStatus;
}

const idleMeta: AsyncStatus = { status: "idle", error: null };

const initialState: GradesState = {
  overview: null,
  overviewMeta: idleMeta,

  semesterHistory: [],
  semesterHistoryMeta: idleMeta,

  selectedSemester: null,
  courses: [],
  coursesMeta: idleMeta,

  currentCourse: null,
  currentCourseMeta: idleMeta,

  transcriptUrl: null,
  transcriptMeta: idleMeta,
};

function extractErrorMessage(error: unknown, fallback: string): string {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? fallback;
}

// ---- Thunks ----

export const fetchGPAOverview = createAsyncThunk(
  "grades/fetchGPAOverview",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/grades/overview");
      return res.data.data as GPAOverview;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load GPA overview"));
    }
  }
);

export const fetchSemesterHistory = createAsyncThunk(
  "grades/fetchSemesterHistory",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/grades/semesters");
      return res.data.data as SemesterGPA[];
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load semester history"));
    }
  }
);

export const fetchSemesterCourses = createAsyncThunk(
  "grades/fetchSemesterCourses",
  async (semester: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/grades/semester/${semester}`);
      return { semester, data: res.data.data as CourseGradeListItem[] };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load course grades"));
    }
  }
);

export const fetchCourseGradeDetail = createAsyncThunk(
  "grades/fetchCourseGradeDetail",
  async (courseOfferingId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/grades/offerings/${courseOfferingId}`);
      return res.data.data as CourseGradeDetail;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load course grade detail"));
    }
  }
);

export const fetchTranscript = createAsyncThunk(
  "grades/fetchTranscript",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/grades/transcript");
      // Backend returns either a signed URL or file data depending on implementation.
      return res.data.data as { url: string };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load transcript"));
    }
  }
);

// ---- Slice ----

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    setSelectedSemester(state, action: PayloadAction<string | null>) {
      state.selectedSemester = action.payload;
    },
    clearCurrentCourse(state) {
      state.currentCourse = null;
      state.currentCourseMeta = idleMeta;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchGPAOverview.pending, (state) => {
        state.overviewMeta = { status: "loading", error: null };
      })
      .addCase(fetchGPAOverview.fulfilled, (state, action: PayloadAction<GPAOverview>) => {
        state.overviewMeta = { status: "succeeded", error: null };
        state.overview = action.payload;
      })
      .addCase(fetchGPAOverview.rejected, (state, action) => {
        state.overviewMeta = { status: "failed", error: (action.payload as string) ?? "Something went wrong" };
      })

      // Semester history
      .addCase(fetchSemesterHistory.pending, (state) => {
        state.semesterHistoryMeta = { status: "loading", error: null };
      })
      .addCase(fetchSemesterHistory.fulfilled, (state, action: PayloadAction<SemesterGPA[]>) => {
        state.semesterHistoryMeta = { status: "succeeded", error: null };
        state.semesterHistory = action.payload;
        if (!state.selectedSemester) {
          const current = action.payload.find((s) => s.status === "current");
          state.selectedSemester = current?.semester ?? action.payload[action.payload.length - 1]?.semester ?? null;
        }
      })
      .addCase(fetchSemesterHistory.rejected, (state, action) => {
        state.semesterHistoryMeta = { status: "failed", error: (action.payload as string) ?? "Something went wrong" };
      })

      // Semester courses
      .addCase(fetchSemesterCourses.pending, (state) => {
        state.coursesMeta = { status: "loading", error: null };
      })
      .addCase(fetchSemesterCourses.fulfilled, (state, action) => {
        state.coursesMeta = { status: "succeeded", error: null };
        state.courses = action.payload.data;
        state.selectedSemester = action.payload.semester;
      })
      .addCase(fetchSemesterCourses.rejected, (state, action) => {
        state.coursesMeta = { status: "failed", error: (action.payload as string) ?? "Something went wrong" };
      })

      // Course detail
      .addCase(fetchCourseGradeDetail.pending, (state) => {
        state.currentCourseMeta = { status: "loading", error: null };
      })
      .addCase(fetchCourseGradeDetail.fulfilled, (state, action: PayloadAction<CourseGradeDetail>) => {
        state.currentCourseMeta = { status: "succeeded", error: null };
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseGradeDetail.rejected, (state, action) => {
        state.currentCourseMeta = { status: "failed", error: (action.payload as string) ?? "Something went wrong" };
      })

      // Transcript
      .addCase(fetchTranscript.pending, (state) => {
        state.transcriptMeta = { status: "loading", error: null };
      })
      .addCase(fetchTranscript.fulfilled, (state, action) => {
        state.transcriptMeta = { status: "succeeded", error: null };
        state.transcriptUrl = action.payload.url;
      })
      .addCase(fetchTranscript.rejected, (state, action) => {
        state.transcriptMeta = { status: "failed", error: (action.payload as string) ?? "Something went wrong" };
      });
  },
});

export const { setSelectedSemester, clearCurrentCourse } = gradesSlice.actions;
export default gradesSlice.reducer;

// ---- Selectors ----
export const selectGPAOverview = (state: { grades: GradesState }) => state.grades.overview;
export const selectGPAOverviewMeta = (state: { grades: GradesState }) => state.grades.overviewMeta;

export const selectSemesterHistory = (state: { grades: GradesState }) => state.grades.semesterHistory;
export const selectSemesterHistoryMeta = (state: { grades: GradesState }) => state.grades.semesterHistoryMeta;

export const selectSelectedSemester = (state: { grades: GradesState }) => state.grades.selectedSemester;
export const selectSemesterCourses = (state: { grades: GradesState }) => state.grades.courses;
export const selectSemesterCoursesMeta = (state: { grades: GradesState }) => state.grades.coursesMeta;

export const selectCurrentCourseGrade = (state: { grades: GradesState }) => state.grades.currentCourse;
export const selectCurrentCourseGradeMeta = (state: { grades: GradesState }) => state.grades.currentCourseMeta;

export const selectTranscriptUrl = (state: { grades: GradesState }) => state.grades.transcriptUrl;
export const selectTranscriptMeta = (state: { grades: GradesState }) => state.grades.transcriptMeta;
