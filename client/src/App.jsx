import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Sessions from './pages/Sessions';
import StudentProfile from './pages/StudentProfile';
import Chat from './pages/Chat';
import AIChat from './pages/AIChat';
import AdminPanel from './pages/AdminPanel';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect admin users to admin panel, others to dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={user && user.role === 'admin' ? <Navigate to="/admin" /> : <Home />} />
        <Route path="/login" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Login />} />
        <Route path="/register" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Register />} />
        <Route path="/ai-chat" element={user && user.role === 'admin' ? <Navigate to="/admin" /> : <AIChat />} />
        
        <Route path="/dashboard" element={
          user && user.role === 'admin' ? <Navigate to="/admin" /> : (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )
        } />
        
        <Route path="/posts" element={
          user && user.role === 'admin' ? <Navigate to="/admin" /> : (
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          )
        } />
        
        <Route path="/doctors" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Doctors />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor/:doctorId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DoctorProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/sessions" element={
          user && user.role === 'admin' ? <Navigate to="/admin" /> : (
            <ProtectedRoute>
              <Sessions />
            </ProtectedRoute>
          )
        } />
        
        <Route path="/student/:studentId" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <StudentProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/chat/:sessionId" element={
          user && user.role === 'admin' ? <Navigate to="/admin" /> : (
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          )
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;