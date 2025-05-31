import { useAuth } from '../hooks/useAuth';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

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
          <a 
            href={isAuthenticated ? "/admin/dashboard" : "/admin"}
            className="text-blue-600 hover:text-blue-800">
            {isAuthenticated ? "Panou Admin" : "Autentificare"}
          </a>
        </div>
      </div>
    </nav>
  );
}