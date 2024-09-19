import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:3001/api', // your backend URL
=======
  baseURL: 'https://devel-up-analytics-backend.vercel.app/api', // your backend URL
>>>>>>> origin/main
});

export default api;
