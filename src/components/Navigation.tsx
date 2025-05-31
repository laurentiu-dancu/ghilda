import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { session, loading } = useAuth();
  const isAuthenticated = !!session;
  
  console.log('Navigation render:', { isAuthenticated, userEmail: session?.user?.email, loading });

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
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{session.user.email}</span>
              <a href="/admin" className="text-blue-600 hover:text-blue-800">
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