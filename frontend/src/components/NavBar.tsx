import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!token) return;
    try {
      await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setToken(null);
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/posts" className="hover:text-gray-300">Posts</Link>
          <Link to="/profile" className="hover:text-gray-300">Profile</Link>
        </div>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;