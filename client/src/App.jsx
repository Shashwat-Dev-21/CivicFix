import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateIssue from './pages/CreateIssue';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import IssueDetails from './pages/IssueDetails';



function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/issues/:id" element={<IssueDetails />} />
        
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateIssue />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;