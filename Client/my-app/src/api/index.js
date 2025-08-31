import axios from 'axios';


const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});


// Attach JWT
api.interceptors.request.use((config) => {
const token = localStorage.getItem('akh_token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});


// Basic error normalization
api.interceptors.response.use(
(res) => res,
(err) => {
const msg = err?.response?.data?.message || err.message || 'Request failed';
return Promise.reject(new Error(msg));
}
);


export default api;