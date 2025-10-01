import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import './App.css';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>Sastagram</h1>
        </header>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;