import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* pages */
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Home from "./components/pages/Home";
import Profile from "./components/pages/User/Profile"
import { UserProvider } from "./context/UserContext";
import Message from './components/layout/Message'
import Team from "./components/pages/Team/Team";
import Task from "./components/pages/Task/Task";
import UpdateTeam from "./components/pages/Team/UpdateTeam";
import ListTeam from "./components/pages/Team/ListTeam";
import UpdateTask from "./components/pages/Task/UpdateTask";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {

  return (
      <Router>
        <UserProvider>
        <Message /> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/editteam/:id" element={<ProtectedRoute><UpdateTeam /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/listteam" element={<ProtectedRoute><ListTeam /></ProtectedRoute>} />
            <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
            <Route path="/updatetask/:id" element={<ProtectedRoute><UpdateTask /></ProtectedRoute>} />
          </Routes>
        </UserProvider>
      </Router>
  );
}

export default App;
