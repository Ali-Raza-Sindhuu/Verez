import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import coursesReducer from "./features/course/courseSlice";
import assignmentsReducer from "./features/assignments/assignmentSlice";
import gradesReducer from "./features/grades/gradesSlice";
import { injectStore } from "@/lib/api";

// NOTE: no semesterSlice exists in this project — each domain (grades,
// assessments, attendance) tracks its own `selectedSemesterId` locally,
// seeded from that domain's own "current semester" API response, rather
// than inventing a shared cross-cutting slice that wasn't asked for.

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    assignments: assignmentsReducer,
    grades: gradesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Give the axios client access to the store for reading the access token
// and dispatching auth actions on refresh/logout, without a circular import.
injectStore(store);