import { useState } from 'react';
import { addAuthor, AddAuthorPayload, Author } from '../../shared/api/authors.api';

const AddAuthorPage: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const payload: AddAuthorPayload = { 
        name, 
        lastName, 
        secondName, 
        email, 
        shortDescription,
        description, 
        avatar 
      };
      const newAuthor: Author = await addAuthor(payload);
      alert(`Автор ${newAuthor.name} ${newAuthor.lastName} успешно добавлен ✅`);
      setName('');
      setLastName('');
      setSecondName('');
      setEmail('');
      setShortDescription('');
      setDescription('');
      setAvatar(null);
      setAvatarPreview(null);
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

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 p-4 bg-white rounded shadow">
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
        <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full" />
        {errors.avatar && <p className="text-red-600 text-sm mt-1">{errors.avatar}</p>}

        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Превью аватара"
            className="mt-2 w-24 h-24 object-cover rounded"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {loading ? 'Сохранение...' : 'Добавить автора'}
      </button>
    </form>
  );
};

export default AddAuthorPage;