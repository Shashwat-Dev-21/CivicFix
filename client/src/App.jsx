import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateIssue from './pages/CreateIssue';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import IssueDetails from './pages/IssueDetails';
import EditIssue from './pages/EditIssue';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (

    <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="max-w-5xl mx-auto px-4 py-6">
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

          <Route
            path="/issues/:id/edit"
            element={
              <ProtectedRoute>
                <EditIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
      </Routes>
    </main>
  </div>
    );
}

export default App;