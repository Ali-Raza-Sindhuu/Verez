import { configureStore } from "@reduxjs/toolkit";
import semesterReducer from "./features/semester/semesterSlice";
import authReducer from "./features/auth/authSlice";
import { injectStore } from "@/lib/api";

export const store = configureStore({
  reducer: {
    semester: semesterReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Give the axios client access to the store for reading the access token
// and dispatching auth actions on refresh/logout, without a circular import.
injectStore(store);