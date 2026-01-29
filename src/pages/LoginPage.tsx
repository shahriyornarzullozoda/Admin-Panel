import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../modules/auth/authSlice';
import { AppDispatch, RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) return console.error('Email или пароль пустые');

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  try {
    await dispatch(loginUser(formData)).unwrap();
    navigate('/profile'); 
  } catch (err) {
    console.error('Login error:', err);
  }
};



  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
