import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Neuro Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/posts" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Posts
                </Link>
                {user.role === 'student' && (
                  <Link to="/doctors" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                    Find Doctors
                  </Link>
                )}
                {user.role !== 'admin' && (
                  <Link to="/sessions" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                    Sessions
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 text-sm">
                    Welcome, <span className="font-medium">{user.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/posts"
                    className="block px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Posts
                  </Link>
                  {user.role === 'student' && (
                    <Link
                      to="/doctors"
                      className="block px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Find Doctors
                    </Link>
                  )}
                  {user.role !== 'admin' && (
                    <Link
                      to="/sessions"
                      className="block px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sessions
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="px-3 py-2">
                    <p className="text-gray-700 text-sm mb-2">
                      Welcome, <span className="font-medium">{user.name}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/login"
                    className="block text-center text-emerald-600 hover:text-emerald-700 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;