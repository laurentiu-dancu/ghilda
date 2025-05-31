import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface PostFormProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    location?: string;
    duration?: string;
    difficulty?: 'ușor' | 'mediu' | 'dificil';
    published?: boolean;
  };
}

export default function PostForm({ initialData = {} }: PostFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    location: initialData.location || '',
    duration: initialData.duration || '',
    difficulty: initialData.difficulty || 'mediu',
    published: initialData.published || false,
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (initialData.id) {
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', initialData.id);
        
        if (error) throw error;
        setMessage('Articolul a fost actualizat cu succes!');
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([{ ...formData, user_id: user?.id }]);
        
        if (error) throw error;
        setMessage('Articolul a fost creat cu succes!');
        
        // Reset form after successful creation
        setFormData({
          title: '',
          content: '',
          location: '',
          duration: '',
          difficulty: 'mediu',
          published: false,
        });
      }
    } catch (error) {
      setMessage(`Eroare: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setMessage('Trebuie să fii autentificat pentru a crea articole.');
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ opacity: user ? 1 : 0.5 }}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Titlu</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Conținut</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Locație</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Durată</label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dificultate</label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'ușor' | 'mediu' | 'dificil' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={!user}
        >
          <option value="ușor">Ușor</option>
          <option value="mediu">Mediu</option>
          <option value="dificil">Dificil</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm"
          disabled={!user}
        />
        <label className="ml-2 text-sm text-gray-700">Publicat</label>
      </div>

      <button
        type="submit"
        disabled={isLoading || !user}
        className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? 'Se procesează...' : initialData.id ? 'Actualizează' : 'Creează'}
      </button>

      {message && (
        <p className={`mt-4 text-sm text-center ${
          message.startsWith('Eroare') ? 'text-red-600' : 'text-green-600'
        }`}>
          {message}
        </p>
      )}
    </form>
  );
}