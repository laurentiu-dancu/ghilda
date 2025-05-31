import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log('Navigation session changed:', {
      isAuthenticated,
      userEmail: user?.email,
      hasUser: !!user,
      metadata: user?.user_metadata
    });
  }, [user, isAuthenticated]);

  return (
    <nav className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-gray-800">
          Ghilda Călătorilor
        </a>
        <div className="space-x-4">
          <a href="/calatorii" className="text-gray-600 hover:text-gray-900">
            Călătorii
          </a>
          <a href="/despre" className="text-gray-600 hover:text-gray-900">
            Despre
          </a>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <a href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
                Panou Admin
              </a>
            </div>
          ) : (
            <a href="/admin" className="text-blue-600 hover:text-blue-800">
              Autentificare
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}