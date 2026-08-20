import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAppDispatch } from "@/store/hooks";
import { bootstrapAuth } from "@/store/features/auth/authSlice";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Public
import Home from "@/pages/marketing/Home";
import NotFound from "@/pages/NotFound";

// Auth
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import OAuthCallback from "@/pages/auth/OAuthCallback";

// Dashboard shell
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

// Overview
import Dashboard from "@/pages/dashboard/overview/Dashboard";
import Calendar from "@/pages/dashboard/overview/Calendar";

// Academics
import Courses from "@/pages/dashboard/academics/Courses";
import CourseRegistrationPage from "@/pages/dashboard/academics/CourseRegistrationPage";
import Assignments from "@/pages/dashboard/academics/Assignments";
import ExamsQuizzes from "@/pages/dashboard/academics/ExamsQuizzes";
import Grades from "@/pages/dashboard/academics/Grades";
import Attendance from "@/pages/dashboard/academics/Attendance";

// Study
import Tasks from "@/pages/dashboard/study/Tasks";
import StudyPlanner from "@/pages/dashboard/study/StudyPlanner";
import Notes from "@/pages/dashboard/study/Notes";
import Projects from "@/pages/dashboard/study/Projects";

// Campus
import GroupsTeams from "@/pages/dashboard/campus/GroupsTeams";
import Announcements from "@/pages/dashboard/campus/Announcements";
import Messages from "@/pages/dashboard/campus/Messages";

// Insights
import Progress from "@/pages/dashboard/insights/Progress";
import AiStudyAssistant from "@/pages/dashboard/insights/AiStudyAssistant";

// Account
import Notifications from "@/pages/dashboard/account/Notifications";
import Settings from "@/pages/dashboard/account/Settings";
import Profile from "@/pages/dashboard/account/Profile";

export default function App() {
  const dispatch = useAppDispatch();

  // On app load, silently try to exchange the refresh-token cookie (if any)
  // for a fresh access token, so refreshing the page doesn't log you out.
  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing page */}
        <Route path="/" element={<Home />} />

        {/* Auth pages — always accessible, no auto-redirect based on login state */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Authenticated app — everything under here requires a valid session */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Overview */}
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />

            {/* Academics */}
            <Route path="courses" element={<Courses />} />
            <Route path="courses/register" element={<CourseRegistrationPage />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="exams" element={<ExamsQuizzes />} />
            <Route path="grades" element={<Grades />} />
            <Route path="attendance" element={<Attendance />} />

            {/* Study */}
            <Route path="tasks" element={<Tasks />} />
            <Route path="planner" element={<StudyPlanner />} />
            <Route path="notes" element={<Notes />} />
            <Route path="projects" element={<Projects />} />

            {/* Campus */}
            <Route path="groups" element={<GroupsTeams />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="messages" element={<Messages />} />

            {/* Insights */}
            <Route path="progress" element={<Progress />} />
            <Route path="assistant" element={<AiStudyAssistant />} />

            {/* Account */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all — must stay last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}