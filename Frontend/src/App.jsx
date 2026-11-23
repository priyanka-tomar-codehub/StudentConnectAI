import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import MentorProfile from "./pages/MentorProfile";
import MockInterview from "./pages/MockInterview";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      
     
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/student-dashboard"
          element={<ProtectedRoute allowedRole = "student">
      <StudentDashboard />
    </ProtectedRoute>}
        />

        <Route
          path="/mentor-dashboard"
          element={<ProtectedRoute allowedRole = "alumni">
      <MentorDashboard />
    </ProtectedRoute>}
        />
          
      <Route
        path="/mentor/:id"
        element={
          <ProtectedRoute allowedRole="student">
            <MentorProfile />
          </ProtectedRoute>
        }
      />    

      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute allowedRole="student">
            <MockInterview />
          </ProtectedRoute>
        }
      />
 
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

       <Route
    path="/chat/:chatId"
    element={
        <ProtectedRoute allowedRole={["student", "alumni"]}>
            <ChatPage />
        </ProtectedRoute>
    }
/>
              
      </Routes>
    </BrowserRouter>
  );
}

export default App;

