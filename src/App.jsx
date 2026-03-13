import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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


function App() {

  return (
      <Router>
        <UserProvider>
        <Message /> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editteam/:id" element={<UpdateTeam />} />
            <Route path="/team" element={<Team />} />
            <Route path="/listteam" element={<ListTeam />} />
            <Route path="/task" element={<Task />} />
            <Route path="/updatetask/:id" element={<UpdateTask />} />
          </Routes>
        </UserProvider>
      </Router>
  );
}

export default App;
