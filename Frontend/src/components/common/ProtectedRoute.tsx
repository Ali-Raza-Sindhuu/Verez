import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { selectAuthStatus } from "@/store/features/auth/authSlice";
import LoadingScreen from "./LoadingScreen";

// Wrap protected route groups with this. Shows a loading screen while the
// initial bootstrapAuth() call is in flight, so we don't flash a redirect
// to /login before we know whether the refresh-token cookie is valid.
// Remembers the attempted URL so login can send the user back afterward.
export default function ProtectedRoute() {
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return <LoadingScreen />;
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
