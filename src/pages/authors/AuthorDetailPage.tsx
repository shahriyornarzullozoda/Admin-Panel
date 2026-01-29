import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorById, Author } from '../../shared/api/authors.api';

const AuthorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthor = async () => {
      if (!id) return;

      try {
        const data = await getAuthorById(Number(id));
        setAuthor(data);
      } catch (err) {
        navigate('/authors');
      } finally {
        setLoading(false);
      }
    };

    loadAuthor();
  }, [id, navigate]);

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (!author) return <div className="p-4">Автор не найден</div>;

  return (
    <div className="p-4 max-w-2xl">
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">
            {author.lastName} {author.name} {author.secondName}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/authors/edit/${author.id}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
            >
              Редактировать
            </button>
            <button
              onClick={() => navigate('/authors')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl"
            >
              Назад
            </button>
          </div>
        </div>

        {author.avatar && (
          <div className="mb-6">
            <img
              src={author.avatar.url}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p>{author.email || '—'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Краткое описание</h3>
            <p>{author.shortDescription || '—'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700">Полное описание</h3>
            <p className="whitespace-pre-wrap">{author.description || '—'}</p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Создан: {new Date(author.createdAt).toLocaleString('ru-RU')}
            </p>
            <p className="text-sm text-gray-500">
              Обновлен: {new Date(author.updatedAt).toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailPage;