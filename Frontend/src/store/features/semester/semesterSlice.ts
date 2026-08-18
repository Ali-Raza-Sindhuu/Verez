import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Semester {
  id: string;
  label: string; // e.g. "Fall 2026"
  startDate: string; // ISO date
  endDate: string; // ISO date
  isCurrent?: boolean;
}

// ---- Mock data (replace with API fetch later — thunk/RTK Query when API exists) ----

const MOCK_SEMESTERS: Semester[] = [
  { id: "fall-2026", label: "Fall 2026", startDate: "2026-08-25", endDate: "2026-12-19", isCurrent: true },
  { id: "spring-2026", label: "Spring 2026", startDate: "2026-01-13", endDate: "2026-05-08" },
  { id: "fall-2025", label: "Fall 2025", startDate: "2025-08-25", endDate: "2025-12-19" },
];

const currentSemester = MOCK_SEMESTERS.find((s) => s.isCurrent) ?? MOCK_SEMESTERS[0];

interface SemesterState {
  semesters: Semester[];
  currentSemesterId: string; // the real "now" - not necessarily what's being viewed
  selectedSemesterId: string; // what the user is currently viewing
}

const initialState: SemesterState = {
  semesters: MOCK_SEMESTERS,
  currentSemesterId: currentSemester.id,
  selectedSemesterId: currentSemester.id,
};

const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    setSelectedSemesterId(state, action: PayloadAction<string>) {
      state.selectedSemesterId = action.payload;
    },
  },
});

export const { setSelectedSemesterId } = semesterSlice.actions;
export default semesterSlice.reducer;

// ---- Selectors ----

export const selectSemesters = (state: { semester: SemesterState }) => state.semester.semesters;

export const selectCurrentSemester = (state: { semester: SemesterState }) =>
  state.semester.semesters.find((s) => s.id === state.semester.currentSemesterId) ??
  state.semester.semesters[0];

export const selectSelectedSemester = (state: { semester: SemesterState }) =>
  state.semester.semesters.find((s) => s.id === state.semester.selectedSemesterId) ??
  state.semester.semesters[0];