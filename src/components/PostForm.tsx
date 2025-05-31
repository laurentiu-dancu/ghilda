import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '../hooks/useAuth';

const supabase = createBrowserClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

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

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Titlu</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Conținut</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Locație</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Durată</label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
          disabled={!user}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">Dificultate</label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'ușor' | 'mediu' | 'dificil' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
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
          className="rounded border-gray-300 text-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-500"
          disabled={!user}
        />
        <label className="ml-2 text-sm text-gray-700">Publicat</label>
      </div>

      <button
        type="submit"
        disabled={isLoading || !user}
        className="w-full bg-forest-600 text-white rounded-md py-2 hover:bg-forest-700 disabled:bg-forest-400 transition-colors"
      >
        {isLoading ? 'Se procesează...' : initialData.id ? 'Actualizează' : 'Creează'}
      </button>

      {message && (
        <p className={`mt-4 text-sm text-center ${
          message.startsWith('Eroare') ? 'text-red-600' : 'text-green-600'
        } font-medium`}>
          {message}
        </p>
      )}
    </form>
  );
}