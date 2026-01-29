import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PostsPage from './pages/PostsPage';
import AuthorsPage from './pages/authors/authors';
import AdminLayout from './layouts/AdminLayout';
import AddAuthorPage from './pages/authors/AddAuthorPage';
import EditAuthorPage from './pages/authors/EditAuthorPage';
import AuthorDetailPage from './pages/authors/AuthorDetailPage';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
          <Route element={<AdminLayout />}>
        <Route path="/profile" element={<PostsPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/addAuthors" element={<AddAuthorPage />} />
        <Route path="/authors/edit/:id" element={<EditAuthorPage />} />
        <Route path="/authors/detail/:id" element={<AuthorDetailPage />} />
      </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}


