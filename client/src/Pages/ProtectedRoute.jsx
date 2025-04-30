// ProtectedRoute.js

import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, setShowAuthModal } = useAuth();

  if (!token) {
    setShowAuthModal(true); // trigger modal
    return null; // don't render protected content
  }

  return children;
};

export default ProtectedRoute;
