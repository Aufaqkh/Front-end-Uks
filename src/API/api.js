import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// FUNGSI SUPREMO: Otomatis nempel token tiap kali Vue nembak Laravel bray!
api.interceptors.request.use(
  (config) => {
    // Ambil token fresh langsung dari localStorage tiap kali ada request
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;