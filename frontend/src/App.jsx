import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AboutProject from "./pages/AboutProject.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import InterviewAssistant from "./pages/InterviewAssistant.jsx";
import JDMatch from "./pages/JDMatch.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import ResumeUpload from "./pages/ResumeUpload.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutProject />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/jd-match" element={<JDMatch />} />
          <Route path="/interview" element={<InterviewAssistant />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
