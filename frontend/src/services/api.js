import axios from 'axios';

const api = axios.create({
  baseURL: 'https://devel-up-analytics-backend.vercel.app/api', // your backend 
});

export default api;
