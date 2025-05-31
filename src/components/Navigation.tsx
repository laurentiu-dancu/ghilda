import { useAuth } from '../hooks/useAuth';

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-earth-800 hover:text-earth-600 transition-colors">
          Ghilda Călătorilor
        </a>
        <div className="space-x-6">
          <a href="/calatorii" className="text-earth-600 hover:text-earth-800 transition-colors">
            Călătorii
          </a>
          <a href="/despre" className="text-earth-600 hover:text-earth-800 transition-colors">
            Despre
          </a>
          <a href="/admin" className="bg-forest-600 text-white px-4 py-2 rounded-md hover:bg-forest-700 transition-colors">
            {isAuthenticated ? "Panou Admin" : "Autentificare"}
          </a>
        </div>
      </div>
    </nav>
  );
}