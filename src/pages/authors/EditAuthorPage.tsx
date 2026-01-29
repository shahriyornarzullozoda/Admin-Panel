import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateAuthor, getAuthorById, UpdateAuthorPayload,  } from '../../shared/api/authors.api';

const EditAuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAuthor = async () => {
      if (!id) return;

      try {
        const author = await getAuthorById(Number(id));
        setName(author.name);
        setLastName(author.lastName);
        setSecondName(author.secondName || '');
        setEmail(author.email || '');
        setShortDescription(author.shortDescription || '');
        setDescription(author.description || '');
        if (author.avatar) {
          setAvatarPreview(author.avatar.url);
        }
      } catch (err) {
        navigate('/authors');
      } finally {
        setFetching(false);
      }
    };

    loadAuthor();
  }, [id, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);
    setRemoveAvatar(false);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setErrors({});
    setLoading(true);

    try {
      const payload: UpdateAuthorPayload = {
        name,
        lastName,
        secondName,
        email,
        shortDescription,
        description,
        avatar,
        removeAvatar,
      };

      await updateAuthor(Number(id), payload);
      navigate('/authors');
    } catch (err: any) {
      if (Array.isArray(err.response?.data)) {
        const fieldErrors: Record<string, string> = {};
        err.response.data.forEach((e: { field: string; message: string }) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Редактировать автора</h2>

      <div>
        <input
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Имя"
          className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          placeholder="Фамилия"
          className={`w-full border p-2 rounded ${errors.lastName ? 'border-red-500' : ''}`}
        />
        {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
      </div>

      <div>
        <input
          name="secondName"
          value={secondName}
          onChange={e => setSecondName(e.target.value)}
          placeholder="Отчество"
          className={`w-full border p-2 rounded ${errors.secondName ? 'border-red-500' : ''}`}
        />
        {errors.secondName && <p className="text-red-600 text-sm mt-1">{errors.secondName}</p>}
      </div>

      <div>
        <input
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <textarea
          name="shortDescription"
          value={shortDescription}
          onChange={e => setShortDescription(e.target.value)}
          placeholder="Краткое описание"
          className={`w-full border p-2 rounded ${errors.shortDescription ? 'border-red-500' : ''}`}
          rows={2}
        />
        {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription}</p>}
      </div>

      <div>
        <textarea
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Полное описание"
          className={`w-full border p-2 rounded ${errors.description ? 'border-red-500' : ''}`}
          rows={4}
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Аватар</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full mb-2" />
        {errors.avatar && <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>}

        {avatarPreview && !removeAvatar && (
          <div className="mt-2">
            <img
              src={avatarPreview}
              alt="Превью аватара"
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="mt-2 text-red-600 text-sm underline"
            >
              Удалить аватар
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/authors')}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default EditAuthorPage;