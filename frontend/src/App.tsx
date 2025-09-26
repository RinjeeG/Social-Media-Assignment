import React from 'react';
import PostList from './components/PostList';
import Login from './components/Login';
import './App.css';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>Sastagram</h1>
        </header>
        <Login />
        <PostList />
      </div>
    </AuthProvider>
  );
};

export default App;