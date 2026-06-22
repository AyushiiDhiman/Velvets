import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MoodSelect from './pages/MoodSelect';
import Playlist from './pages/Playlist';
import Library from './pages/Library';
import BookSelect from './pages/BookSelect';
import BookPlaylist from './pages/BookPlaylist';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader" /></div>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
    <Routes>
  <Route path="/login" element={user ? <Navigate to="/mood" /> : <Login />} />
  <Route path="/register" element={user ? <Navigate to="/mood" /> : <Register />} />
  <Route path="/mood" element={<ProtectedRoute><MoodSelect /></ProtectedRoute>} />
  <Route path="/playlist/:mood" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
  <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
  <Route path="/books" element={<ProtectedRoute><BookSelect /></ProtectedRoute>} />
  <Route path="/books/:category" element={<ProtectedRoute><BookPlaylist /></ProtectedRoute>} />
  <Route path="*" element={<Navigate to={user ? "/mood" : "/login"} />} />
</Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          theme="light"
          toastStyle={{ borderRadius: '12px', fontFamily: 'DM Sans' }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
