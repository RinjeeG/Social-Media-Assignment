import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostList from './components/PostList';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import NavBar from './components/NavBar';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  // This component can use useAuth since it's inside AuthProvider
  const { token } = useAuth();

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/posts"
          element={token ? <PostList /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={token ? <ProfilePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>Sastagram</h1>
        </header>
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;