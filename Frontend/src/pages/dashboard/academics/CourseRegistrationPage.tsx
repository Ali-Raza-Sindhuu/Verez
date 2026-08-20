// src/pages/CourseRegistrationPage.tsx
import { useNavigate } from "react-router-dom";
import CourseRegistration from "./registration/CourseRegistration";

export default function CourseRegistrationPage() {
  const navigate = useNavigate();

  return (
    <CourseRegistration
      onBack={() => navigate("/dashboard/courses")}
      onDone={() => navigate("/dashboard/courses")}
    />
  );
}