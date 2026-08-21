import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// ---- Types (mirrors backend DTOs exactly) ----

export interface MyEnrollment {
  id: number;
  courseOfferingId: number;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  semester: string;
  status: "active" | "dropped" | "completed"; // Updated from backend
}

export interface AvailableCourse {
  id: number; // This is courseOfferingId now
  courseId: number;
  semesterId: number;
  scheduleDays: string[];
  startTime: string;
  endTime: string;
  room: string;
  seatsTotal: number;
  seatsTaken: number;
  course: {
    code: string;
    name: string;
    description: string;
    department: string;
    category: string;
    level: string;
    credits: number;
  };
  semester: {
    name: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
}

export interface AvailableCoursesFilters {
  semesterId?: number;
  department?: string;
  category?: string;
  level?: string;
  search?: string;
}

interface CoursesState {
  myEnrollments: MyEnrollment[];
  myEnrollmentsStatus: "idle" | "loading" | "succeeded" | "failed";

  availableCourses: AvailableCourse[];
  availableCoursesStatus: "idle" | "loading" | "succeeded" | "failed";

  registerStatus: "idle" | "loading" | "succeeded" | "failed";
  registerError: string | null;

  dropStatus: "idle" | "loading" | "succeeded" | "failed";

  error: string | null;
}

const initialState: CoursesState = {
  myEnrollments: [],
  myEnrollmentsStatus: "idle",
  availableCourses: [],
  availableCoursesStatus: "idle",
  registerStatus: "idle",
  registerError: null,
  dropStatus: "idle",
  error: null,
};

function extractErrorMessage(error: unknown, fallback: string): string {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? fallback;
}

// ---- Thunks ----

export const fetchMyEnrollments = createAsyncThunk(
  "courses/fetchMyEnrollments",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/courses");
      return res.data.data as MyEnrollment[];
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load your courses"));
    }
  }
);

export const fetchAvailableCourses = createAsyncThunk(
  "courses/fetchAvailableCourses",
  async (filters: AvailableCoursesFilters | undefined, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/courses/available", { params: filters });
      return res.data.data as AvailableCourse[];
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load available courses"));
    }
  }
);

export const registerCourses = createAsyncThunk(
  "courses/registerCourses",
  async ({ offeringIds, semesterId }: { offeringIds: number[], semesterId: number }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/courses/register", { offeringIds, semesterId });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Registration failed"));
    }
  }
);

export const dropEnrollment = createAsyncThunk(
  "courses/dropEnrollment",
  async (enrollmentId: number, { rejectWithValue }) => {
    try {
      await api.patch(`/api/courses/enrollments/${enrollmentId}/drop`);
      return enrollmentId;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to drop course"));
    }
  }
);

// ---- Slice ----

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearRegisterError(state) {
      state.registerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // My enrollments
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.myEnrollmentsStatus = "loading";
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action: PayloadAction<MyEnrollment[]>) => {
        state.myEnrollmentsStatus = "succeeded";
        state.myEnrollments = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.myEnrollmentsStatus = "failed";
        state.error = (action.payload as string) ?? "Something went wrong";
      })

      // Available courses (catalog)
      .addCase(fetchAvailableCourses.pending, (state) => {
        state.availableCoursesStatus = "loading";
      })
      .addCase(fetchAvailableCourses.fulfilled, (state, action: PayloadAction<AvailableCourse[]>) => {
        state.availableCoursesStatus = "succeeded";
        state.availableCourses = action.payload;
      })
      .addCase(fetchAvailableCourses.rejected, (state, action) => {
        state.availableCoursesStatus = "failed";
        state.error = (action.payload as string) ?? "Something went wrong";
      })

      // Register (batch)
      .addCase(registerCourses.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerCourses.fulfilled, (state) => {
        state.registerStatus = "succeeded";
      })
      .addCase(registerCourses.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = (action.payload as string) ?? "Registration failed";
      })

      // Drop
      .addCase(dropEnrollment.pending, (state) => {
        state.dropStatus = "loading";
      })
      .addCase(dropEnrollment.fulfilled, (state, action: PayloadAction<number>) => {
        state.dropStatus = "succeeded";
        // Optimistically remove/mark dropped locally instead of refetching.
        state.myEnrollments = state.myEnrollments.filter((e) => e.id !== action.payload);
      })
      .addCase(dropEnrollment.rejected, (state, action) => {
        state.dropStatus = "failed";
        state.error = (action.payload as string) ?? "Failed to drop course";
      });
  },
});

export const { clearRegisterError } = coursesSlice.actions;
export default coursesSlice.reducer;

// ---- Selectors ----
export const selectMyEnrollments = (state: { courses: CoursesState }) => state.courses.myEnrollments;
export const selectMyEnrollmentsStatus = (state: { courses: CoursesState }) => state.courses.myEnrollmentsStatus;
export const selectAvailableCourses = (state: { courses: CoursesState }) => state.courses.availableCourses;
export const selectAvailableCoursesStatus = (state: { courses: CoursesState }) => state.courses.availableCoursesStatus;
export const selectRegisterStatus = (state: { courses: CoursesState }) => state.courses.registerStatus;
export const selectRegisterError = (state: { courses: CoursesState }) => state.courses.registerError;