import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostList from './components/PostList';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Signup from './components/Signup';

const AppContent: React.FC = () => {
  const { token } = useAuth();

  return (
    <Router>
      {token && <NavBar />} {/* Render NavBar only if logged in */}
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={!token ? <HomePage /> : <Navigate to="/posts" />}
          />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/posts" />}
          />
          <Route
            path="/signup"
            element={<Signup />} // Placeholder, update later
          />
          <Route
            path="/posts"
            element={token ? <PostList /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={token ? <ProfilePage /> : <Navigate to="/" />}
          />
          
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;