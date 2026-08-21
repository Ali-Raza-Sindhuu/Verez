import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// ---- Types (mirrors backend DTOs exactly) ----

export type AssignmentStatus = "UPCOMING" | "OVERDUE" | "SUBMITTED" | "LATE" | "GRADED";

export interface AssignmentListItem {
  id: number;
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  title: string;
  type: string;
  points: number;
  dueDate: string;
  status: AssignmentStatus;
}

export interface AssignmentSubmission {
  id: number;
  state: string;
  submittedAt: string;
  isLate: boolean;
  textContent: string | null;
  linkUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  comments: string | null;
}

export interface AssignmentDetails extends AssignmentListItem {
  description: string;
  instructions: string | null;
  submissionType: string;
  allowLateSubmit: boolean;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  instructor: string;
  attachments: { id: number; fileName: string; fileType: string; fileSize: number }[];
  submission: AssignmentSubmission | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AssignmentFilters {
  courseOfferingId?: number;
  status?: AssignmentStatus;
  type?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: "dueDate" | "createdAt" | "points";
  sortOrder?: "asc" | "desc";
}

export interface SubmissionInput {
  textContent?: string;
  linkUrl?: string;
  comments?: string;
  file?: { fileName: string; fileType: string; fileSize: number };
}

interface AssignmentsState {
  list: AssignmentListItem[];
  pagination: Pagination | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";

  currentAssignment: AssignmentDetails | null;
  currentAssignmentStatus: "idle" | "loading" | "succeeded" | "failed";

  submitStatus: "idle" | "loading" | "succeeded" | "failed";
  submitError: string | null;

  error: string | null;
}

const initialState: AssignmentsState = {
  list: [],
  pagination: null,
  listStatus: "idle",
  currentAssignment: null,
  currentAssignmentStatus: "idle",
  submitStatus: "idle",
  submitError: null,
  error: null,
};

function extractErrorMessage(error: unknown, fallback: string): string {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? fallback;
}

// ---- Thunks ----

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (filters: AssignmentFilters | undefined, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/assignments", { params: filters });
      return { data: res.data.data as AssignmentListItem[], pagination: res.data.pagination as Pagination };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load assignments"));
    }
  }
);

export const fetchAssignmentDetails = createAsyncThunk(
  "assignments/fetchAssignmentDetails",
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/assignments/${assignmentId}`);
      return res.data.data as AssignmentDetails;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load assignment"));
    }
  }
);

export const createSubmission = createAsyncThunk(
  "assignments/createSubmission",
  async (
    { assignmentId, input }: { assignmentId: number; input: SubmissionInput },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/api/assignments/${assignmentId}/submission`, input);
      return res.data.data as AssignmentSubmission;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Submission failed"));
    }
  }
);

export const updateSubmission = createAsyncThunk(
  "assignments/updateSubmission",
  async (
    { assignmentId, input }: { assignmentId: number; input: SubmissionInput },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(`/api/assignments/${assignmentId}/submission`, input);
      return res.data.data as AssignmentSubmission;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Update failed"));
    }
  }
);

export const deleteSubmission = createAsyncThunk(
  "assignments/deleteSubmission",
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/assignments/${assignmentId}/submission`);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to delete submission"));
    }
  }
);

// ---- Slice ----

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearCurrentAssignment(state) {
      state.currentAssignment = null;
      state.currentAssignmentStatus = "idle";
    },
    clearSubmitError(state) {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchAssignments.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) ?? "Something went wrong";
      })

      // Details
      .addCase(fetchAssignmentDetails.pending, (state) => {
        state.currentAssignmentStatus = "loading";
      })
      .addCase(fetchAssignmentDetails.fulfilled, (state, action: PayloadAction<AssignmentDetails>) => {
        state.currentAssignmentStatus = "succeeded";
        state.currentAssignment = action.payload;
      })
      .addCase(fetchAssignmentDetails.rejected, (state, action) => {
        state.currentAssignmentStatus = "failed";
        state.error = (action.payload as string) ?? "Something went wrong";
      })

      // Create submission
      .addCase(createSubmission.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(createSubmission.fulfilled, (state, action: PayloadAction<AssignmentSubmission>) => {
        state.submitStatus = "succeeded";
        if (state.currentAssignment) {
          state.currentAssignment.submission = action.payload;
        }
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = (action.payload as string) ?? "Submission failed";
      })

      // Update submission
      .addCase(updateSubmission.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(updateSubmission.fulfilled, (state, action: PayloadAction<AssignmentSubmission>) => {
        state.submitStatus = "succeeded";
        if (state.currentAssignment) {
          state.currentAssignment.submission = action.payload;
        }
      })
      .addCase(updateSubmission.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = (action.payload as string) ?? "Update failed";
      })

      // Delete submission
      .addCase(deleteSubmission.fulfilled, (state) => {
        if (state.currentAssignment) {
          state.currentAssignment.submission = null;
        }
      });
  },
});

export const { clearCurrentAssignment, clearSubmitError } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;

// ---- Selectors ----
export const selectAssignmentList = (state: { assignments: AssignmentsState }) => state.assignments.list;
export const selectAssignmentPagination = (state: { assignments: AssignmentsState }) => state.assignments.pagination;
export const selectAssignmentListStatus = (state: { assignments: AssignmentsState }) => state.assignments.listStatus;
export const selectCurrentAssignment = (state: { assignments: AssignmentsState }) => state.assignments.currentAssignment;
export const selectCurrentAssignmentStatus = (state: { assignments: AssignmentsState }) => state.assignments.currentAssignmentStatus;
export const selectSubmitStatus = (state: { assignments: AssignmentsState }) => state.assignments.submitStatus;
export const selectSubmitError = (state: { assignments: AssignmentsState }) => state.assignments.submitError;