import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentSemester,
  selectSelectedSemester,
  selectSemesters,
  setSelectedSemesterId,
} from "../store/features/semester/semesterSlice";

// ---- Convenience hook (keeps component code decoupled from raw dispatch/selector calls) ----

export function useSemester() {
  const dispatch = useAppDispatch();
  const semesters = useAppSelector(selectSemesters);
  const currentSemester = useAppSelector(selectCurrentSemester);
  const selectedSemester = useAppSelector(selectSelectedSemester);

  return {
    semesters,
    currentSemester,
    selectedSemester,
    setSelectedSemesterId: (id: string) => dispatch(setSelectedSemesterId(id)),
  };
}

// ---- Root provider composition ----
// Clerk / QueryClient providers will wrap around the Redux Provider here later,
// per ARCHITECTURE.md's target provider stack (Clerk -> QueryClient -> Redux).

export function AppProviders({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}