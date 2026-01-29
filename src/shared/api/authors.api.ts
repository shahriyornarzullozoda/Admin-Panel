import api from "../api/api";

export interface AddAuthorPayload {
  name: string;
  lastName: string;
  secondName: string;
  email: string;
  description: string;
  shortDescription: string;
  avatar?: File | null;
}

export interface UpdateAuthorPayload {
  name: string;
  lastName: string;
  secondName: string;
  email: string;
  shortDescription: string;
  description: string;
  avatar?: File | null;
  removeAvatar?: boolean;
}

export interface Avatar {
  id: number;
  name: string;
  url: string;
  createdAt: string;
}

export interface Author {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  email?: string;
  shortDescription?: string;
  description?: string;
  avatar: Avatar | null;
  createdAt: string;
  updatedAt: string;
}

export const addAuthor = async (payload: AddAuthorPayload): Promise<Author> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('lastName', payload.lastName);
  formData.append('secondName', payload.secondName);
  formData.append('email', payload.email);
  formData.append('shortDescription', payload.shortDescription);
  formData.append('description', payload.description);
  
  if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  }

  const response = await api.post('/manage/authors/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateAuthor = async (id: number, payload: UpdateAuthorPayload): Promise<Author> => {
  const formData = new FormData();
  formData.append('id', id.toString());
  formData.append('name', payload.name);
  formData.append('lastName', payload.lastName);
  formData.append('secondName', payload.secondName);
  formData.append('email', payload.email);
  formData.append('shortDescription', payload.shortDescription);
  formData.append('description', payload.description);
  
  if (payload.removeAvatar) {
    formData.append('removeAvatar', 'true');
  } else if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  }

  const response = await api.post(`/manage/authors/edit?id=${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
export const getAuthorById = async (id: number): Promise<Author> => {
  const response = await api.get(`/manage/authors/detail?id=${id}`);
  return response.data;
};

export const getAllAuthors = async (): Promise<Author[]> => {
  const response = await api.get('/authors');
  return response.data;
};

export const deleteAuthor = async (id: number): Promise<void> => {
  await api.delete(`/manage/authors/remove?id=${id}`);
};

export const deleteMultipleAuthors = async (ids: number[]): Promise<void> => {
  await api.post(`/manage/authors/remove?id=${ids}`);
};