import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-xl font-bold text-yellow-400 hover:text-yellow-300">
          Sastagram
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 w-full md:w-auto`}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0">
            <Link
              to="/"
              className={`hover:text-gray-300 ${location.pathname === '/' ? 'text-yellow-400' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/posts"
              className={`hover:text-gray-300 ${location.pathname === '/posts' ? 'text-yellow-400' : ''}`}
            >
              Posts
            </Link>
            <Link
              to="/profile"
              className={`hover:text-gray-300 ${location.pathname === '/profile' ? 'text-yellow-400' : ''}`}
            >
              Profile
            </Link>
          </div>
          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0 md:ml-4"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;