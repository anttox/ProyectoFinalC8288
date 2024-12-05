import axios from 'axios';

console.log('[Info] apiService.ts cargado');
console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
// Configurar axios para permitir cookies
axios.defaults.withCredentials = true;

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'https://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Logs para cada solicitud de Axios
API.interceptors.request.use((request) => {
  console.log('[Axios Interceptor] Iniciando solicitud...');
  console.log('[Axios Interceptor] Request method:', request.method);
  console.log('[Axios Interceptor] URL:', request.url);
  console.log('[Axios Interceptor] Headers iniciales:', request.headers);
  
  const token = localStorage.getItem('token');
  console.log('[Axios Interceptor] Token recuperado del localStorage:', token);
  
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
    console.log('[Axios Interceptor] Authorization añadido:', request.headers.Authorization);
  } else {
    console.warn('[Axios Interceptor] No se encontró un token en localStorage.');
  }

  return request;
}, (error) => {
  console.error('[Axios Interceptor] Error al configurar la solicitud:', error.message);
  return Promise.reject(error);
});

// Logs para cada respuesta de Axios
API.interceptors.response.use(
  (response) => {
    console.log('[Axios Interceptor] Respuesta recibida.');
    console.log('[Axios Interceptor] Status:', response.status);
    console.log('[Axios Interceptor] URL:', response.config.url);
    console.log('[Axios Interceptor] Data:', response.data);
    return response;
  },
  (error) => {
    console.error('[Axios Interceptor] Error recibido en la respuesta.');
    console.error('[Axios Interceptor] Status:', error.response?.status);
    console.error('[Axios Interceptor] URL:', error.response?.config.url);
    console.error('[Axios Interceptor] Mensaje:', error.message);
    return Promise.reject(error);
  }
);

// Endpoints
export const registerUser = (data: any) => {
  console.log('[Call] registerUser:', data);
  return API.post('/api/auth/register', data);
};

export const loginUser = async (data: any) => {
  console.log('[Call] loginUser:', data);
  try {
    const response = await API.post('/api/auth/login', data);

    const token = response.data.token;
    if (token) {
      console.log('[Info] Token recibido:', token);
      localStorage.setItem('token', token); // Guarda el token
      console.log('[Info] Token almacenado en localStorage.');
    } else {
      console.error('[Error] No se recibió un token en la respuesta del servidor.');
      throw new Error('No se recibió un token.');
    }

    return response;
  } catch (error: any) {
    console.error('[Error] Error durante el inicio de sesión:', error.message);
    throw error; // Opcionalmente, lanza el error para manejarlo en otra parte.
  }
};

export const fetchResources = async () => {
  console.log('[Call] fetchResources: método llamado.');
  try {
    const response = await API.get('/api/resources');
    console.log('[fetchResources] Respuesta recibida:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Axios Error]', error.response?.status, error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('No autorizado. Por favor, inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        alert('No tiene permisos para acceder a estos recursos.');
      }
    } else {
      console.error('[Unknown Error]', error);
    }
    throw error;
  }
};

export const fetchUserProfile = () => {
  console.log('[Call] fetchUserProfile: método llamado.');
  return API.get('/users/profile');
};

export default API;
