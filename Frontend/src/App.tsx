import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Calendar from "./pages/Calender";
import Assignments from "./pages/Assignments";
import ExamsQuizzes from "./pages/Exams&Quizez";
import { useApi } from "@/lib/api";
import { useEffect } from "react";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import StudyPlanner from "./pages/StudyPlanner";
import Notes from "./pages/Notes";



export default function App() {
  const { apiFetch } = useApi();
  useEffect(() => {
    async function testConnection() {
      try {
        const response = await apiFetch("/health");

        const data = await response.json();

        console.log("✅ Backend connected:", data);
      } catch (error) {
        console.error("❌ Backend connection failed:", error);
      }
    }

    testConnection();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses/>} />
          <Route path="calendar" element={<Calendar/>} />
          <Route path="assignments" element={<Assignments/>} />
          <Route path="exams" element={<ExamsQuizzes/>} />
          <Route path="attendance" element={<Attendance/>} />
          <Route path="grades" element={<Grades/>} />
          <Route path="tasks" element={<Tasks/>} />
          <Route path="planner" element={<StudyPlanner/>} />
          <Route path="notes" element={<Notes/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}