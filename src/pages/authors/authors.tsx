import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { User, Edit2, Trash2, Loader2, Eye, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../shared/api/api';
import { useNavigate } from 'react-router-dom';
import { deleteAuthor, deleteMultipleAuthors } from '../../shared/api/authors.api';

interface Author {
  id: number;
  name: string;
  lastName: string;
  secondName?: string;
  avatar?: { url?: string } | string;
  updatedAt: string;
  createdAt: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    authorId?: number;
    authorName?: string;
    isMultiple?: boolean;
  }>({ isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const getFullName = (author: Author) =>
    [author.name, author.secondName, author.lastName]
      .filter(Boolean)
      .join(' ') || 'Без имени';

  const getAvatarUrl = (avatar?: { url?: string } | string) => {
    if (!avatar) return null;
    if (typeof avatar === 'string') return avatar;
    return avatar.url || null;
  };

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/manage/authors');
      setAuthors(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openDeleteModal = (id: number, name: string) => {
    setDeleteModal({ isOpen: true, authorId: id, authorName: name, isMultiple: false });
  };

  const openMultipleDeleteModal = () => {
    if (selectedIds.length === 0) {
      return;
    }
    setDeleteModal({ isOpen: true, isMultiple: true });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.isMultiple) {
        await deleteMultipleAuthors(selectedIds);
       setSelectedIds([]);
      } else if (deleteModal.authorId) {
        await deleteAuthor(deleteModal.authorId);
      }
      fetchAuthors();
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === authors.length ? [] : authors.map(a => a.id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-black">
              Авторы
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Управление списком авторов · {authors.length} записей
            </p>
          </div>

          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={openMultipleDeleteModal}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 
                  bg-red-600 hover:bg-red-700 
                  text-white font-medium rounded-xl 
                  shadow-sm hover:shadow-md transition-all
                "
              >
                <Trash2 className="w-5 h-5" />
                Удалить выбранные ({selectedIds.length})
              </button>
            )}
            <button
              onClick={() => navigate('/addAuthors')}
              className="
                inline-flex items-center gap-2 px-5 py-2.5 
                bg-indigo-600 hover:bg-indigo-700 
                text-white font-medium rounded-xl 
                shadow-sm hover:shadow-md transition-all
              "
            >
              <User className="w-5 h-5" />
              Добавить автора
            </button>
          </div>
        </div>

        {authors.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Авторов пока нет
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Добавьте первого автора, чтобы начать работу
            </p>
            <button onClick={() => navigate('/addAuthors')} className="text-indigo-600 hover:text-indigo-700 font-medium">
              + Создать автора
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === authors.length && authors.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-black uppercase tracking-wider">
                      Автор
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-black uppercase tracking-wider">
                      Создан
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-black dark:text-black uppercase tracking-wider">
                      Обновлён
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-black dark:text-black uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {authors.map((author) => (
                    <tr
                      key={author.id}
                      className="hover:bg-gray-50 bg-gray-800 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(author.id)}
                          onChange={() => toggleSelect(author.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getAvatarUrl(author.avatar) ? (
                            <img
                              src={getAvatarUrl(author.avatar)!}
                              alt={getFullName(author)}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {author.name?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getFullName(author)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {author.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {format(new Date(author.createdAt), 'd MMM yyyy', { locale: ru })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {format(new Date(author.updatedAt), 'd MMM yyyy HH:mm', { locale: ru })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/authors/detail/${author.id}`)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Просмотр"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/authors/edit/${author.id}`)}
                            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(author.id, getFullName(author))}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(author.id)}
                        onChange={() => toggleSelect(author.id)}
                        className="rounded border-gray-300 mt-1"
                      />
                      {getAvatarUrl(author.avatar) ? (
                        <img
                          src={getAvatarUrl(author.avatar)!}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-semibold text-indigo-600">
                          {author.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {getFullName(author)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID {author.id}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/authors/detail/${author.id}`)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => navigate(`/authors/edit/${author.id}`)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(author.id, getFullName(author))}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Создан</div>
                      <div className="font-medium">
                        {format(new Date(author.createdAt), 'd MMM yyyy', { locale: ru })}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Обновлён</div>
                      <div className="font-medium">
                        {format(new Date(author.updatedAt), 'd MMM yyyy', { locale: ru })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {deleteModal.isMultiple ? 'Удалить авторов' : 'Удалить автора'}
                  </h3>
                  <p className="text-sm text-gray-500">Это действие нельзя отменить</p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isDeleting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              {deleteModal.isMultiple ? (
                <p className="text-gray-700">
                  Вы уверены, что хотите удалить <strong>{selectedIds.length}</strong> авторов?
                </p>
              ) : (
                <p className="text-gray-700">
                  Вы уверены, что хотите удалить автора <strong>{deleteModal.authorName}</strong>?
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                disabled={isDeleting}
              >
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  'Удалить'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}