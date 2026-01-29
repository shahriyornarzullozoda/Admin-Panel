import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://rest-test.machineheads.ru',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(config => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/token-refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');
      
      if (!refreshToken) {
        console.warn('Нет refresh-токена → перенаправление на логин');
        isRefreshing = false;
        processQueue(new Error('No refresh token'), null);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }

      try {
        const formData = new FormData();
        formData.append('refresh_token', refreshToken);

        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/token-refresh`,
          formData,
        );

        const {
          access_token,
          refresh_token: newRefresh,
          access_expired_at,
          refresh_expired_at,
        } = data;
        
        const accessDate = new Date(access_expired_at * 1000);
        const refreshDate = new Date(refresh_expired_at * 1000);
        
        Cookies.set('access_token', access_token, {
          expires: accessDate,
          secure: true,
          sameSite: 'strict',
        });

        Cookies.set('refresh_token', newRefresh, {
          expires: refreshDate,
          secure: true,
          sameSite: 'strict',
        });
        
        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        processQueue(null, access_token);
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Refresh failed:', {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
        });

        processQueue(refreshError, null);
        isRefreshing = false;

        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;