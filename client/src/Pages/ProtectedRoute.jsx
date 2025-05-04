import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, setShowAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
      navigate('/');
    }
  }, [currentUser, navigate, setShowAuthModal]);

  return currentUser ? children : null;
};

export default ProtectedRoute;
